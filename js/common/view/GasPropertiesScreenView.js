// Copyright 2018-2019, University of Colorado Boulder

/**
 * Base class for ScreenViews in the Intro, Explore, and Energy screens.
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
define( require => {
  'use strict';

  // modules
  const BaseScreenView = require( 'GAS_PROPERTIES/common/view/BaseScreenView' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const CollisionCounterNode = require( 'GAS_PROPERTIES/common/view/CollisionCounterNode' );
  const ContainerWidthNode = require( 'GAS_PROPERTIES/common/view/ContainerWidthNode' );
  const EraseParticlesButton  = require( 'GAS_PROPERTIES/common/view/EraseParticlesButton' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesBicyclePumpNode = require( 'GAS_PROPERTIES/common/view/GasPropertiesBicyclePumpNode' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesContainerNode = require( 'GAS_PROPERTIES/common/view/GasPropertiesContainerNode' );
  const GasPropertiesHeaterCoolerNode = require( 'GAS_PROPERTIES/common/view/GasPropertiesHeaterCoolerNode' );
  const GasPropertiesModel = require( 'GAS_PROPERTIES/common/model/GasPropertiesModel' );
  const GasPropertiesParticlesNode = require( 'GAS_PROPERTIES/common/view/GasPropertiesParticlesNode' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const GasPropertiesThermometerNode = require( 'GAS_PROPERTIES/common/view/GasPropertiesThermometerNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const OopsDialog = require( 'SCENERY_PHET/OopsDialog' );
  const ParticleType = require( 'GAS_PROPERTIES/common/model/ParticleType' );
  const ParticleTypeRadioButtonGroup = require( 'GAS_PROPERTIES/common/view/ParticleTypeRadioButtonGroup' );
  const PointerCoordinatesNode = require( 'SCENERY_PHET/PointerCoordinatesNode' );
  const PressureGaugeNode = require( 'GAS_PROPERTIES/common/view/PressureGaugeNode' );
  const Property = require( 'AXON/Property' );
  const RegionsNode = require( 'GAS_PROPERTIES/common/view/RegionsNode' );
  const ReturnLidButton = require( 'GAS_PROPERTIES/common/view/ReturnLidButton' );
  const StopwatchNode = require( 'GAS_PROPERTIES/common/view/StopwatchNode' );
  const Tandem = require( 'TANDEM/Tandem' );
  const ToggleNode = require( 'SUN/ToggleNode' );
  const Vector2 = require( 'DOT/Vector2' );

  // string
  //TODO better keys for OopsDialog strings
  const oops1String = require( 'string!GAS_PROPERTIES/oops1' );
  const oops2String = require( 'string!GAS_PROPERTIES/oops2' );
  const oops3String = require( 'string!GAS_PROPERTIES/oops3' );
  const oops4String = require( 'string!GAS_PROPERTIES/oops4' );

  class GasPropertiesScreenView extends BaseScreenView {

    /**
     * @param {GasPropertiesModel} model
     * @param {Property.<ParticleType>} particleTypeProperty
     * @param {BooleanProperty} sizeVisibleProperty
     * @param {Tandem} tandem
     * @param {Object} [options]
     */
    constructor( model, particleTypeProperty, sizeVisibleProperty, tandem, options ) {
      assert && assert( model instanceof GasPropertiesModel, `invalid model: ${model}` );
      assert && assert( particleTypeProperty instanceof Property,
        `invalid particleTypeProperty: ${particleTypeProperty}` );
      assert && assert( sizeVisibleProperty instanceof BooleanProperty,
        `invalid sizeVisibleProperty: ${sizeVisibleProperty}` );
      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      options = _.extend( {
        resizeGripColor: GasPropertiesColorProfile.resizeGripColorProperty
      }, options );

      super( model, tandem, options );

      const containerViewLocation = model.modelViewTransform.modelToViewPosition( model.container.location );

      // Parent for combo box popup lists
      const comboBoxListParent = new Node();

      // Whether the sim was playing before it was programmatically paused.
      let wasPlaying = model.isPlayingProperty.value;

      // Width of the container when interaction with resize handle started, used to compute how to
      // redistribute particles in the new container width.
      let startContainerWidth = model.container.widthProperty.value;

      let resizeHandleIsPressedListener = null;
      if ( model.container.leftWallDoesWork ) {

        // Resizing the container un-pauses the sim, and the left wall will do work on particles that collide with it.
        resizeHandleIsPressedListener = isPressed => {
          if ( isPressed && !model.isPlayingProperty.value ) {
            model.isPlayingProperty.value = true;
          }
        };
      }
      else {

        // Resizing the container pauses the sim and grays out the particles. The moving wall will have
        // no affect on the velocity of the particles.  The particles will be redistributed in the new volume
        // when the resize handle is released.
        resizeHandleIsPressedListener = isPressed => {
          if ( isPressed ) {

            // save playing state, pause the sim, and disable time controls
            wasPlaying = model.isPlayingProperty.value;
            model.isPlayingProperty.value = false;
            this.timeControlNode.enabledProperty.value = false;
            if ( model.collisionCounter ) {
              model.collisionCounter.isRunningProperty.value = false;
            }

            // gray out the particles
            particlesNode.opacity = 0.6;

            // remember width of container
            startContainerWidth = model.container.widthProperty.value;
          }
          else {

            // enable time controls and restore playing state
            this.timeControlNode.enabledProperty.value = true;
            model.isPlayingProperty.value = wasPlaying;

            // make particles opaque
            particlesNode.opacity = 1;

            // redistribute the particle
            model.redistributeParticles( model.container.widthProperty.value / startContainerWidth );
          }
        };
      }

      // Container
      const containerNode = new GasPropertiesContainerNode( model.container, model.modelViewTransform,
        model.holdConstantProperty, this.visibleBoundsProperty, {
          resizeGripColor: options.resizeGripColor,
          resizeHandleIsPressedListener: resizeHandleIsPressedListener
        } );

      // Return Lid button
      const returnLidButton = new ReturnLidButton( model.container, {
        right: model.modelViewTransform.modelToViewX( model.container.right - model.container.openingRightInset ) - 30,
        bottom: model.modelViewTransform.modelToViewY( model.container.top ) - 15
      } );

      // Dimensional arrows that indicate container size
      const containerWidthNode = new ContainerWidthNode( model.container.location, model.container.widthProperty,
        model.modelViewTransform, sizeVisibleProperty );

      // Radio buttons for selecting particle type
      const particleTypeRadioButtonGroup = new ParticleTypeRadioButtonGroup( particleTypeProperty,
        model.modelViewTransform, {
          left: containerNode.right + 20,
          bottom: this.layoutBounds.bottom - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
        } );

      // Bicycle pump is centered above the radio buttons.
      const bicyclePumpLocation =
        new Vector2( particleTypeRadioButtonGroup.centerX, particleTypeRadioButtonGroup.top - 15 );

      // Bicycle pump hose attaches to the container.
      const hoseLocation = model.modelViewTransform.modelToViewPosition( model.container.hoseLocation );

      const bicyclePumpOptions = {
        translation: bicyclePumpLocation,
        hoseAttachmentOffset: hoseLocation.minus( bicyclePumpLocation ),
        handleTouchAreaXDilation: 35,
        handleTouchAreaYDilation: 35
      };

      // Bicycle pump for heavy particles
      const heavyBicyclePumpNode = new GasPropertiesBicyclePumpNode( model.numberOfHeavyParticlesProperty,
        _.extend( {
          bodyFill: GasPropertiesColorProfile.heavyParticleColorProperty
        }, bicyclePumpOptions ) );

      // Bicycle pump for light particles
      const lightBicyclePumpNode = new GasPropertiesBicyclePumpNode( model.numberOfLightParticlesProperty,
        _.extend( {
          bodyFill: GasPropertiesColorProfile.lightParticleColorProperty
        }, bicyclePumpOptions ) );

      // Toggle button for switching between heavy and light bicycle pumps
      const bicyclePumpsToggleNode = new ToggleNode( particleTypeProperty, [
        { value: ParticleType.HEAVY, node: heavyBicyclePumpNode },
        { value: ParticleType.LIGHT, node: lightBicyclePumpNode }
      ] );

      // Cancel interaction with the pump when particle type changes.
      particleTypeProperty.link( particleType => {
        bicyclePumpsToggleNode.interruptSubtreeInput();
      } );

      // Thermometer
      const thermometerNode = new GasPropertiesThermometerNode( model.thermometer, comboBoxListParent, {
        right: containerNode.right,
        top: this.layoutBounds.top + GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
      } );

      // Pressure Gauge
      const pressureGaugeNode = new PressureGaugeNode( model.pressureGauge, comboBoxListParent, {
        left: containerNode.right - 2,
        centerY: model.modelViewTransform.modelToViewY( model.container.top ) + 30
      } );

      // The complete system of particles
      const particlesNode = new GasPropertiesParticlesNode( model );

      // If the number of particles changes while the sim is paused, redraw the particle system.
      model.numberOfParticlesChangedEmitter.addListener( () => {
        if ( !this.model.isPlayingProperty.value ) {
          particlesNode.update();
        }
      } );

      // Device to heat/cool the contents of the container
      const heaterCoolerNodeLeft = containerViewLocation.x -
                                   model.modelViewTransform.modelToViewDeltaX( model.container.widthRange.min );
      const heaterCoolerNode = new GasPropertiesHeaterCoolerNode(
        model.heatCoolFactorProperty, model.holdConstantProperty, model.isPlayingProperty, {
          left: heaterCoolerNodeLeft,
          bottom: this.layoutBounds.bottom - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
        } );

      // Button to erase all particles from container
      const eraseParticlesButton = new EraseParticlesButton( model.totalNumberOfParticlesProperty,
        model.numberOfHeavyParticlesProperty, model.numberOfLightParticlesProperty, {
        right: containerNode.right,
        top: containerWidthNode.bottom + 5
      } );

      // Collision Counter
      let collisionCounterNode = null;
      if ( model.collisionCounter ) {
        collisionCounterNode =
          new CollisionCounterNode( model.collisionCounter, comboBoxListParent, this.visibleBoundsProperty );
      }

      // Stopwatch
      const stopwatchNode = new StopwatchNode( model.stopwatch, this.visibleBoundsProperty );

      // Show how the collision detection space is partitioned into regions
      let regionsNode = null;
      if ( GasPropertiesQueryParameters.regions ) {
        regionsNode = new RegionsNode( model.collisionDetector.regions, model.modelViewTransform );
      }

      // model and view coordinates for pointer location
      let pointerCoordinatesNode = null;
      if ( GasPropertiesQueryParameters.pointerCoordinates ) {
        pointerCoordinatesNode = new PointerCoordinatesNode( model.modelViewTransform, {
          textColor: GasPropertiesColorProfile.pointerCoordinatesTextColorProperty,
          backgroundColor: GasPropertiesColorProfile.pointerCoordinatesBackgroundColorProperty
        } );
      }

      // rendering order
      regionsNode && this.addChild( regionsNode );
      this.addChild( particleTypeRadioButtonGroup );
      this.addChild( bicyclePumpsToggleNode );
      this.addChild( pressureGaugeNode );
      this.addChild( containerNode );
      this.addChild( eraseParticlesButton );
      this.addChild( thermometerNode );
      this.addChild( containerWidthNode );
      this.addChild( particlesNode );
      this.addChild( returnLidButton );
      this.addChild( heaterCoolerNode );
      collisionCounterNode && this.addChild( collisionCounterNode );
      this.addChild( stopwatchNode );
      this.addChild( comboBoxListParent ); // comboBox listbox in front of everything else
      pointerCoordinatesNode && this.addChild( pointerCoordinatesNode );

      // Position the time controls
      const defaultWidth = model.modelViewTransform.modelToViewDeltaX( model.container.widthRange.defaultValue );
      this.timeControlNode.mutate( {
        left: containerViewLocation.x - defaultWidth,
        bottom: this.layoutBounds.bottom - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
      } );

      //TODO better names for OopsDialogs
      //TODO boilerplate code for OopsDialogs

      // If N goes to zero while holding T constant, show a dialog.
      let oops1Dialog = null;
      model.oops1Emitter.addListener( () => {
        oops1Dialog = oops1Dialog || new OopsDialog( oops1String, GasPropertiesConstants.OOPS_DIALOG_OPTIONS );
        oops1Dialog.show();
      } );

      // If N goes to zero while holding P constant, show a dialog.
      let oops2Dialog = null;
      model.oops2Emitter.addListener( () => {
        oops2Dialog = oops2Dialog || new OopsDialog( oops2String, GasPropertiesConstants.OOPS_DIALOG_OPTIONS );
        oops2Dialog.show();
      } );

      // If V exceeds the max while holding P constant, show a dialog.
      let oops3Dialog = null;
      model.oops3Emitter.addListener( () => {
        oops3Dialog = oops3Dialog || new OopsDialog( oops3String, GasPropertiesConstants.OOPS_DIALOG_OPTIONS );
        oops3Dialog.show();
      } );

      // If V exceeds the min while holding P constant, show a dialog.
      let oops4Dialog = null;
      model.oops4Emitter.addListener( () => {
        oops4Dialog = oops4Dialog || new OopsDialog( oops4String, GasPropertiesConstants.OOPS_DIALOG_OPTIONS );
        oops4Dialog.show();
      } );
      
      // @protected
      this.model = model;

      // @private used in methods
      this.containerNode = containerNode;
      this.particlesNode = particlesNode;
      this.regionsNode = regionsNode;
      this.heavyBicyclePumpNode = heavyBicyclePumpNode;
      this.lightBicyclePumpNode = lightBicyclePumpNode;
    }

    /**
     * Resets the screen.
     * @protected
     * @override
     */
    reset() {
      super.reset();
      this.heavyBicyclePumpNode.reset();
      this.lightBicyclePumpNode.reset();
    }

    /**
     * Steps the model using real time units.
     * @param {number} dt - delta time, in seconds
     * @public
     * @override
     */
    stepManual( dt ) {
      assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );
      super.stepManual( dt );
      this.containerNode.step( dt );
      this.particlesNode.update();
      this.regionsNode && this.regionsNode.update();
    }
  }

  return gasProperties.register( 'GasPropertiesScreenView', GasPropertiesScreenView );
} );