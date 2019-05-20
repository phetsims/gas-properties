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
  const EnergyModel = require( 'GAS_PROPERTIES/energy/model/EnergyModel' );
  const EnergyToolsPanel = require( 'GAS_PROPERTIES/energy/view/EnergyToolsPanel' );
  const EnergyViewProperties = require( 'GAS_PROPERTIES/energy/view/EnergyViewProperties' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesScreenView = require( 'GAS_PROPERTIES/common/view/GasPropertiesScreenView' );
  const InjectionTemperatureAccordionBox = require( 'GAS_PROPERTIES/energy/view/InjectionTemperatureAccordionBox' );
  const KineticEnergyAccordionBox = require( 'GAS_PROPERTIES/energy/view/KineticEnergyAccordionBox' );
  const ParticlesAccordionBox = require( 'GAS_PROPERTIES/common/view/ParticlesAccordionBox' );
  const SpeedAccordionBox = require( 'GAS_PROPERTIES/energy/view/SpeedAccordionBox' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  const LEFT_PANEL_WIDTH = 205; // width of panels on the left side of the container, determined empirically
  const RIGHT_PANEL_WIDTH = 225; // width of panels on the right side of the container, determined empirically
  const VBOX_SPACING = 10;

  class EnergyScreenView extends GasPropertiesScreenView {

    /**
     * @param {EnergyModel} model
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {
      assert && assert( model instanceof EnergyModel, `invalid model: ${model}` );

      // view-specific Properties
      const viewProperties = new EnergyViewProperties();

      super( model, viewProperties.particleTypeProperty, viewProperties.sizeVisibleProperty, tandem );

      // Average Speed
      const averageSpeedAccordionBox = new AverageSpeedAccordionBox(
        model.heavyAverageSpeedProperty, model.lightAverageSpeedProperty, model.modelViewTransform, {
          expandedProperty: viewProperties.averageSpeedExpandedProperty,
          fixedWidth: LEFT_PANEL_WIDTH
        } );

      // Speed accordion box with histogram and related controls
      const speedAccordionBox = new SpeedAccordionBox(
        model.getHeavyParticleSpeedValues.bind( model ),
        model.getLightParticleSpeedValues.bind( model ),
        model.modelViewTransform, {
          expandedProperty: viewProperties.speedExpandedProperty,
          fixedWidth: LEFT_PANEL_WIDTH
        } );

      // Kinetic Energy accordion box with histogram
      const kineticEnergyAccordionBox = new KineticEnergyAccordionBox(
        model.getHeavyParticleKineticEnergyValues.bind( model ),
        model.getLightParticleKineticEnergyValues.bind( model ),
        model.modelViewTransform, {
          expandedProperty: viewProperties.kineticEnergyExpandedProperty,
          fixedWidth: LEFT_PANEL_WIDTH
        } );

      // Panels on the left side of the screen
      const leftPanels = new VBox( {
        children: [
          averageSpeedAccordionBox,
          speedAccordionBox,
          kineticEnergyAccordionBox
        ],
        spacing: VBOX_SPACING,
        top: GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN,
        left: this.layoutBounds.left + GasPropertiesConstants.SCREEN_VIEW_X_MARGIN
      } );

      // Tools panel
      const toolsPanel = new EnergyToolsPanel(
        viewProperties.sizeVisibleProperty,
        model.stopwatch.visibleProperty, {
          fixedWidth: RIGHT_PANEL_WIDTH
        } );

      // Particles accordion box
      const particlesAccordionBox = new ParticlesAccordionBox(
        model.numberOfHeavyParticlesProperty,
        model.numberOfLightParticlesProperty,
        model.modelViewTransform, {
          collisionsEnabledProperty: model.collisionDetector.particleParticleCollisionsEnabledProperty,
          expandedProperty: viewProperties.particleCountsExpandedProperty,
          fixedWidth: RIGHT_PANEL_WIDTH
        } );

      // Injection Temperature accordion box
      const injectionTemperatureAccordionBox = new InjectionTemperatureAccordionBox(
        model.controlTemperatureEnabledProperty,
        model.initialTemperatureProperty, {
          expandedProperty: viewProperties.particleToolsExpandedProperty,
          fixedWidth: RIGHT_PANEL_WIDTH
        }
      );

      // Panels on the right side of the screen
      const rightPanels = new VBox( {
        children: [
          toolsPanel,
          particlesAccordionBox,
          injectionTemperatureAccordionBox
        ],
        spacing: VBOX_SPACING,
        right: this.layoutBounds.right - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
        top: this.layoutBounds.top + GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
      } );

      // Rendering order
      this.addChild( leftPanels );
      this.addChild( rightPanels );

      // @private used in methods
      this.viewProperties = viewProperties;
      this.speedAccordionBox = speedAccordionBox;
      this.kineticEnergyAccordionBox = kineticEnergyAccordionBox;
    }

    /**
     * Resets the screen.
     * @protected
     * @override
     */
    reset() {
      super.reset();
      this.viewProperties.reset();
      this.speedAccordionBox.reset();
      this.kineticEnergyAccordionBox.reset();
    }

    /**
     * Called on each step of the simulation's timer.
     * @param {number} dt - time delta, in seconds
     * @public
     * @override
     */
    step( dt ) {
      super.step( dt );

      if ( this.model.isPlayingProperty.value ) {

        // convert s to ps
        const ps = this.model.timeTransform( dt );

        // step elements that are specific to the view
        this.speedAccordionBox.step( ps );
        this.kineticEnergyAccordionBox.step( ps );
      }
    }
  }

  return gasProperties.register( 'EnergyScreenView', EnergyScreenView );
} );