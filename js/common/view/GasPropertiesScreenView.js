// Copyright 2019, University of Colorado Boulder

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
  const BicyclePumpNode = require( 'GAS_PROPERTIES/common/view/BicyclePumpNode' );
  const CollisionCounterNode = require( 'GAS_PROPERTIES/common/view/CollisionCounterNode' );
  const ContainerNode = require( 'GAS_PROPERTIES/common/view/ContainerNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesHeaterCoolerNode = require( 'GAS_PROPERTIES/common/view/GasPropertiesHeaterCoolerNode' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const GasPropertiesThermometerNode = require( 'GAS_PROPERTIES/common/view/GasPropertiesThermometerNode' );
  const ModelGridNode = require( 'GAS_PROPERTIES/common/view/ModelGridNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const ParticlesNode = require( 'GAS_PROPERTIES/common/view/ParticlesNode' );
  const ParticleType = require( 'GAS_PROPERTIES/common/model/ParticleType' );
  const ParticleTypeRadioButtonGroup = require( 'GAS_PROPERTIES/common/view/ParticleTypeRadioButtonGroup' );
  const PointerCoordinatesNode = require( 'GAS_PROPERTIES/common/view/PointerCoordinatesNode' );
  const PressureGaugeNode = require( 'GAS_PROPERTIES/common/view/PressureGaugeNode' );
  const RegionsNode = require( 'GAS_PROPERTIES/common/view/RegionsNode' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ReturnLidButton = require( 'GAS_PROPERTIES/common/view/ReturnLidButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const StopwatchNode = require( 'GAS_PROPERTIES/common/view/StopwatchNode' );
  const TimeControls = require( 'GAS_PROPERTIES/common/view/TimeControls' );
  const ToggleNode = require( 'SUN/ToggleNode' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const ContainerWidthNode = require( 'GAS_PROPERTIES/common/view/ContainerWidthNode' );

  class GasPropertiesScreenView extends ScreenView {

    /**
     * @param {IdealModel} model
     * @param {Property.<ParticleType>} particleTypeProperty
     * @param {BooleanProperty} sizeVisibleProperty
     * @param {Object} [options]
     */
    constructor( model, particleTypeProperty, sizeVisibleProperty, options ) {

      options = _.extend( {
        resizeHandleColor: 'rgb( 160, 160, 160 )' //TODO HandleNode doesn't support ColorDef
      }, options );

      super();

      // The model bounds are equivalent to the visible bounds of ScreenView, as fills the browser window.
      this.visibleBoundsProperty.link( visibleBounds => {
        model.modelBoundsProperty.value = model.modelViewTransform.viewToModelBounds( visibleBounds );
      } );

      const containerViewLocation = model.modelViewTransform.modelToViewPosition( model.container.location );

      // Parent for combo box popup lists
      const comboBoxListParent = new Node();

      // Whether the sim was playing before it was programmatically paused.
      let wasPlaying = model.isPlayingProperty.value;

      //TODO delete this if we choose GasPropertiesQueryParameters.redistribute === 'drag' strategy
      // Width of the container when interaction with resize handle started.
      let containerWidth = model.container.widthProperty.value;

      // Container
      const containerNode = new ContainerNode( model.container, model.modelViewTransform,
        model.holdConstantProperty, this.visibleBoundsProperty, {
        resizeHandleColor: options.resizeHandleColor,
        resizeHandleIsPressedListener: isPressed => {
          if ( isPressed ) {

            // save playing state, pause the sim, and disable time controls
            wasPlaying = model.isPlayingProperty.value;
            model.isPlayingProperty.value = false;
            model.isTimeControlsEnabledProperty.value = false; //TODO must be done last or StepButton enables itself
            model.collisionCounter.isRunningProperty.value = false;

            // gray out the particles
            particlesNode.opacity = 0.6;

            // remember width of container
            containerWidth = model.container.widthProperty.value;
          }
          else {

            // enable time controls and restore playing state
            model.isTimeControlsEnabledProperty.value = true;
            model.isPlayingProperty.value = wasPlaying;

            // make particles opaque
            particlesNode.opacity = 1;

            if ( GasPropertiesQueryParameters.redistribute === 'end' ) {
              model.redistributeParticles( model.container.widthProperty.value / containerWidth );
            }
          }
        }
      } );

     // Return Lid button
     const returnLidButton = new ReturnLidButton( model.container, {
       right:  model.modelViewTransform.modelToViewX( model.container.right - model.container.openingRightInset ) - 30,
       bottom: model.modelViewTransform.modelToViewY( model.container.top ) - 15
     } );

      // Dimensional arrows that indicate container size
      const containerContainerWidthNode = new ContainerWidthNode( model.container.location, model.container.widthProperty,
        model.modelViewTransform, sizeVisibleProperty );

      // Bicycle pumps, one of which is visible depending on the selected particle type
      const bicyclePumpsToggleNode = new ToggleNode( particleTypeProperty, [

        // Bicycle pump for heavy particles
        {
          value: ParticleType.HEAVY,
          node: new BicyclePumpNode( model.numberOfHeavyParticlesProperty, {
            color: GasPropertiesColorProfile.heavyParticleColorProperty
          } )
        },

        // Bicycle pump for light particles
        {
          value: ParticleType.LIGHT,
          node: new BicyclePumpNode( model.numberOfLightParticlesProperty, {
            color: GasPropertiesColorProfile.lightParticleColorProperty
          } )
        }
      ] );

      // Cancel interaction with the pump when particle type changes.
      particleTypeProperty.link( particleType => {
        bicyclePumpsToggleNode.interruptSubtreeInput();
      } );

      // Radio buttons for selecting particle type
      const particleTypeRadioButtonGroup = new ParticleTypeRadioButtonGroup( particleTypeProperty,
        model.modelViewTransform );

      // Bicycle pumps + radio buttons
      const pumpBox = new VBox( {
        align: 'center',
        spacing: 15,
        children: [
          bicyclePumpsToggleNode,
          particleTypeRadioButtonGroup
        ],
        left: containerNode.right + 20,
        bottom: this.layoutBounds.bottom - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
      } );

      // Time controls
      const timeControlsLeft = containerViewLocation.x -
                               model.modelViewTransform.modelToViewDeltaX( model.container.widthRange.defaultValue );
      const timeControls = new TimeControls( model, {
        left: timeControlsLeft,
        bottom: this.layoutBounds.bottom - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
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

      // @private
      const particlesNode = new ParticlesNode( model );

      // Device to heat/cool the contents of the container
      const heaterCoolerNodeLeft = containerViewLocation.x -
                                   model.modelViewTransform.modelToViewDeltaX( model.container.widthRange.min );
      const heaterCoolerNode = new GasPropertiesHeaterCoolerNode(
        model.heatCoolFactorProperty, model.holdConstantProperty, {
          left: heaterCoolerNodeLeft,
          bottom: this.layoutBounds.bottom - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
        } );

      // Reset All button
      const resetAllButton = new ResetAllButton( {
        listener: () => { this.reset(); },
        right: this.layoutBounds.maxX - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
        bottom: this.layoutBounds.maxY - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
      } );

      // Collision Counter
      let collisionCounterNode = null;
      if ( model.collisionCounter ) {
        collisionCounterNode = new CollisionCounterNode( model.collisionCounter, comboBoxListParent, {
          dragBoundsProperty: this.visibleBoundsProperty
        } );
      }

      // Stopwatch
      const stopwatchNode = new StopwatchNode( model.stopwatch, {
        dragBoundsProperty: this.visibleBoundsProperty
      } );

      // Show how the collision detection space is partitioned into regions
      let regionsNode =  null;
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
      this.addChild( pumpBox );
      this.addChild( pressureGaugeNode );
      this.addChild( containerNode );
      this.addChild( thermometerNode );
      this.addChild( containerContainerWidthNode );
      this.addChild( particlesNode );
      this.addChild( returnLidButton );
      this.addChild( heaterCoolerNode );
      this.addChild( timeControls );
      this.addChild( resetAllButton );
      gridNode && this.addChild( gridNode );
      collisionCounterNode && this.addChild( collisionCounterNode );
      this.addChild( stopwatchNode );
      this.addChild( comboBoxListParent ); // comboBox listbox in front of everything else
      pointerCoordinatesNode && this.addChild( pointerCoordinatesNode );

      // @private used in methods
      this.model = model;
      this.particlesNode = particlesNode;
      this.regionsNode = regionsNode;
    }

    // @protected
    reset() {
      this.interruptSubtreeInput(); // cancel interactions that are in progress
      this.model.reset();
    }

    /**
     * Called on each step of the simulation's timer.
     * @param {number} dt - delta time, in seconds
     * @public
     */
    step( dt ) {

      // convert s to ps
      const ps = this.model.timeTransform( dt );

      // step elements that are specific to the view
      this.particlesNode.step( ps );
      this.regionsNode && this.regionsNode.step( ps );
    }
  }

  return gasProperties.register( 'GasPropertiesScreenView', GasPropertiesScreenView );
} );