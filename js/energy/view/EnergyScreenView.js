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
  const KineticEnergyAccordionBox = require( 'GAS_PROPERTIES/energy/view/KineticEnergyAccordionBox' );
  const ParticleCountsAccordionBox = require( 'GAS_PROPERTIES/common/view/ParticleCountsAccordionBox' );
  const ParticleToolsAccordionBox = require( 'GAS_PROPERTIES/energy/view/ParticleToolsAccordionBox' );
  const SpeedAccordionBox = require( 'GAS_PROPERTIES/energy/view/SpeedAccordionBox' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  const LEFT_PANEL_WIDTH = 205; // width of panels on the left side of the container, determined empirically
  const RIGHT_PANEL_WIDTH = 225; // width of panels on the right side of the container, determined empirically
  const VBOX_SPACING = 10;

  class EnergyScreenView extends GasPropertiesScreenView {

    /**
     * @param {EnergyModel} model
     */
    constructor( model ) {
      assert && assert( model instanceof EnergyModel, `invalid model: ${model}` );

      // view-specific Properties
      const viewProperties = new EnergyViewProperties();

      super( model, viewProperties.particleTypeProperty, viewProperties.sizeVisibleProperty );

      // Average Speed
      const averageSpeedAccordionBox = new AverageSpeedAccordionBox(
        model.heavyAverageSpeedProperty, model.lightAverageSpeedProperty, model.modelViewTransform, {
          expandedProperty: viewProperties.averageSpeedExpandedProperty,
          fixedWidth: LEFT_PANEL_WIDTH
        } );

      // Speed accordion box with histogram and related controls
      const speedAccordionBox = new SpeedAccordionBox( model, {
        expandedProperty: viewProperties.speedExpandedProperty,
        fixedWidth: LEFT_PANEL_WIDTH
      } );

      // Kinetic Energy accordion box with histogram
      const kineticEnergyAccordionBox = new KineticEnergyAccordionBox( model, {
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

      // Particle Tools accordion box
      const particleToolsAccordionBox = new ParticleToolsAccordionBox(
        model.collisionDetector.particleParticleCollisionsEnabledProperty,
        model.controlTemperatureEnabledProperty,
        model.initialTemperatureProperty, {
          expandedProperty: viewProperties.particleToolsExpandedProperty,
          fixedWidth: RIGHT_PANEL_WIDTH
        }
      );

      // Particle Counts accordion box
      const particleCountsAccordionBox = new ParticleCountsAccordionBox(
        model.numberOfHeavyParticlesProperty,
        model.numberOfLightParticlesProperty,
        model.modelViewTransform, {
          expandedProperty: viewProperties.particleCountsExpandedProperty,
          fixedWidth: RIGHT_PANEL_WIDTH
        } );

      // Panels on the right side of the screen
      const rightPanels = new VBox( {
        children: [
          toolsPanel,
          particleToolsAccordionBox,
          particleCountsAccordionBox
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

    // @protected @override
    reset() {
      this.viewProperties.reset();
      this.speedAccordionBox.reset();
      this.kineticEnergyAccordionBox.reset();
      super.reset();
    }

    /**
     * Called on each step of the simulation's timer.
     * @param {number} dt - time delta, in seconds
     * @public
     * @override
     */
    step( dt ) {

      // convert s to ps
      const ps = this.model.timeTransform( dt );

      // step elements that are specific to the view
      this.speedAccordionBox.step( ps );
      this.kineticEnergyAccordionBox.step( ps );

      super.step( dt );
    }
  }

  return gasProperties.register( 'EnergyScreenView', EnergyScreenView );
} );