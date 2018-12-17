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
  const HoldConstantEnum = require( 'GAS_PROPERTIES/common/model/HoldConstantEnum' );
  const LidNode = require( 'GAS_PROPERTIES/common/view/LidNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // constants
  const HANDLE_ATTACHMENT_LINE_WIDTH = 1;
  const HANDLE_COLOR = 'rgb( 160, 160, 160 )';

  class ContainerNode extends Node {

    /**
     * @param {Container} container
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Property.<HoldConstantEnum>} holdConstantProperty
     * @param {Object} [options]
     * @constructor
     */
    constructor( container, modelViewTransform, holdConstantProperty, options ) {

      options = _.extend( {
        resizeHandleColor: HANDLE_COLOR,
        lidHandleColor: HANDLE_COLOR
      }, options );

      // Constant aspects of the container, in view coordinates
      const viewLocation = modelViewTransform.modelToViewPosition( container.location );
      const viewHeight = Math.abs( modelViewTransform.modelToViewDeltaY( container.height ) );

      const rectangle = new Rectangle( 0, 0, 1, viewHeight, {
        stroke: GasPropertiesColorProfile.containerStrokeProperty,
        lineWidth: 2
      } );

      const resizeHandleNode = new HandleNode( {
        cursor: 'pointer',
        gripFillBaseColor: options.resizeHandleColor,
        attachmentLineWidth: HANDLE_ATTACHMENT_LINE_WIDTH,
        rotation: -Math.PI / 2,
        scale: 0.4,
        centerY: rectangle.centerY
      } );

      const lidNode = new LidNode( {
        handleColor: options.lidHandleColor
      } );

      assert && assert( !options.children, 'ContainerNode sets children' );
      options.children = [ resizeHandleNode, lidNode, rectangle ];

      super( options );

      // position this Node with its origin at the container's location
      this.translation = viewLocation;

      container.widthProperty.link( width => {

        // resize & reposition the rectangle, origin at bottom right
        const viewWidth = modelViewTransform.modelToViewDeltaX( width );
        rectangle.setRect( 0, 0, viewWidth, viewHeight );
        rectangle.right = 0;
        rectangle.bottom = 0;

        // reposition the resize handle
        resizeHandleNode.right = rectangle.left + HANDLE_ATTACHMENT_LINE_WIDTH; // hide the overlap
        resizeHandleNode.centerY = rectangle.centerY;

        // reposition the lid
        lidNode.right = rectangle.right - 85; //TODO this won't be appropriate when lid is movable
        lidNode.bottom = rectangle.top + 1;
      } );

      // Hide the handle when volume is held constant
      holdConstantProperty.link( holdConstant => {
        const resizeHandleVisible = ( holdConstant !== HoldConstantEnum.VOLUME );

        // Cancel interaction when the handle becomes invisible
        if ( resizeHandleNode.visible && !resizeHandleVisible ) {
          resizeHandleNode.interruptSubtreeInput();
        }
        resizeHandleNode.visible = resizeHandleVisible;
      } );

      // Dragging the resize handle horizontally changes the container's width
      resizeHandleNode.addInputListener( new ResizeHandleDragListener( container, modelViewTransform, this ) );
    }
  }

  gasProperties.register( 'ContainerNode', ContainerNode );

  /**
   * Drag listener for the container's resize handle, changes the container's width.
   */
  class ResizeHandleDragListener extends DragListener {

    /**
     * @param {Container} container
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Node} parentNode
     */
    constructor( container, modelViewTransform, parentNode ) {

      const viewLocation = modelViewTransform.modelToViewPosition( container.location );

      // pointer's x offset from the left edge of the container, when a drag starts
      let startXOffset = 0;

      super( {

        start: ( event, listener ) => {
          const viewWidth = modelViewTransform.modelToViewDeltaX( container.widthProperty.value );
          startXOffset = viewLocation.x - parentNode.globalToParentPoint( event.pointer.point ).x - viewWidth;
        },

        drag: ( event, listener ) => {
          const viewX = parentNode.globalToParentPoint( event.pointer.point ).x;
          const modelX = modelViewTransform.viewToModelX( viewX + startXOffset );
          const width = container.location.x - modelX;
          container.widthProperty.value = container.widthProperty.range.constrainValue( width );
        }
      } );
    }
  }

  gasProperties.register( 'ContainerNode.ResizeHandleDragListener', ResizeHandleDragListener );

  return ContainerNode;
} );