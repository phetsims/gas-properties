// Copyright 2018-2024, University of Colorado Boulder

/**
 * IdealGasLawScreenView is the ScreenView base class for screens that are based on the Ideal Gas Law
 * (Ideal, Explore, and Energy screens).
 *
 * Contains these UI components:
 *
 *   Particles
 *   Container
 *   Thermometer
 *   Pressure Gauge
 *   HeaterCooler
 *   Bicycle Pump + radio buttons
 *   Time controls (play/pause, step buttons)
 *   Reset All button
 *
 * Contains these debugging UI components:
 *
 *   Visualization of collision detection regions
 *   Model coordinate frame grid
 *   Pointer coordinates
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PointerCoordinatesNode from '../../../../scenery-phet/js/PointerCoordinatesNode.js';
import { Node } from '../../../../scenery/js/imports.js';
import Dialog from '../../../../sun/js/Dialog.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import GasPropertiesColors from '../GasPropertiesColors.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';
import GasPropertiesQueryParameters from '../GasPropertiesQueryParameters.js';
import IdealGasLawModel from '../model/IdealGasLawModel.js';
import { ParticleType } from '../model/ParticleType.js';
import BaseScreenView, { BaseScreenViewOptions } from './BaseScreenView.js';
import CollisionCounterNode from './CollisionCounterNode.js';
import ContainerWidthNode from './ContainerWidthNode.js';
import EraseParticlesButton from './EraseParticlesButton.js';
import GasPropertiesHeaterCoolerNode from './GasPropertiesHeaterCoolerNode.js';
import GasPropertiesOopsDialog from './GasPropertiesOopsDialog.js';
import GasPropertiesStopwatchNode from './GasPropertiesStopwatchNode.js';
import GasPropertiesThermometerNode from './GasPropertiesThermometerNode.js';
import IdealGasLawContainerNode from './IdealGasLawContainerNode.js';
import IdealGasLawParticleSystemNode from './IdealGasLawParticleSystemNode.js';
import PressureGaugeNode from './PressureGaugeNode.js';
import RegionsNode from './RegionsNode.js';
import ReturnLidButton from './ReturnLidButton.js';
import BicyclePumpControl from './BicyclePumpControl.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import { ResizeHandleKeyboardDragListenerOptions } from './ResizeHandleKeyboardDragListener.js';

type SelfOptions = {
  wallVelocityVisibleProperty?: TReadOnlyProperty<boolean>;
  resizeHandleKeyboardDragListenerOptions?: StrictOmit<ResizeHandleKeyboardDragListenerOptions, 'tandem'>;
  phetioResizeHandleInstrumented?: boolean;
};

export type IdealGasLawScreenViewOptions = SelfOptions & BaseScreenViewOptions;

export default class IdealGasLawScreenView extends BaseScreenView {

  protected readonly containerNode: IdealGasLawContainerNode;
  private readonly particleSystemNode: IdealGasLawParticleSystemNode;
  private readonly regionsNode: RegionsNode | null;
  protected readonly bicyclePumpControl: BicyclePumpControl;
  protected readonly heaterCoolerNode: GasPropertiesHeaterCoolerNode;

  // Subclasses should use this Tandem when creating additional OopsDialog instances.
  protected readonly oopsDialogsTandem: Tandem;

  // For setting pdomOrder in subclasses
  protected readonly returnLidButton: Node;
  protected readonly eraseParticlesButton: Node;
  protected readonly thermometerNode: Node;
  protected readonly pressureGaugeNode: Node;
  protected readonly collisionCounterNode?: Node;
  protected readonly stopwatchNode: Node;

  protected constructor( model: IdealGasLawModel,
                         particleTypeProperty: StringUnionProperty<ParticleType>,
                         widthVisibleProperty: Property<boolean>,
                         providedOptions?: IdealGasLawScreenViewOptions ) {

    const options = optionize<IdealGasLawScreenViewOptions,
      StrictOmit<SelfOptions, 'wallVelocityVisibleProperty' | 'resizeHandleKeyboardDragListenerOptions'>,
      BaseScreenViewOptions>()( {

      // SelfOptions
      phetioResizeHandleInstrumented: true
    }, providedOptions );

    super( model, options );

    const containerViewPosition = model.modelViewTransform.modelToViewPosition( model.container.position );

    // Whether the sim was playing before it was programmatically paused.
    let wasPlaying = model.isPlayingProperty.value;

    // The complete system of particles, inside and outside the container
    const particleSystemNode = new IdealGasLawParticleSystemNode( model );

    // If PhET-iO state is set while the sim is paused, tell the particle system view to update.
    // See https://github.com/phetsims/gas-properties/issues/276
    if ( Tandem.PHET_IO_ENABLED ) {
      phet.phetio.phetioEngine.phetioStateEngine.stateSetEmitter.addListener( () => {
        if ( !model.isPlayingProperty.value ) {
          particleSystemNode.update();
        }
      } );
    }

    // Width of the container when interaction with resize handle started, used to compute how to
    // redistribute particles in the new container width.
    let startContainerWidth = model.container.widthProperty.value;

    // Listener for when the container's resize handle is pressed or released.
    let resizeHandleIsPressedListener = null;
    if ( model.container.leftWallDoesWork ) {

      // Resizing the container un-pauses the sim, and the left wall will do work on particles that collide with it.
      resizeHandleIsPressedListener = ( isPressed: boolean ) => {
        if ( isPressed && !model.isPlayingProperty.value ) {
          model.isPlayingProperty.value = true;
        }
      };
    }
    else {

      // Resizing the container pauses the sim and grays out the particles. The moving wall will have
      // no effect on the velocity of the particles.  The particles will be redistributed in the new volume
      // when the resize handle is released.
      resizeHandleIsPressedListener = ( isPressed: boolean ) => {
        if ( isPressed ) {

          // save playing state, pause the sim, and disable time controls
          wasPlaying = model.isPlayingProperty.value;
          model.isPlayingProperty.value = false;
          this.timeControlNode.enabledProperty.value = false;

          // gray out the particles
          particleSystemNode.opacity = 0.6;

          // remember width of container
          startContainerWidth = model.container.widthProperty.value;
        }
        else {

          // enable time controls and restore playing state
          this.timeControlNode.enabledProperty.value = true;
          model.isPlayingProperty.value = wasPlaying;

          // make particles opaque
          particleSystemNode.opacity = 1;

          // redistribute the particles
          model.particleSystem.redistributeParticles( model.container.widthProperty.value / startContainerWidth );
          if ( !model.isPlayingProperty.value ) {
            particleSystemNode.update();
          }
        }

        // Interacting with the container's resize handle stops the collision counter.
        if ( model.collisionCounter ) {
          model.collisionCounter.isRunningProperty.value = false;
        }
      };
    }

    // Container
    const containerNode = new IdealGasLawContainerNode( model.container, model.modelViewTransform,
      model.holdConstantProperty, this.visibleBoundsProperty, {
        resizeHandleIsPressedListener: resizeHandleIsPressedListener,
        wallVelocityVisibleProperty: options.wallVelocityVisibleProperty,
        resizeHandleKeyboardDragListenerOptions: options.resizeHandleKeyboardDragListenerOptions,
        phetioResizeHandleInstrumented: options.phetioResizeHandleInstrumented,
        tandem: options.tandem.createTandem( 'containerNode' )
      } );

    // Return Lid button
    const returnLidButton = new ReturnLidButton( model.container, {
      tandem: options.tandem.createTandem( 'returnLidButton' )
    } );
    returnLidButton.boundsProperty.link( bounds => {
      returnLidButton.right = model.modelViewTransform.modelToViewX( model.container.right - model.container.openingRightInset ) - 30;
      returnLidButton.bottom = model.modelViewTransform.modelToViewY( model.container.top ) - 15;
    } );

    // Dimensional arrows that indicate container size
    const containerWidthNode = new ContainerWidthNode( model.container.position, model.container.widthProperty,
      model.modelViewTransform, {
        visibleProperty: widthVisibleProperty
      } );

    // Bicycle pump and associated radio buttons.
    const bicyclePumpControl = new BicyclePumpControl( particleTypeProperty,
      model.particleSystem.numberOfHeavyParticlesProperty,
      model.particleSystem.numberOfLightParticlesProperty,
      model.modelViewTransform, {
        left: containerNode.right,
        bottom: this.layoutBounds.maxY - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN,
        tandem: options.tandem.createTandem( 'bicyclePumpControl' )
      } );

    // Parent for the thermometer's listbox
    const thermometerListboxParent = new Node();

    // Thermometer
    const thermometerNode = new GasPropertiesThermometerNode( model.temperatureModel, thermometerListboxParent, {
      tandem: options.tandem.createTandem( 'thermometerNode' )
    } );
    thermometerNode.boundsProperty.link( bounds => {
      thermometerNode.centerX = containerNode.right - 50;
      thermometerNode.bottom = model.modelViewTransform.modelToViewY( model.container.top ) + 60;
    } );

    // Parent for the pressure gauge's listbox
    const pressureGaugeListboxParent = new Node();

    // Pressure Gauge
    const pressureGaugeNode = new PressureGaugeNode( model.pressureModel, pressureGaugeListboxParent, {
      tandem: options.tandem.createTandem( 'pressureGaugeNode' )
    } );
    pressureGaugeNode.boundsProperty.link( bounds => {
      pressureGaugeNode.left = containerNode.right - 2;
      pressureGaugeNode.centerY = model.modelViewTransform.modelToViewY( model.container.top ) + 30;
    } );

    // Device to heat/cool the contents of the container
    const heaterCoolerNodeXOffset = model.container.isFixedWidth ? GasPropertiesConstants.DEFAULT_CONTAINER_WIDTH.min : model.container.widthRange.min;
    const heaterCoolerNodeLeft = containerViewPosition.x - model.modelViewTransform.modelToViewDeltaX( heaterCoolerNodeXOffset );
    const heaterCoolerNode = new GasPropertiesHeaterCoolerNode(
      model.heatCoolAmountProperty,
      model.holdConstantProperty,
      model.isPlayingProperty,
      model.particleSystem.numberOfParticlesProperty,
      model.temperatureModel.temperatureKelvinProperty, {
        left: heaterCoolerNodeLeft,
        bottom: this.layoutBounds.bottom - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN,
        tandem: options.tandem.createTandem( 'heaterCoolerNode' )
      } );

    // Button to erase all particles from container
    const eraseParticlesButton = new EraseParticlesButton( model.particleSystem, {
      right: containerNode.right,
      top: containerWidthNode.bottom + 5,
      tandem: options.tandem.createTandem( 'eraseParticlesButton' )
    } );

    // Common parent for all tools, so we can move the selected tool to the front without affecting other things.
    const toolsParent = new Node();

    // Collision Counter
    let collisionCounterNode: Node | undefined;
    if ( model.collisionCounter ) {
      const collisionCounterListboxParent = new Node();
      collisionCounterNode = new CollisionCounterNode( model.collisionCounter, collisionCounterListboxParent, this.visibleBoundsProperty, {
        tandem: options.tandem.createTandem( 'collisionCounterNode' )
      } );
      toolsParent.addChild( collisionCounterNode );
      toolsParent.addChild( collisionCounterListboxParent );
    }

    // Stopwatch
    const stopwatchNode = new GasPropertiesStopwatchNode( model.stopwatch, {
      dragBoundsProperty: this.visibleBoundsProperty,
      tandem: options.tandem.createTandem( 'stopwatchNode' )
    } );
    toolsParent.addChild( stopwatchNode );

    // Show how the collision detection space is partitioned into regions
    let regionsNode = null;
    if ( GasPropertiesQueryParameters.regions ) {
      regionsNode = new RegionsNode( model.collisionDetector.regions, model.modelViewTransform );
    }

    // model and view coordinates for pointer position
    let pointerCoordinatesNode = null;
    if ( GasPropertiesQueryParameters.pointerCoordinates ) {
      pointerCoordinatesNode = new PointerCoordinatesNode( model.modelViewTransform, {
        textColor: GasPropertiesColors.pointerCoordinatesTextColorProperty,
        backgroundColor: GasPropertiesColors.pointerCoordinatesBackgroundColorProperty
      } );
    }

    // rendering order
    regionsNode && this.addChild( regionsNode );
    this.addChild( bicyclePumpControl );
    this.addChild( pressureGaugeNode );
    this.addChild( pressureGaugeListboxParent );
    this.addChild( containerNode );
    this.addChild( eraseParticlesButton );
    this.addChild( thermometerNode );
    this.addChild( thermometerListboxParent );
    this.addChild( containerWidthNode );
    this.addChild( particleSystemNode );
    this.addChild( returnLidButton );
    this.addChild( heaterCoolerNode );
    this.addChild( toolsParent );
    pointerCoordinatesNode && this.addChild( pointerCoordinatesNode );

    // Time controls are created by the superclass, but subclass is responsible for positioning them
    this.timeControlNode.left = containerViewPosition.x - model.modelViewTransform.modelToViewDeltaX( model.container.widthRange.defaultValue );
    this.timeControlNode.bottom = this.layoutBounds.bottom - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN;

    this.oopsDialogsTandem = options.tandem.createTandem( 'oopsDialogs' );

    // OopsDialog when maximum temperature is exceeded.
    const oopsMaximumTemperatureDialog = new GasPropertiesOopsDialog( GasPropertiesStrings.oopsMaximumTemperatureStringProperty, {
      tandem: this.oopsDialogsTandem.createTandem( 'oopsMaximumTemperatureDialog' ),
      phetioDocumentation: 'Displayed when the maximum Temperature is reached. To recover, all particles are removed. ' +
                           'If Hold Constant was set to anything other than None or Volume, it is set to None.'
    } );
    model.oopsEmitters.maximumTemperatureEmitter.addListener( () => this.showDialog( oopsMaximumTemperatureDialog ) );

    this.containerNode = containerNode;
    this.particleSystemNode = particleSystemNode;
    this.regionsNode = regionsNode;
    this.bicyclePumpControl = bicyclePumpControl;
    this.heaterCoolerNode = heaterCoolerNode;
    this.returnLidButton = returnLidButton;
    this.eraseParticlesButton = eraseParticlesButton;
    this.thermometerNode = thermometerNode;
    this.pressureGaugeNode = pressureGaugeNode;
    this.collisionCounterNode = collisionCounterNode;
    this.stopwatchNode = stopwatchNode;
  }

  protected override reset(): void {
    super.reset();
    this.bicyclePumpControl.reset();
  }

  /**
   * Steps the view using real time units.
   * @param dt - delta time, in seconds
   */
  public override stepView( dt: number ): void {
    assert && assert( dt >= 0, `invalid dt: ${dt}` );
    this.containerNode.step( dt );
    this.particleSystemNode.update();
    this.regionsNode && this.regionsNode.update();
    this.heaterCoolerNode.step( dt );
  }

  /**
   * Shows a dialog, and cancels any in-progress interactions.
   */
  public showDialog( dialog: Dialog ): void {
    this.interruptSubtreeInput();
    dialog.show();
  }
}

gasProperties.register( 'IdealGasLawScreenView', IdealGasLawScreenView );