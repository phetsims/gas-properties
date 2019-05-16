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
  const CollisionCounterNode = require( 'GAS_PROPERTIES/common/view/CollisionCounterNode' );
  const ContainerWidthNode = require( 'GAS_PROPERTIES/common/view/ContainerWidthNode' );
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
  const ModelGridNode = require( 'GAS_PROPERTIES/common/view/ModelGridNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const OopsDialog = require( 'SCENERY_PHET/OopsDialog' );
  const ParticleType = require( 'GAS_PROPERTIES/common/model/ParticleType' );
  const ParticleTypeRadioButtonGroup = require( 'GAS_PROPERTIES/common/view/ParticleTypeRadioButtonGroup' );
  const PointerCoordinatesNode = require( 'GAS_PROPERTIES/common/view/PointerCoordinatesNode' );
  const PressureGaugeNode = require( 'GAS_PROPERTIES/common/view/PressureGaugeNode' );
  const RegionsNode = require( 'GAS_PROPERTIES/common/view/RegionsNode' );
  const ReturnLidButton = require( 'GAS_PROPERTIES/common/view/ReturnLidButton' );
  const StopwatchNode = require( 'GAS_PROPERTIES/common/view/StopwatchNode' );
  const ToggleNode = require( 'SUN/ToggleNode' );
  const Vector2 = require( 'DOT/Vector2' );

  // string
  const volumeTooLargeString = require( 'string!GAS_PROPERTIES/volumeTooLarge' );
  const volumeTooSmallString = require( 'string!GAS_PROPERTIES/volumeTooSmall' );

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

      options = _.extend( {
        resizeGripColor: GasPropertiesColorProfile.resizeGripColorProperty
      }, options );

      super( model, tandem, options );

      const containerViewLocation = model.modelViewTransform.modelToViewPosition( model.container.location );

      // Parent for combo box popup lists
      const comboBoxListParent = new Node();

      // Whether the sim was playing before it was programmatically paused.
      let wasPlaying = model.isPlayingProperty.value;

      //TODO #45 delete this if we choose GasPropertiesQueryParameters.redistribute === 'drag' strategy
      // Width of the container when interaction with resize handle started.
      let containerWidth = model.container.widthProperty.value;

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
            containerWidth = model.container.widthProperty.value;
          }
          else {

            // enable time controls and restore playing state
            this.timeControlNode.enabledProperty.value = true;
            model.isPlayingProperty.value = wasPlaying;

            // make particles opaque
            particlesNode.opacity = 1;

            if ( GasPropertiesQueryParameters.redistribute === 'end' ) {
              model.redistributeParticles( model.container.widthProperty.value / containerWidth );
            }
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
      const containerContainerWidthNode = new ContainerWidthNode( model.container.location, model.container.widthProperty,
        model.modelViewTransform, sizeVisibleProperty );

      // Radio buttons for selecting particle type
      const particleTypeRadioButtonGroup = new ParticleTypeRadioButtonGroup( particleTypeProperty,
        model.modelViewTransform, {
          left: containerNode.right + 20,
          bottom: this.layoutBounds.bottom - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
        } );

      // Bicycle pump is centered above the radio buttons.
      const bicyclePumpLocation = new Vector2( particleTypeRadioButtonGroup.centerX, particleTypeRadioButtonGroup.top - 15 );

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

      // Collision Counter
      let collisionCounterNode = null;
      if ( model.collisionCounter ) {
        collisionCounterNode = new CollisionCounterNode( model.collisionCounter, comboBoxListParent, this.visibleBoundsProperty );
      }

      // Stopwatch
      const stopwatchNode = new StopwatchNode( model.stopwatch, this.visibleBoundsProperty );

      // Show how the collision detection space is partitioned into regions
      let regionsNode = null;
      if ( GasPropertiesQueryParameters.regions ) {
        regionsNode = new RegionsNode( model.collisionDetector.regions, model.modelViewTransform );
      }

      // 2D grid for model coordinate frame
      let gridNode = null;
      if ( GasPropertiesQueryParameters.grid ) {
        gridNode = new ModelGridNode( this.visibleBoundsProperty, model.modelViewTransform, {
          stroke: GasPropertiesColorProfile.gridColorProperty
        } );
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
      this.addChild( thermometerNode );
      this.addChild( containerContainerWidthNode );
      this.addChild( particlesNode );
      this.addChild( returnLidButton );
      this.addChild( heaterCoolerNode );
      gridNode && this.addChild( gridNode );
      collisionCounterNode && this.addChild( collisionCounterNode );
      this.addChild( stopwatchNode );
      this.addChild( comboBoxListParent ); // comboBox listbox in front of everything else
      pointerCoordinatesNode && this.addChild( pointerCoordinatesNode );

      // Position the time controls
      this.timeControlNode.mutate( {
        left: containerViewLocation.x - model.modelViewTransform.modelToViewDeltaX( model.container.widthRange.defaultValue ),
        bottom: this.layoutBounds.bottom - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
      } );

      // If the container's volume range is exceeded, show a dialog.
      let volumeTooLargeDialog = null;
      let volumeTooSmallDialog = null;
      model.containerWidthOutOfRangeEmitter.addListener( ( containerWidth ) => {
        if ( containerWidth > model.container.widthRange.max ) {
          if ( !volumeTooLargeDialog ) {
            volumeTooLargeDialog = new OopsDialog( volumeTooLargeString );
          }
          volumeTooLargeDialog.show();
        }
        else {
          if ( !volumeTooSmallDialog ) {
            volumeTooSmallDialog = new OopsDialog( volumeTooSmallString );
          }
          volumeTooSmallDialog.show();
        }
      } );

      // @protected
      this.model = model;

      // @private used in methods
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
     * Called on each step of the simulation's timer.
     * @param {number} dt - delta time, in seconds
     * @public
     */
    step( dt ) {
      if ( this.model.isPlayingProperty.value ) {
        this.particlesNode.update();
        this.regionsNode && this.regionsNode.update();
      }
    }
  }

  return gasProperties.register( 'GasPropertiesScreenView', GasPropertiesScreenView );
} );