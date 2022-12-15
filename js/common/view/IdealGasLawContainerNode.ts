// Copyright 2018-2022, University of Colorado Boulder

/**
 * IdealGasLawContainerNode is the view of the container used in screens that are based on the Ideal Gas Law.
 * This container has mutable width, and a lid that can be moved/removed.
 * Do not transform this Node! It's origin must be at the origin of the view coordinate frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Utils from '../../../../dot/js/Utils.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import HandleNode from '../../../../scenery-phet/js/HandleNode.js';
import { Node, NodeOptions, Path, Rectangle, TColor } from '../../../../scenery/js/imports.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesColors from '../GasPropertiesColors.js';
import { HoldConstant } from '../model/HoldConstant.js';
import IdealGasLawContainer from '../model/IdealGasLawContainer.js';
import ContainerResizeDragListener from './ContainerResizeDragListener.js';
import LidDragListener from './LidDragListener.js';
import LidNode from './LidNode.js';

// constants
const LID_X_SPEED = -50; // pixels/second
const LID_Y_SPEED = -150; // pixels/second
const LID_ROTATION_SPEED = -50; // degrees/second

type SelfOptions = {
  resizeGripColor?: TColor; // color of resize handle's grip
  lidGripColor?: TColor; // color of the lid handle's grip
  resizeHandleIsPressedListener?: ( isPressed: boolean ) => void;
};

type IdealGasLawContainerNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class IdealGasLawContainerNode extends Node {

  private readonly container: IdealGasLawContainer;
  private readonly modelViewTransform: ModelViewTransform2;
  private readonly visibleBoundsProperty: TReadOnlyProperty<Bounds2>;
  private readonly lidNode: LidNode;

  public constructor( container: IdealGasLawContainer,
                      modelViewTransform: ModelViewTransform2,
                      holdConstantProperty: StringUnionProperty<HoldConstant>,
                      visibleBoundsProperty: TReadOnlyProperty<Bounds2>,
                      providedOptions: IdealGasLawContainerNodeOptions ) {

    const options = optionize<IdealGasLawContainerNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      resizeGripColor: GasPropertiesColors.resizeGripColorProperty, // {ColorDef} color of resize handle's grip
      lidGripColor: GasPropertiesColors.lidGripColorProperty, // {ColorDef} color of the lid handle's grip
      resizeHandleIsPressedListener: _.noop
    }, providedOptions );

    // Constant aspects of the container, in view coordinates
    const viewWallThickness = modelViewTransform.modelToViewDeltaX( container.wallThickness );
    const viewOpeningLeftInset = modelViewTransform.modelToViewDeltaX( container.openingLeftInset );
    const viewOpeningRightInset = modelViewTransform.modelToViewDeltaX( container.openingRightInset );

    // Walls of the container
    const wallsNode = new Path( null, {
      stroke: GasPropertiesColors.containerBoundsStrokeProperty,
      lineWidth: viewWallThickness
    } );

    // Previous bounds of the container, visible while dragging.
    // This is a simple rectangle, and does not need to show the previous opening in the top.
    const previousBoundsNode = new Rectangle( 0, 0, 1, 1, {
      stroke: GasPropertiesColors.containerPreviousBoundsStrokeProperty,
      lineWidth: viewWallThickness,
      visible: false
    } );

    // Resize handle on the left wall
    const resizeHandleNode = new HandleNode( {
      cursor: 'pointer',
      gripBaseColor: options.resizeGripColor,
      attachmentLineWidth: 1,
      rotation: -Math.PI / 2,
      scale: 0.4
    } );

    // Lid on the top of the container
    const lidNode = new LidNode( holdConstantProperty, {
      baseWidth: modelViewTransform.modelToViewDeltaX( container.lidWidthProperty.value ),
      baseHeight: modelViewTransform.modelToViewDeltaX( container.lidThickness ),
      gripColor: options.lidGripColor,
      tandem: options.tandem.createTandem( 'lidNode' )
    } );

    options.children = [ previousBoundsNode, resizeHandleNode, wallsNode, lidNode ];

    super( options );

    // reposition the bottom-left corner of the lid's base, handle may extend past this to the left
    const updateLidPosition = () => {
      lidNode.x = wallsNode.left;
      lidNode.y = wallsNode.top + viewWallThickness;
    };

    // Half the wall thickness, in view coordinates.
    const viewHalfWallThickness = modelViewTransform.modelToViewDeltaX( container.wallThickness / 2 );

    // Update the container when its bounds change.
    container.boundsProperty.link( bounds => {

      // Account for wall thickness, so that container walls are drawn around the container's model bounds.
      const viewBounds = modelViewTransform.modelToViewBounds( bounds ).dilate( viewHalfWallThickness );

      // Update the walls, start at top-left, origin at bottom-right. Shape looks like:
      //  __               ___
      // |                    |
      // |                    |
      // |                    |
      // |____________________|
      //
      wallsNode.shape = new Shape()
        .moveTo( viewBounds.minX + viewOpeningLeftInset, viewBounds.minY )
        .lineTo( viewBounds.minX, viewBounds.minY )
        .lineTo( viewBounds.minX, viewBounds.maxY )
        .lineTo( viewBounds.maxX, viewBounds.maxY )
        .lineTo( viewBounds.maxX, viewBounds.minY )
        .lineTo( viewBounds.maxX - viewOpeningRightInset, viewBounds.minY );

      // reposition the resize handle
      resizeHandleNode.right = wallsNode.left + 1; // hide the overlap
      resizeHandleNode.centerY = wallsNode.centerY;

      // reposition the lid if it's on the container
      if ( container.lidIsOnProperty.value ) {
        updateLidPosition();
      }
    } );

    // Update the lid width
    container.lidWidthProperty.link( lidWidth => {

      // resize the lid's base
      lidNode.setBaseWidth( modelViewTransform.modelToViewDeltaX( lidWidth ) + 1 );  // +1 to cover seam

      // reposition the lid
      updateLidPosition();
    } );

    // Hide the resize handle when volume is held constant
    holdConstantProperty.link( holdConstant => {
      resizeHandleNode.visible = ( holdConstant !== 'volume' && holdConstant !== 'pressureV' );
    } );

    // Cancel interaction when visibility of the resize handle changes.
    resizeHandleNode.visibleProperty.lazyLink( () => resizeHandleNode.interruptSubtreeInput() );

    // Dragging the resize handle horizontally changes the container's width
    const resizeDragListener = new ContainerResizeDragListener( container, modelViewTransform, this,
      options.tandem.createTandem( 'resizeDragListener' ) );
    resizeHandleNode.addInputListener( resizeDragListener );

    // While interacting with the resize handle...
    resizeDragListener.isPressedProperty.lazyLink( isPressed => {

      // disable interaction with the lid, to simplify implementation
      lidNode.interruptSubtreeInput();
      lidNode.pickable = !isPressed && container.lidIsOnProperty.value;

      // display the previous bounds of the container if the wall doesn't do work
      previousBoundsNode.visible = isPressed && !container.leftWallDoesWork;
      previousBoundsNode.setRectBounds( wallsNode.bounds );

      // Notify the listener provided by the client.
      options.resizeHandleIsPressedListener( isPressed );

      // when the handle is released, log the opening
      if ( !isPressed && container.isOpenProperty.value ) {
        phet.log && phet.log( `Lid is open: ${container.getOpeningLeft()} to ${container.getOpeningRight()} pm` );
      }
    } );

    // Dragging the lid's handle horizontally changes the size of the opening in the top of the container
    const lidDragListener = new LidDragListener( container, modelViewTransform, this,
      options.tandem.createTandem( 'lidDragListener' ) );
    lidNode.handleNode.addInputListener( lidDragListener );

    // This implementation assumes that the lid is not interactive while the container is being resized.
    // This is handled in resizeDragListener.isPressedProperty listener above.
    // The lid will behave badly if this is not the case, so verify.
    lidDragListener.isPressedProperty.lazyLink( isPressed => {
      assert && assert( !isPressed || !resizeDragListener.isPressedProperty.value,
        'the lid should be not interactive while the container is being resized' );
    } );

    container.lidIsOnProperty.link( lidIsOn => {
      if ( lidIsOn ) {

        // restore the lid to the fully-closed position
        container.lidWidthProperty.value = container.getMaxLidWidth();
        lidNode.visible = true;
        lidNode.setRotation( 0 );
        updateLidPosition();
        lidNode.visible = true;
      }
      else {
        this.interruptSubtreeInput(); // cancel interactions with the container, because we're blowing the lid off
      }

      // Lid is only interactive when it's on the container.
      lidNode.pickable = lidIsOn;
    } );

    this.container = container;
    this.modelViewTransform = modelViewTransform;
    this.visibleBoundsProperty = visibleBoundsProperty;
    this.lidNode = lidNode;
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * @param dt - delta time, in seconds
   */
  public step( dt: number ): void {
    assert && assert( dt >= 0, `invalid dt: ${dt}` );

    // Blow the lid off the container
    if ( !this.container.lidIsOnProperty.value && this.lidNode.visible ) {
      if ( this.visibleBoundsProperty.value.intersectsBounds( this.lidNode.bounds ) ) {

        // Lid is inside the visible bounds, animate it.
        const dx = LID_X_SPEED * dt;
        const dy = LID_Y_SPEED * dt;
        this.lidNode.centerX += dx;
        this.lidNode.centerY += dy;
        const dr = Utils.toRadians( LID_ROTATION_SPEED ) * dt;
        this.lidNode.rotateAround( this.lidNode.center, dr );
      }
      else {

        // Lid has left the visible bounds, hide it.
        this.lidNode.visible = false;
      }
    }
  }
}

gasProperties.register( 'IdealGasLawContainerNode', IdealGasLawContainerNode );