// Copyright 2018, University of Colorado Boulder

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
  const Shape = require( 'KITE/Shape' );

  // constants
  const HANDLE_ATTACHMENT_LINE_WIDTH = 1;
  const HANDLE_COLOR = 'rgb( 160, 160, 160 )';

  class ContainerNode extends Node {

    /**
     * @param {Container} container
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Property.<HoldConstantEnum>} holdConstantProperty
     * @param {BooleanProperty} isPlayingProperty
     * @param {BooleanProperty} isTimeControlsEnabledProperty
     * @param {Object} [options]
     * @constructor
     */
    constructor( container, modelViewTransform, holdConstantProperty, isPlayingProperty, isTimeControlsEnabledProperty, options ) {

      options = _.extend( {
        resizeHandleColor: HANDLE_COLOR, // {Color|string} color of the resize handle
        lidHandleColor: HANDLE_COLOR // {Color|string} color of the lid's handle
      }, options );

      // Constant aspects of the container, in view coordinates
      const viewLocation = modelViewTransform.modelToViewPosition( container.location );
      const viewHeight = Math.abs( modelViewTransform.modelToViewDeltaY( container.height ) );
      const viewOpeningXOffset = modelViewTransform.modelToViewDeltaX( container.openingXOffset );
      const viewOpeningMaxWidth = modelViewTransform.modelToViewDeltaX( container.openingWidthRange.max );

      // Displays the bounds of the container
      const boundsNode = new Path( null, {
        stroke: GasPropertiesColorProfile.containerBoundsStrokeProperty,
        lineWidth: 2
      } );

      // Displays the previous bounds of the container, visible while dragging
      const previousBoundsNode = new Path( null, {
        stroke: GasPropertiesColorProfile.containerPreviousBoundsStrokeProperty,
        lineWidth: 2,
        visible: false
      } );

      const resizeHandleNode = new HandleNode( {
        cursor: 'pointer',
        gripBaseColor: options.resizeHandleColor,
        attachmentLineWidth: HANDLE_ATTACHMENT_LINE_WIDTH,
        rotation: -Math.PI / 2,
        scale: 0.4
      } );

      const lidNode = new LidNode( {
        cursor: 'pointer',
        baseWidth: modelViewTransform.modelToViewDeltaX( container.openingWidthRange.max ),
        handleColor: options.lidHandleColor
      } );

      assert && assert( !options.children, 'ContainerNode sets children' );
      options.children = [ previousBoundsNode, resizeHandleNode, lidNode, boundsNode ];

      super( options );

      // position this Node with its origin at the container's location
      this.translation = viewLocation;

      container.widthProperty.link( width => {

        const viewWidth = modelViewTransform.modelToViewDeltaX( width );

        // resize & reposition the boundsNode, origin at bottom right
        boundsNode.shape = new Shape()
          .moveTo( -viewOpeningXOffset, -viewHeight )
          .lineTo( 0, -viewHeight )
          .lineTo( 0, 0 )
          .lineTo( -viewWidth, 0 )
          .lineTo( -viewWidth, -viewHeight )
          .lineTo( -( viewOpeningXOffset + viewOpeningMaxWidth ), -viewHeight );

        // reposition the resize handle
        resizeHandleNode.right = boundsNode.left + HANDLE_ATTACHMENT_LINE_WIDTH; // hide the overlap
        resizeHandleNode.centerY = boundsNode.centerY;
      } );

      // move the lid to expose the opening in the top of the container
      container.openingWidthProperty.link( openingWidth => {
        lidNode.right = boundsNode.x -
                        modelViewTransform.modelToViewDeltaX( container.openingXOffset + openingWidth );
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

      //TODO verify that isPressedProperty is set to false when interruptSubtreeInput is called
      // While interacting with the resize handle, display the previous bounds of the container
      let wasPlaying = isPlayingProperty.value;
      resizeHandleDragListener.isPressedProperty.lazyLink( isPressed => {
        previousBoundsNode.visible = isPressed;
        if ( isPressed ) {

          // show the previous bounds of the container
          previousBoundsNode.shape = boundsNode.shape;
          
          // save playing state, pause the sim, and disable time controls
          wasPlaying = isPlayingProperty.value;
          isPlayingProperty.value = false;
          isTimeControlsEnabledProperty.value = false; //TODO this has to be done last or StepButton with enable itself
        }
        else {

          // enable time controls and restore playing state
          isTimeControlsEnabledProperty.value = true;
          isPlayingProperty.value = wasPlaying;
        }
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

      const viewOpeningMaxX = modelViewTransform.modelToViewX( container.openingMaxX );

      // pointer's x offset from the right edge of the lid, when a drag starts
      let startXOffset = 0;

      super( {

        start: ( event, listener ) => {
          startXOffset = viewOpeningMaxX -
                         modelViewTransform.modelToViewDeltaX( container.openingWidthProperty.value ) -
                         parentNode.globalToParentPoint( event.pointer.point ).x;
        },

        drag: ( event, listener ) => {
          const viewX = parentNode.globalToParentPoint( event.pointer.point ).x;
          const modelX = modelViewTransform.viewToModelX( viewX + startXOffset );
          const openingWidth = container.openingMaxX - modelX;
          container.openingWidthProperty.value = container.openingWidthRange.constrainValue( openingWidth );
        }
      } );
    }
  }

  gasProperties.register( 'ContainerNode.LidDragListener', LidDragListener );

  return ContainerNode;
} );