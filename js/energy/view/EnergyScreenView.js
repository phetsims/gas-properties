// Copyright 2018-2019, University of Colorado Boulder

/**
 * The view for the 'Energy' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AverageSpeedAccordionBox = require( 'GAS_PROPERTIES/energy/view/AverageSpeedAccordionBox' );
  const BicyclePumpNode = require( 'GAS_PROPERTIES/common/view/BicyclePumpNode' );
  const CollisionCounterNode = require( 'GAS_PROPERTIES/common/view/CollisionCounterNode' );
  const ContainerNode = require( 'GAS_PROPERTIES/common/view/ContainerNode' );
  const EnergyToolsPanel = require( 'GAS_PROPERTIES/energy/view/EnergyToolsPanel' );
  const EnergyViewProperties = require( 'GAS_PROPERTIES/energy/view/EnergyViewProperties' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesHeaterCoolerNode = require( 'GAS_PROPERTIES/common/view/GasPropertiesHeaterCoolerNode' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const GasPropertiesThermometerNode = require( 'GAS_PROPERTIES/common/view/GasPropertiesThermometerNode' );
  const KineticEnergyAccordionBox = require( 'GAS_PROPERTIES/energy/view/KineticEnergyAccordionBox' );
  const ModelGridNode = require( 'GAS_PROPERTIES/common/view/ModelGridNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const ParticleCountsAccordionBox = require( 'GAS_PROPERTIES/common/view/ParticleCountsAccordionBox' );
  const ParticlesNode = require( 'GAS_PROPERTIES/common/view/ParticlesNode' );
  const ParticleToolsAccordionBox = require( 'GAS_PROPERTIES/energy/view/ParticleToolsAccordionBox' );
  const ParticleType = require( 'GAS_PROPERTIES/common/model/ParticleType' );
  const ParticleTypeRadioButtonGroup = require( 'GAS_PROPERTIES/common/view/ParticleTypeRadioButtonGroup' );
  const PointerCoordinatesNode = require( 'GAS_PROPERTIES/common/view/PointerCoordinatesNode' );
  const PressureGaugeNode = require( 'GAS_PROPERTIES/common/view/PressureGaugeNode' );
  const RegionsNode = require( 'GAS_PROPERTIES/common/view/RegionsNode' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const SizeNode = require( 'GAS_PROPERTIES/common/view/SizeNode' );
  const SpeedAccordionBox = require( 'GAS_PROPERTIES/energy/view/SpeedAccordionBox' );
  const StopwatchNode = require( 'GAS_PROPERTIES/common/view/StopwatchNode' );
  const TimeControls = require( 'GAS_PROPERTIES/common/view/TimeControls' );
  const ToggleNode = require( 'SUN/ToggleNode' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  const LEFT_PANEL_WIDTH = 205; // width of panels on the left side of the container, determined empirically
  const RIGHT_PANEL_WIDTH = 225; // width of panels on the right side of the container, determined empirically

  class EnergyScreenView extends ScreenView {

    /**
     * @param {ExploreModel} model
     */
    constructor( model ) {

      super();

      // The model bounds are equivalent to the visible bounds of ScreenView, as fills the browser window.
      this.visibleBoundsProperty.link( visibleBounds => {
        model.modelBoundsProperty.value = model.modelViewTransform.viewToModelBounds( visibleBounds );
      } );

      const containerViewLocation = model.modelViewTransform.modelToViewPosition( model.container.location );

      // view-specific Properties
      const viewProperties = new EnergyViewProperties();

      // Parent for combo box popup lists
      const comboBoxListParent = new Node();
      this.addChild( comboBoxListParent );

      // Show how the collision detection space is partitioned into regions
      if ( GasPropertiesQueryParameters.regions ) {
        this.regionsNode = new RegionsNode( model.collisionDetector.regions, model.modelViewTransform );
        this.addChild( this.regionsNode );
      }

      // Panel at upper right
      const toolsPanel = new EnergyToolsPanel(
        viewProperties.sizeVisibleProperty,
        model.stopwatch.visibleProperty, {
          fixedWidth: RIGHT_PANEL_WIDTH,
          right: this.layoutBounds.right - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
          top: this.layoutBounds.top + GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
        } );
      this.addChild( toolsPanel );

      // Particle Tools accordion box
      const particleToolsAccordionBox = new ParticleToolsAccordionBox(
        model.collisionDetector.particleParticleCollisionsEnabledProperty,
        model.controlTemperatureEnabledProperty,
        model.initialTemperatureProperty, {
          fixedWidth: RIGHT_PANEL_WIDTH,
          expandedProperty: viewProperties.particleToolsExpandedProperty,
          right: toolsPanel.right,
          top: toolsPanel.bottom + 15
        }
      );
      this.addChild( particleToolsAccordionBox );

      // Particle Counts accordion box
      const particleCountsAccordionBox = new ParticleCountsAccordionBox(
        model.numberOfHeavyParticlesProperty,
        model.numberOfLightParticlesProperty,
        model.modelViewTransform, {
          fixedWidth: RIGHT_PANEL_WIDTH,
          expandedProperty: viewProperties.particleCountsExpandedProperty,
          right: particleToolsAccordionBox.right,
          top: particleToolsAccordionBox.bottom + 15
        } );
      this.addChild( particleCountsAccordionBox );

      // Bicycle pumps, one of which is visible depending on the selected particle type
      const bicyclePumpsToggleNode = new ToggleNode( viewProperties.particleTypeProperty, [

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
      viewProperties.particleTypeProperty.link( particleType => {
        bicyclePumpsToggleNode.interruptSubtreeInput();
      } );

      // Radio buttons for selecting particle type
      const particleTypeRadioButtonGroup = new ParticleTypeRadioButtonGroup( viewProperties.particleTypeProperty,
        model.modelViewTransform );

      // Bicycle pumps + radio buttons
      const pumpBoxCenterX = containerViewLocation.x + ( particleCountsAccordionBox.left - containerViewLocation.x ) / 2;
      const pumpBox = new VBox( {
        align: 'center',
        spacing: 15,
        children: [
          bicyclePumpsToggleNode,
          particleTypeRadioButtonGroup
        ],
        centerX: pumpBoxCenterX,
        bottom: this.layoutBounds.bottom - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
      } );
      this.addChild( pumpBox );

      // Whether the sim was playing before it was programmatically paused.
      let wasPlaying = model.isPlayingProperty.value;

      //TODO delete this if we choose GasPropertiesQueryParameters.redistribute === 'drag' strategy
      // Width of the container when interaction with resize handle started.
      let containerWidth = model.container.widthProperty.value;

      // Container
      const containerNode = new ContainerNode( model.container, model.modelViewTransform, model.holdConstantProperty, {
        resizeHandleColor: 'rgb( 187, 154, 86 )', //TODO HandleNode does not support color profile
        resizeHandleIsPressedListener: isPressed => {
          if ( isPressed ) {

            // save playing state, pause the sim, and disable time controls
            wasPlaying = model.isPlayingProperty.value;
            model.isPlayingProperty.value = false;
            model.isTimeControlsEnabledProperty.value = false; //TODO must be done last or StepButton enables itself
            model.collisionCounter.isRunningProperty.value = false;

            // gray out the particles
            this.particlesNode.opacity = 0.6;

            // remember width of container
            containerWidth = model.container.widthProperty.value;
          }
          else {

            // enable time controls and restore playing state
            model.isTimeControlsEnabledProperty.value = true;
            model.isPlayingProperty.value = wasPlaying;

            // make particles opaque
            this.particlesNode.opacity = 1;

            if ( GasPropertiesQueryParameters.redistribute === 'end' ) {
              model.redistributeParticles( model.container.widthProperty.value / containerWidth );
            }
          }
        }
      } );
      this.addChild( containerNode );

      // Dimensional arrows that indicate container size
      const sizeNode = new SizeNode( model.container.location, model.container.widthProperty,
        model.modelViewTransform, viewProperties.sizeVisibleProperty );
      this.addChild( sizeNode );

      // Time controls
      const timeControlsLeft = containerViewLocation.x -
                               model.modelViewTransform.modelToViewDeltaX( model.container.widthRange.defaultValue );
      const timeControls = new TimeControls( model, {
        left: timeControlsLeft,
        bottom: this.layoutBounds.bottom - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
      } );
      this.addChild( timeControls );

      // Thermometer
      const thermometerNode = new GasPropertiesThermometerNode( model.thermometer, comboBoxListParent, {
        right: containerNode.right,
        top: this.layoutBounds.top + GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
      } );
      this.addChild( thermometerNode );

      // Pressure Gauge
      const pressureGaugeNode = new PressureGaugeNode( model.pressureGauge, comboBoxListParent, {
        left: containerNode.right - 2,
        centerY: model.modelViewTransform.modelToViewY( model.container.top ) + 30
      } );
      this.addChild( pressureGaugeNode );
      pressureGaugeNode.moveToBack(); // to hide overlap with container

      // @private
      this.particlesNode = new ParticlesNode( model );
      this.addChild( this.particlesNode );

      // Device to heat/cool the contents of the container
      const heaterCoolerNodeLeft = containerViewLocation.x -
                                   model.modelViewTransform.modelToViewDeltaX( model.container.widthRange.min );
      const heaterCoolerNode = new GasPropertiesHeaterCoolerNode(
        model.heatCoolFactorProperty, model.holdConstantProperty, {
          left: heaterCoolerNodeLeft,
          bottom: this.layoutBounds.bottom - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
        } );
      this.addChild( heaterCoolerNode );

      // Average Speed
      const averageSpeedAccordionBox = new AverageSpeedAccordionBox( viewProperties.averageSpeedVisibleProperty,
        model.heavyAverageSpeedProperty, model.lightAverageSpeedProperty, model.modelViewTransform, {
          fixedWidth: LEFT_PANEL_WIDTH,
          left: this.layoutBounds.left + GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
          top: 10
        } );
      this.addChild( averageSpeedAccordionBox );

      // Speed accordion box with histogram and related controls
      const speedAccordionBox = new SpeedAccordionBox( model, {
        fixedWidth: LEFT_PANEL_WIDTH,
        expandedProperty: viewProperties.speedExpandedProperty,
        left: this.layoutBounds.left + GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
        top: averageSpeedAccordionBox.bottom + 10
      } );
      this.addChild( speedAccordionBox );

      // Kinetic Energy accordion box with histogram
      const kineticEnergyAccordionBox = new KineticEnergyAccordionBox( model, {
        fixedWidth: LEFT_PANEL_WIDTH,
        expandedProperty: viewProperties.kineticEnergyExpandedProperty,
        left: this.layoutBounds.left + GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
        top: speedAccordionBox.bottom + 10
      } );
      this.addChild( kineticEnergyAccordionBox );

      // Collision Counter
      const collisionCounterNode = new CollisionCounterNode( model.collisionCounter, comboBoxListParent, {
        dragBoundsProperty: this.visibleBoundsProperty
      } );
      this.addChild( collisionCounterNode );

      // Stopwatch
      const stopwatchNode = new StopwatchNode( model.stopwatch, {
        dragBoundsProperty: this.visibleBoundsProperty
      } );
      this.addChild( stopwatchNode );

      // 2D grid for model coordinate frame
      if ( GasPropertiesQueryParameters.grid ) {
        this.addChild( new ModelGridNode( this.visibleBoundsProperty, model.modelViewTransform, {
          stroke: GasPropertiesColorProfile.gridColorProperty
        } ) );
      }

      // model and view coordinates for pointer location
      if ( GasPropertiesQueryParameters.pointerCoordinates ) {
        this.addChild( new PointerCoordinatesNode( model.modelViewTransform, {
          textColor: GasPropertiesColorProfile.pointerCoordinatesTextColorProperty,
          backgroundColor: GasPropertiesColorProfile.pointerCoordinatesBackgroundColorProperty
        } ) );
      }

      // Reset All button
      const resetAllButton = new ResetAllButton( {
        listener: () => {
          model.reset();
          viewProperties.reset();
          speedAccordionBox.reset();
        },
        right: this.layoutBounds.maxX - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
        bottom: this.layoutBounds.maxY - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
      } );
      this.addChild( resetAllButton );

      // This should be in front of everything else.
      comboBoxListParent.moveToFront();
    }

    /**
     * Called on each step of the simulation's timer.
     * @param {number} dt - delta time, in seconds
     */
    step( dt ) {
      this.particlesNode.step( dt );
      this.regionsNode && this.regionsNode.step( dt );
    }
  }

  return gasProperties.register( 'EnergyScreenView', EnergyScreenView );
} );