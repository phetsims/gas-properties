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
  const EnergyToolsPanel = require( 'GAS_PROPERTIES/energy/view/EnergyToolsPanel' );
  const EnergyViewProperties = require( 'GAS_PROPERTIES/energy/view/EnergyViewProperties' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesScreenView = require( 'GAS_PROPERTIES/common/view/GasPropertiesScreenView' );
  const KineticEnergyAccordionBox = require( 'GAS_PROPERTIES/energy/view/KineticEnergyAccordionBox' );
  const Node = require( 'SCENERY/nodes/Node' );
  const ParticleCountsAccordionBox = require( 'GAS_PROPERTIES/common/view/ParticleCountsAccordionBox' );
  const ParticleToolsAccordionBox = require( 'GAS_PROPERTIES/energy/view/ParticleToolsAccordionBox' );
  const SpeedAccordionBox = require( 'GAS_PROPERTIES/energy/view/SpeedAccordionBox' );

  // constants
  const LEFT_PANEL_WIDTH = 205; // width of panels on the left side of the container, determined empirically
  const RIGHT_PANEL_WIDTH = 225; // width of panels on the right side of the container, determined empirically

  class EnergyScreenView extends GasPropertiesScreenView {

    /**
     * @param {EnergyModel} model
     */
    constructor( model ) {

      // view-specific Properties
      const viewProperties = new EnergyViewProperties();

      super( model, viewProperties.particleTypeProperty, viewProperties.sizeVisibleProperty );

      // Average Speed
      const averageSpeedAccordionBox = new AverageSpeedAccordionBox(
        model.heavyAverageSpeedProperty, model.lightAverageSpeedProperty, model.modelViewTransform, {
          expandedProperty: viewProperties.averageSpeedExpandedProperty,
          fixedWidth: LEFT_PANEL_WIDTH,
          left: this.layoutBounds.left + GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
          top: 10
        } );

      // Speed accordion box with histogram and related controls
      const speedAccordionBox = new SpeedAccordionBox( model, {
        fixedWidth: LEFT_PANEL_WIDTH,
        expandedProperty: viewProperties.speedExpandedProperty,
        left: this.layoutBounds.left + GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
        top: averageSpeedAccordionBox.bottom + 10
      } );

      // Kinetic Energy accordion box with histogram
      const kineticEnergyAccordionBox = new KineticEnergyAccordionBox( model, {
        fixedWidth: LEFT_PANEL_WIDTH,
        expandedProperty: viewProperties.kineticEnergyExpandedProperty,
        left: this.layoutBounds.left + GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
        top: speedAccordionBox.bottom + 10
      } );

      // Panel at upper right
      const toolsPanel = new EnergyToolsPanel(
        viewProperties.sizeVisibleProperty,
        model.stopwatch.visibleProperty, {
          fixedWidth: RIGHT_PANEL_WIDTH,
          right: this.layoutBounds.right - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
          top: this.layoutBounds.top + GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
        } );

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

      // Rendering order. Everything we add should be behind what is created by super.
      const parent = new Node();
      parent.addChild( averageSpeedAccordionBox );
      parent.addChild( speedAccordionBox );
      parent.addChild( kineticEnergyAccordionBox );
      parent.addChild( toolsPanel );
      parent.addChild( particleToolsAccordionBox );
      parent.addChild( particleCountsAccordionBox );
      this.addChild( parent );
      parent.moveToBack();

      // @private used in methods
      this.viewProperties = viewProperties;
      this.speedAccordionBox = speedAccordionBox;
      this.kineticEnergyAccordionBox = kineticEnergyAccordionBox;
    }

    // @protected @override
    reset() {
      this.viewProperties.reset();
      this.speedAccordionBox.reset();
      super.reset();
    }

    /**
     * Called on each step of the simulation's timer.
     * @param {number} dt - time delta, in seconds
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