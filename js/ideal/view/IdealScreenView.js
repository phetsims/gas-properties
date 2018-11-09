// Copyright 2018, University of Colorado Boulder

/**
 * The view for the 'Ideal' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BicyclePumpNode = require( 'GAS_PROPERTIES/common/view/BicyclePumpNode' );
  const ContainerNode = require( 'GAS_PROPERTIES/common/view/ContainerNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const IdealControlPanel = require( 'GAS_PROPERTIES/ideal/view/IdealControlPanel' );
  const IdealViewProperties = require( 'GAS_PROPERTIES/ideal/view/IdealViewProperties' );
  const ParticleCountsAccordionBox = require( 'GAS_PROPERTIES/ideal/view/ParticleCountsAccordionBox' );
  const ParticleTypeControl = require( 'GAS_PROPERTIES/ideal/view/ParticleTypeControl' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const TimeControls = require( 'GAS_PROPERTIES/common/view/TimeControls' );

  // constants
  const PANEL_WIDTH = 225; // determined empirically

  class IdealScreenView extends ScreenView {

    /**
     * @param {IntroModel} model
     */
    constructor( model ) {

      super();

      // view-specific Properties
      const viewProperties = new IdealViewProperties();

      // Container
      const containerNode = new ContainerNode( model.container, {
        left: this.layoutBounds.left + GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
        centerY: this.layoutBounds.centerY
      } );
      this.addChild( containerNode );

      // Time controls
      const timeControls = new TimeControls( model.isPlayingProperty,
        function() {
          model.isPlayingProperty.value = true;
          model.step();
          model.isPlayingProperty.value = false;
        }, {
          left: this.layoutBounds.left + GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
          bottom: this.layoutBounds.bottom - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
        } );
      this.addChild( timeControls );

      // Radio buttons for selecting particle type
      const particleTypeControl = new ParticleTypeControl( viewProperties.particleTypeProperty, {
        left: containerNode.right + 60,
        bottom: this.layoutBounds.bottom - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
      } );
      this.addChild( particleTypeControl );

      // Bicycle pump
      const bicyclePumpNode = new BicyclePumpNode( viewProperties.particleTypeProperty, {
        centerX: particleTypeControl.centerX,
        bottom: particleTypeControl.top - 15
      } );
      this.addChild( bicyclePumpNode );

      // Control panel at upper right
      const controlPanel = new IdealControlPanel( model.holdConstantProperty, viewProperties.sizeVisibleProperty,
        viewProperties.stopwatchVisibleProperty, viewProperties.collisionCounterVisibleProperty, {
        fixedWidth: PANEL_WIDTH,
        right: this.layoutBounds.right - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
        top: this.layoutBounds.top + GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
      } );
      this.addChild( controlPanel );

      // Particle Counts accordion box
      const particleCountsAccordionBox = new ParticleCountsAccordionBox(
        model.numberOfHeavyParticlesProperty, model.numberOfLightParticlesProperty, {
          fixedWidth: PANEL_WIDTH,
          expandedProperty: viewProperties.particleCountsExpandedProperty,
          right: controlPanel.right,
          top: controlPanel.bottom + 15
        } );
      this.addChild( particleCountsAccordionBox );

      // Reset All button
      const resetAllButton = new ResetAllButton( {
        listener: function() {
          model.reset();
          viewProperties.reset();
        },
        right: this.layoutBounds.maxX - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
        bottom: this.layoutBounds.maxY - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
      } );
      this.addChild( resetAllButton );
    }
  }

  return gasProperties.register( 'IdealScreenView', IdealScreenView );
} );