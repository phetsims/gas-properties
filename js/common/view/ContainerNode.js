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
        resizeHandleColor: HANDLE_COLOR, // {Color|string} color of the resize handle
        lidHandleColor: HANDLE_COLOR // {Color|string} color of the lid's handle
      }, options );

      // Constant aspects of the container, in view coordinates
      const viewLocation = modelViewTransform.modelToViewPosition( container.location );
      const viewHeight = Math.abs( modelViewTransform.modelToViewDeltaY( container.height ) );

      // Displays the bounds of the container
      const boundsNode = new Rectangle( 0, 0, 1, viewHeight, {
        stroke: GasPropertiesColorProfile.containerBoundsStrokeProperty,
        lineWidth: 2
      } );

      // Displays the previous bounds of the container, visible while dragging
      const previousBoundsNode = new Rectangle( 0, 0, 1, viewHeight, {
        stroke: GasPropertiesColorProfile.containerPreviousBoundsStrokeProperty,
        lineWidth: 2,
        visible: false
      } );

      const resizeHandleNode = new HandleNode( {
        cursor: 'pointer',
        gripFillBaseColor: options.resizeHandleColor,
        attachmentLineWidth: HANDLE_ATTACHMENT_LINE_WIDTH,
        rotation: -Math.PI / 2,
        scale: 0.4,
        centerY: boundsNode.centerY
      } );

      const lidNode = new LidNode( {
        handleColor: options.lidHandleColor
      } );

      assert && assert( !options.children, 'ContainerNode sets children' );
      options.children = [ previousBoundsNode, resizeHandleNode, lidNode, boundsNode ];

      super( options );

      // position this Node with its origin at the container's location
      this.translation = viewLocation;

      container.widthProperty.link( width => {

        // resize & reposition the boundsNode, origin at bottom right
        const viewWidth = modelViewTransform.modelToViewDeltaX( width );
        boundsNode.setRect( 0, 0, viewWidth, viewHeight );
        boundsNode.right = 0;
        boundsNode.bottom = 0;

        // reposition the resize handle
        resizeHandleNode.right = boundsNode.left + HANDLE_ATTACHMENT_LINE_WIDTH; // hide the overlap
        resizeHandleNode.centerY = boundsNode.centerY;

        // reposition the lid
        lidNode.right = boundsNode.right - 85; //TODO this won't be appropriate when lid is movable
        lidNode.bottom = boundsNode.top + 1;
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
      const resizeHandleDragListener = new ResizeHandleDragListener( container, modelViewTransform, this );
      resizeHandleNode.addInputListener( resizeHandleDragListener );

      //TODO pause animation, disable particles
      // While interacting with the resize handle, display the previous bounds of the container
      resizeHandleDragListener.isPressedProperty.link( isPressed => {
        previousBoundsNode.visible = isPressed;
        if ( isPressed ) {
          const viewWidth = modelViewTransform.modelToViewDeltaX( container.widthProperty.value );
          previousBoundsNode.setRect( 0, 0, viewWidth, viewHeight );
          previousBoundsNode.right = 0;
          previousBoundsNode.bottom = 0;
        }
      } );
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