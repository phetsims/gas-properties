// Copyright 2018-2024, University of Colorado Boulder

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
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Node, NodeOptions, Path, Rectangle, TColor } from '../../../../scenery/js/imports.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesColors from '../GasPropertiesColors.js';
import { HoldConstant } from '../model/HoldConstant.js';
import IdealGasLawContainer from '../model/IdealGasLawContainer.js';
import ResizeHandleDragListener from './ResizeHandleDragListener.js';
import LidHandleDragListener from './LidHandleDragListener.js';
import LidNode from './LidNode.js';
import LidHandleKeyboardDragListener from './LidHandleKeyboardDragListener.js';
import ResizeHandleKeyboardDragListener, { ResizeHandleKeyboardDragListenerOptions } from './ResizeHandleKeyboardDragListener.js';
import Multilink from '../../../../axon/js/Multilink.js';
import ResizeHandleDragDelegate from './ResizeHandleDragDelegate.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import WallVelocityVectorNode from './WallVelocityVectorNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ResizeHandleNode from './ResizeHandleNode.js';

const LID_X_SPEED = -50; // pixels/second
const LID_Y_SPEED = -150; // pixels/second
const LID_ROTATION_SPEED = -50; // degrees/second

type SelfOptions = {
  resizeGripColor?: TColor; // color of resize handle's grip
  lidGripColor?: TColor; // color of the lid handle's grip
  resizeHandleIsPressedListener?: ( isPressed: boolean ) => void;
  resizeHandleKeyboardDragListenerOptions?: StrictOmit<ResizeHandleKeyboardDragListenerOptions, 'tandem'>;
  phetioResizeHandleInstrumented?: boolean;
  wallVelocityVisibleProperty?: TReadOnlyProperty<boolean>;
};

type IdealGasLawContainerNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class IdealGasLawContainerNode extends Node {

  private readonly container: IdealGasLawContainer;
  private readonly visibleBoundsProperty: TReadOnlyProperty<Bounds2>;
  private readonly lidNode: LidNode;

  public constructor( container: IdealGasLawContainer,
                      modelViewTransform: ModelViewTransform2,
                      holdConstantProperty: StringUnionProperty<HoldConstant>,
                      visibleBoundsProperty: TReadOnlyProperty<Bounds2>,
                      providedOptions: IdealGasLawContainerNodeOptions ) {

    const options = optionize<IdealGasLawContainerNodeOptions,
      StrictOmit<SelfOptions, 'wallVelocityVisibleProperty' | 'resizeHandleKeyboardDragListenerOptions'>,
      NodeOptions>()( {

      // SelfOptions
      resizeGripColor: GasPropertiesColors.resizeGripColorProperty, // color of resize handle's grip
      lidGripColor: GasPropertiesColors.lidGripColorProperty, // color of the lid handle's grip
      resizeHandleIsPressedListener: _.noop,
      phetioResizeHandleInstrumented: true,

      // NodeOptions
      isDisposable: false,
      phetioFeatured: true,
      phetioVisiblePropertyInstrumented: false
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

    // Resize handle on the left wall. The sim sets resizeHandleVisibleProperty, while the PhET-iO client can use
    // hasResizeHandleProperty to permanently hide the handle.
    const resizeHandleNode = new ResizeHandleNode( {
      gripColor: options.resizeGripColor,
      tandem: options.phetioResizeHandleInstrumented ? options.tandem.createTandem( 'resizeHandleNode' ) : Tandem.OPT_OUT
    } );

    // Lid on the top of the container. The sim sets lidHandleVisibleProperty, while the PhET-iO client can use
    // hasLidHandleProperty to permanently hide the handle.
    const lidNode = new LidNode( {
      baseWidth: modelViewTransform.modelToViewDeltaX( container.lidWidthProperty.value ),
      baseHeight: modelViewTransform.modelToViewDeltaX( container.lidThickness ),
      lidGripColor: options.lidGripColor,
      tandem: options.tandem.createTandem( 'lidNode' )
    } );
    const lidHandleNode = lidNode.handleNode;

    options.children = [ previousBoundsNode, resizeHandleNode, wallsNode, lidNode ];

    // Add a velocity vector when the left wall does work. See https://github.com/phetsims/gas-properties/issues/220.
    if ( container.leftWallDoesWork ) {
      assert && assert( options.wallVelocityVisibleProperty );

      const velocityVectorNode = new WallVelocityVectorNode( container.leftWallAverageVelocityXProperty,
        options.wallVelocityVisibleProperty! );
      options.children.unshift( velocityVectorNode ); // behind the other parts

      // Anchor the vector above the resize handle.
      container.widthProperty.link( () => {
        velocityVectorNode.x = modelViewTransform.modelToViewX( container.left );
        velocityVectorNode.y = modelViewTransform.modelToViewY( container.centerY ) - resizeHandleNode.height;
      } );
    }

    super( options );

    this.addLinkedElement( container );

    // Reposition the bottom-left corner of the lid's base. The handle may extend past this to the left.
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

    holdConstantProperty.link( holdConstant => {
      this.interruptSubtreeInput();

      // Hide the resize handle when volume is held constant.
      resizeHandleNode.setHandleVisible( holdConstant !== 'volume' && holdConstant !== 'pressureV' );

      // Hide the lid handle when temperature constant is held constant.  We don't want to deal with counteracting evaporative
      // cooling, which will occur when the lid is open. See https://github.com/phetsims/gas-properties/issues/159
      lidHandleNode.setHandleVisible( holdConstant !== 'temperature' );
    } );

    // Dragging the resize handle horizontally changes the container's width.
    const resizeHandleDragDelegate = new ResizeHandleDragDelegate( container );

    const resizeHandleDragListener = new ResizeHandleDragListener( resizeHandleDragDelegate,
      modelViewTransform, this, resizeHandleNode.tandem.createTandem( 'dragListener' ) );
    resizeHandleNode.addInputListener( resizeHandleDragListener );

    const resizeHandleKeyboardDragListener = new ResizeHandleKeyboardDragListener( resizeHandleDragDelegate, modelViewTransform,
      combineOptions<ResizeHandleKeyboardDragListenerOptions>( {
        tandem: resizeHandleNode.tandem.createTandem( 'keyboardDragListener' )
      }, options.resizeHandleKeyboardDragListenerOptions ) );
    resizeHandleNode.addInputListener( resizeHandleKeyboardDragListener );

    // While interacting with the resize handle...
    const resizeHandlePressedListener = ( isPressed: boolean ) => {

      // Disable interaction with the lid, to simplify implementation.
      lidNode.interruptSubtreeInput();
      lidNode.pickable = !isPressed && container.lidIsOnProperty.value;

      // Display the previous bounds of the container if the wall doesn't do work.
      previousBoundsNode.visible = isPressed && !container.leftWallDoesWork;
      previousBoundsNode.setRectBounds( wallsNode.bounds );

      // Notify the listener provided by the client.
      options.resizeHandleIsPressedListener( isPressed );

      // When the handle is released, log the opening.
      if ( !isPressed && container.lidIsOpenProperty.value ) {
        phet.log && phet.log( `Lid is open: ${container.getOpeningLeft()} to ${container.getOpeningRight()} pm` );
      }
    };
    resizeHandleDragListener.isPressedProperty.lazyLink( resizeHandlePressedListener );
    resizeHandleKeyboardDragListener.isPressedProperty.lazyLink( resizeHandlePressedListener );

    // Dragging the lid's handle horizontally changes the size of the opening in the top of the container.
    const lidHandleDragListener = new LidHandleDragListener( container, modelViewTransform, this,
      lidHandleNode.tandem.createTandem( 'dragListener' ) );
    lidHandleNode.addInputListener( lidHandleDragListener );
    const lidHandleKeyboardDragListener = new LidHandleKeyboardDragListener( container, modelViewTransform,
      lidHandleNode.tandem.createTandem( 'keyboardDragListener' ) );
    lidHandleNode.addInputListener( lidHandleKeyboardDragListener );

    // This implementation assumes that the lid is not interactive while the container is being resized. This is
    // handled in resizeHandlePressedListener above. The lid will behave badly if this is not the case, so verify.
    Multilink.multilink( [ lidHandleDragListener.isPressedProperty, lidHandleKeyboardDragListener.isPressedProperty,
        resizeHandleDragListener.isPressedProperty, resizeHandleKeyboardDragListener.isPressedProperty ],
      ( lidHandlePointerPressed, lidHandleKeyboardPressed, resizeHandlePointerPressed, resizeHandleKeyboardPressed ) => {
        assert && assert( !( ( lidHandlePointerPressed || lidHandleKeyboardPressed ) && ( resizeHandlePointerPressed || resizeHandleKeyboardPressed ) ),
          'The lid should not be interactive while the container is being resized.' );
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

    // See https://github.com/phetsims/gas-properties/issues/213
    this.pdomOrder = [
      resizeHandleNode,
      lidNode.handleNode
    ];

    this.container = container;
    this.visibleBoundsProperty = visibleBoundsProperty;
    this.lidNode = lidNode;
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