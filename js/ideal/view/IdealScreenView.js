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
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const ContainerNode = require( 'GAS_PROPERTIES/common/view/ContainerNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const HoldConstantPanel = require( 'GAS_PROPERTIES/ideal/view/HoldConstantPanel' );
  const ParticleCountsAccordionBox = require( 'GAS_PROPERTIES/ideal/view/ParticleCountsAccordionBox' );
  const ParticleTypeControl = require( 'GAS_PROPERTIES/ideal/view/ParticleTypeControl' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const SizeCheckbox = require( 'GAS_PROPERTIES/ideal/view/SizeCheckbox' );
  const StringProperty = require( 'AXON/StringProperty' );
  const TimeControls = require( 'GAS_PROPERTIES/common/view/TimeControls' );

  // constants
  const PANEL_WIDTH = 250;
  const PARTICLE_TYPE_VALUES = [ 'heavy', 'light' ];

  class IdealScreenView extends ScreenView {

    /**
     * @param {IntroModel} model
     */
    constructor( model ) {

      super();

      // view-specific Properties
      const particleTypeProperty = new StringProperty( 'heavy', {
        validValues: PARTICLE_TYPE_VALUES
      } );
      const particleCountsExpandedProperty = new BooleanProperty( false );
      const sizeVisibleProperty = new BooleanProperty( false );

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
      const particleTypeControl = new ParticleTypeControl( particleTypeProperty, {
        left: containerNode.right + 60,
        bottom: this.layoutBounds.bottom - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
      } );
      this.addChild( particleTypeControl );

      // Bicycle pump
      const bicyclePumpNode = new BicyclePumpNode( particleTypeProperty, {
        centerX: particleTypeControl.centerX,
        bottom: particleTypeControl.top - 15
      } );
      this.addChild( bicyclePumpNode );

      // Hold Constant panel
      const holdConstantPanel = new HoldConstantPanel( model.holdConstantProperty, {
        fixedWidth: PANEL_WIDTH,
        right: this.layoutBounds.right - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
        top: this.layoutBounds.top + GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
      } );
      this.addChild( holdConstantPanel );

      // Particle Counts accordion box
      const particleCountsAccordionBox = new ParticleCountsAccordionBox(
        model.numberOfHeavyParticlesProperty, model.numberOfLightParticlesProperty, {
          fixedWidth: PANEL_WIDTH,
          expandedProperty: particleCountsExpandedProperty,
          right: holdConstantPanel.right,
          top: holdConstantPanel.bottom + 15
        } );
      this.addChild( particleCountsAccordionBox );

      // Size checkbox, positioned below the *expanded* Particle Counts accordion box
      const particleCountsExpanded = particleCountsExpandedProperty.value; // save state
      particleCountsExpandedProperty.value = true; // expand for positioning
      const sizeCheckbox = new SizeCheckbox( sizeVisibleProperty, {
        left: particleCountsAccordionBox.left,
        top: particleCountsAccordionBox.bottom + 15
      } );
      this.addChild( sizeCheckbox );
      particleCountsExpandedProperty.value = particleCountsExpanded; // restore state

      // Reset All button
      const resetAllButton = new ResetAllButton( {
        listener: function() {
          model.reset();
          particleCountsExpandedProperty.reset();
          sizeVisibleProperty.reset();
        },
        right: this.layoutBounds.maxX - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
        bottom: this.layoutBounds.maxY - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
      } );
      this.addChild( resetAllButton );
    }
  }

  return gasProperties.register( 'IdealScreenView', IdealScreenView );
} );