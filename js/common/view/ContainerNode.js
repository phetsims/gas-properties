// Copyright 2018-2019, University of Colorado Boulder

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
  const Path = require( 'SCENERY/nodes/Path' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );

  // constants
  const HANDLE_COLOR = 'rgb( 160, 160, 160 )'; //TODO can't use color profile because HandleNode doesn't support it

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
        lidHandleColor: HANDLE_COLOR, // {Color|string} color of the lid's handle
        resizeHandleIsPressedListener: isPressed => {} // function(isPressed: boolean)
      }, options );

      // Constant aspects of the container, in view coordinates
      const viewLocation = modelViewTransform.modelToViewPosition( container.location );
      const viewHeight = Math.abs( modelViewTransform.modelToViewDeltaY( container.height ) );
      const viewWallThickness = modelViewTransform.modelToViewDeltaX( container.wallThickness );
      const viewOpeningRightInset = modelViewTransform.modelToViewDeltaX( container.openingRightInset );

      // Displays the walls of the container
      const wallsNode = new Path( null, {
        stroke: GasPropertiesColorProfile.containerBoundsStrokeProperty,
        lineWidth: viewWallThickness
      } );

      // Displays the previous bounds of the container, visible while dragging
      const previousBoundsNode = new Rectangle( 0, 0, 1, 1, {
        stroke: GasPropertiesColorProfile.containerPreviousBoundsStrokeProperty,
        lineWidth: viewWallThickness,
        visible: false
      } );

      const resizeHandleNode = new HandleNode( {
        cursor: 'pointer',
        gripBaseColor: options.resizeHandleColor,
        attachmentLineWidth: 1,
        rotation: -Math.PI / 2,
        scale: 0.4
      } );

      const lidNode = new LidNode( {
        cursor: 'pointer',
        baseWidth: modelViewTransform.modelToViewDeltaX( container.lidWidthProperty.value ),
        baseHeight: modelViewTransform.modelToViewDeltaX( container.lidThickness ),
        handleColor: options.lidHandleColor
      } );

      assert && assert( !options.hasOwnProperty( 'children' ), 'ContainerNode sets children' );
      options = _.extend( {
        children: [ previousBoundsNode, resizeHandleNode, wallsNode, lidNode ]
      }, options );

      super( options );

      container.widthProperty.link( width => {

        const viewWidth = modelViewTransform.modelToViewDeltaX( width );

        // Account for wall thickness, so that container walls are drawn around the container's model bounds.
        const wallOffset = viewWallThickness / 2;
        const left = viewLocation.x - viewWidth - wallOffset;
        const right = viewLocation.x + wallOffset;
        const top = viewLocation.y - viewHeight - wallOffset;
        const bottom = viewLocation.y + wallOffset;

        // Resize & reposition the walls, start at top-left, origin at bottom-right. Shape looks like:
        //                   ___
        // |                    |
        // |                    |
        // |                    |
        // |____________________|
        //
        wallsNode.shape = new Shape()
          .moveTo( left, top )
          .lineTo( left, bottom  )
          .lineTo( right, bottom )
          .lineTo( right, top )
          .lineTo( right - viewOpeningRightInset, top );

        // reposition the resize handle
        resizeHandleNode.right = wallsNode.left + 1; // hide the overlap
        resizeHandleNode.centerY = wallsNode.centerY;

        // resize and reposition the lid
        lidNode.left = wallsNode.left;
        lidNode.bottom = wallsNode.top + viewWallThickness;
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

      // While interacting with the resize handle, display the previous bounds of the container.
      //TODO verify that isPressedProperty is set to false when interruptSubtreeInput is called
      resizeHandleDragListener.isPressedProperty.lazyLink( isPressed => {
        previousBoundsNode.visible = isPressed;
        previousBoundsNode.setRect( wallsNode.shape.bounds.minX, wallsNode.shape.bounds.minY, wallsNode.shape.bounds.width, wallsNode.shape.bounds.height );
        options.resizeHandleIsPressedListener( isPressed );
      } );

      // Dragging the lid horizontally changes the size of the opening in the top of the container
      lidNode.addInputListener( new LidDragListener( container, modelViewTransform, this ) );
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

  /**
   * Drag listener for the container's lid, which determines the size of the opening in the top of the container.
   */
  class LidDragListener extends DragListener {

    /**
     * @param {Container} container
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Node} parentNode
     */
    constructor( container, modelViewTransform, parentNode ) {

      super( {

        start: ( event, listener ) => {
          //TODO
        },

        drag: ( event, listener ) => {
          //TODO
        }
      } );
    }
  }

  gasProperties.register( 'ContainerNode.LidDragListener', LidDragListener );

  return ContainerNode;
} );