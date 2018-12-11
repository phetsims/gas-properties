// Copyright 2018, University of Colorado Boulder

//TODO add drag handler for lid
/**
 * View of the Container. Location of the right edge of the container remains fixed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const HandleNode = require( 'SCENERY_PHET/HandleNode' );
  const LidNode = require( 'GAS_PROPERTIES/common/view/LidNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // constants
  const HANDLE_ATTACHMENT_LINE_WIDTH = 1;

  class ContainerNode extends Node {

    /**
     * @param {Container} container
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options]
     * @constructor
     */
    constructor( container, modelViewTransform, options ) {

      options = options || {};

      // Constant aspects of the container, in view coordinates
      const viewLocation = modelViewTransform.modelToViewPosition( container.location );
      const viewHeight = Math.abs( modelViewTransform.modelToViewDeltaY( container.height ) );

      const rectangle = new Rectangle( 0, 0, 1, viewHeight, {
        stroke: GasPropertiesColorProfile.containerStrokeProperty,
        lineWidth: 2
      } );

      const handleNode = new HandleNode( {
        cursor: 'pointer',
        gripFillBaseColor: 'rgb( 187, 154, 86 )',
        attachmentLineWidth: HANDLE_ATTACHMENT_LINE_WIDTH,
        rotation: -Math.PI / 2,
        scale: 0.4,
        centerY: rectangle.centerY
      } );

      const lidNode = new LidNode( {
        bottom: rectangle.top + 1
      } );

      assert && assert( !options.children, 'ContainerNode sets children' );
      options.children = [ handleNode, lidNode, rectangle ];

      super( options );

      container.widthProperty.link( width => {

        // resize the container
        const viewWidth = modelViewTransform.modelToViewDeltaX( width );
        rectangle.setRect( 0, 0, viewWidth, viewHeight );

        // position the container, origin at bottom-right
        this.right = viewLocation.x;
        this.bottom = viewLocation.y;

        // reposition the handle and lid
        handleNode.right = rectangle.left + HANDLE_ATTACHMENT_LINE_WIDTH; // hide the overlap
        lidNode.right = rectangle.right - 85; //TODO this won't be appropriate when lid is movable
      } );

      //TODO position of container is wrong when you quickly drag the cursor outside the right side of the browser window
      //TODO pointer gets disconnected from handle, probably an incorrect transform here
      // Dragging the handle horizontally changes the container width
      handleNode.addInputListener( new DragListener( {
        drag: ( event, listener ) => {
          const viewX = this.globalToParentPoint( event.pointer.point ).x;
          const modelX = modelViewTransform.viewToModelX( viewX );
          const dx = container.location.x - modelX;
          container.widthProperty.value = container.widthProperty.range.constrainValue( dx );
        }
      } ) );
    }
  }

  return gasProperties.register( 'ContainerNode', ContainerNode );
} );