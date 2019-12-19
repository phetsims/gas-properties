// Copyright 2019, University of Colorado Boulder

/**
 * ContainerResizeDragListener is the drag listener for resizing the container by changing its width.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const IdealGasLawContainer = require( 'GAS_PROPERTIES/common/model/IdealGasLawContainer' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Node = require( 'SCENERY/nodes/Node' );
  const SceneryEvent = require( 'SCENERY/input/SceneryEvent' );
  const Tandem = require( 'TANDEM/Tandem' );

  class ContainerResizeDragListener extends DragListener {

    /**
     * @param {IdealGasLawContainer} container
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Node} parentNode
     * @param {Tandem} tandem
     */
    constructor( container, modelViewTransform, parentNode, tandem ) {
      assert && assert( container instanceof IdealGasLawContainer, `invalid container: ${container}` );
      assert && assert( modelViewTransform instanceof ModelViewTransform2,
        `invalid modelViewTransform: ${modelViewTransform}` );
      assert && assert( parentNode instanceof Node, `invalid parentNode: ${parentNode}` );
      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      // pointer's x offset from the left edge of the container, when a drag starts
      let startXOffset = 0;

      super( {

        start: ( event, listener ) => {
          assert && assert( event instanceof SceneryEvent, `invalid event: ${event}` );

          container.userIsAdjustingWidthProperty.value = true;

          const viewWidth = modelViewTransform.modelToViewX( container.left );
          startXOffset = viewWidth - parentNode.globalToParentPoint( event.pointer.point ).x;
        },

        drag: ( event, listener ) => {
          assert && assert( event instanceof SceneryEvent, `invalid event: ${event}` );

          const viewX = parentNode.globalToParentPoint( event.pointer.point ).x;
          const modelX = modelViewTransform.viewToModelX( viewX + startXOffset );

          const desiredWidth = container.widthRange.constrainValue( container.right - modelX );
          if ( container.leftWallDoesWork && desiredWidth < container.widthProperty.value ) {

            // When making the container smaller, limit the speed.  See #90.
            container.desiredWidth = desiredWidth;
          }
          else {

            // When making the container larger, there is no speed limit, see #90.
            container.resizeImmediately( desiredWidth );
          }
        },

        end: listener => {

          // Stop the animation wherever the container width happens to be when the drag ends.
          container.desiredWidth = container.widthProperty.value;

          container.userIsAdjustingWidthProperty.value = false;
        },

        tandem: tandem
      } );
    }
  }

  return gasProperties.register( 'ContainerResizeDragListener', ContainerResizeDragListener );
} );
