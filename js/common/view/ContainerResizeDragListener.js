// Copyright 2019, University of Colorado Boulder

/**
 * Drag listener for resizing the container by changing its width.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const Event = require( 'SCENERY/input/Event' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesContainer = require( 'GAS_PROPERTIES/common/model/GasPropertiesContainer' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Node = require( 'SCENERY/nodes/Node' );

  class ContainerResizeDragListener extends DragListener {

    /**
     * @param {GasPropertiesContainer} container
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Node} parentNode
     */
    constructor( container, modelViewTransform, parentNode ) {
      assert && assert( container instanceof GasPropertiesContainer, `invalid container: ${container}` );
      assert && assert( modelViewTransform instanceof ModelViewTransform2,
        `invalid modelViewTransform: ${modelViewTransform}` );
      assert && assert( parentNode instanceof Node, `invalid parentNode: ${parentNode}` );

      // pointer's x offset from the left edge of the container, when a drag starts
      let startXOffset = 0;

      super( {

        start: ( event, listener ) => {
          assert && assert( event instanceof Event, `invalid event: ${event}` );
          
          const viewWidth = modelViewTransform.modelToViewX( container.left );
          startXOffset = viewWidth - parentNode.globalToParentPoint( event.pointer.point ).x;
        },

        drag: ( event, listener ) => {
          assert && assert( event instanceof Event, `invalid event: ${event}` );

          const viewX = parentNode.globalToParentPoint( event.pointer.point ).x;
          const modelX = modelViewTransform.viewToModelX( viewX + startXOffset );

          // Set the desired width, so that container will animate to new width with a speed limit.  See #90.
          container.desiredWidth = container.widthRange.constrainValue( container.right - modelX );
        },

        end: ( listener ) => {

          // Stop the animation wherever the container width happens to be when the drag ends.
          container.desiredWidth = container.widthProperty.value;
        }
      } );
    }
  }

  return gasProperties.register( 'ContainerResizeDragListener', ContainerResizeDragListener );
} );
