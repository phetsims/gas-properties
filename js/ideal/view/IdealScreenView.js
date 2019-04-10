// Copyright 2018-2019, University of Colorado Boulder

/**
 * The view for the 'Ideal' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesScreenView = require( 'GAS_PROPERTIES/common/view/GasPropertiesScreenView' );
  const IdealControlPanel = require( 'GAS_PROPERTIES/ideal/view/IdealControlPanel' );
  const IdealViewProperties = require( 'GAS_PROPERTIES/ideal/view/IdealViewProperties' );
  const Node = require( 'SCENERY/nodes/Node' );
  const ParticleCountsAccordionBox = require( 'GAS_PROPERTIES/common/view/ParticleCountsAccordionBox' );

  // constants
  const RIGHT_PANEL_WIDTH = 225; // width of panels on the right side of the container, determined empirically

  class IdealScreenView extends GasPropertiesScreenView {

    /**
     * @param {IdealModel} model
     */
    constructor( model ) {

      // view-specific Properties
      const viewProperties = new IdealViewProperties();

      super( model, viewProperties.particleTypeProperty, viewProperties.sizeVisibleProperty, {
        resizeGripColor: GasPropertiesColorProfile.idealResizeGripColorProperty
      } );

      // Control panel at upper right
      const controlPanel = new IdealControlPanel(
        model.holdConstantProperty,
        viewProperties.sizeVisibleProperty,
        model.stopwatch.visibleProperty,
        model.collisionCounter.visibleProperty, {
          fixedWidth: RIGHT_PANEL_WIDTH,
          right: this.layoutBounds.right - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
          top: this.layoutBounds.top + GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
        } );

      // Particle Counts accordion box
      const particleCountsAccordionBox = new ParticleCountsAccordionBox(
        model.numberOfHeavyParticlesProperty,
        model.numberOfLightParticlesProperty,
        model.modelViewTransform, {
          fixedWidth: RIGHT_PANEL_WIDTH,
          expandedProperty: viewProperties.particleCountsExpandedProperty,
          right: controlPanel.right,
          top: controlPanel.bottom + 15
        } );

      // Rendering order. Everything we add should be behind what is created by super.
      const parent = new Node();
      parent.addChild( controlPanel );
      parent.addChild( particleCountsAccordionBox );
      this.addChild( parent );
      parent.moveToBack();

      // @private used in methods
      this.viewProperties = viewProperties;
    }

    // @protected @override
    reset() {
      this.viewProperties.reset();
      super.reset();
    }
  }

  return gasProperties.register( 'IdealScreenView', IdealScreenView );
} );