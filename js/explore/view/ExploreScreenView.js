// Copyright 2018-2019, University of Colorado Boulder

/**
 * The view for the 'Explore' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ExploreModel = require( 'GAS_PROPERTIES/explore/model/ExploreModel' );
  const ExploreToolsPanel = require( 'GAS_PROPERTIES/explore/view/ExploreToolsPanel' );
  const ExploreViewProperties = require( 'GAS_PROPERTIES/explore/view/ExploreViewProperties' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesScreenView = require( 'GAS_PROPERTIES/common/view/GasPropertiesScreenView' );
  const Node = require( 'SCENERY/nodes/Node' );
  const ParticleCountsAccordionBox = require( 'GAS_PROPERTIES/common/view/ParticleCountsAccordionBox' );

  // constants
  const RIGHT_PANEL_WIDTH = 225; // width of panels on the right side of the container, determined empirically

  class ExploreScreenView extends GasPropertiesScreenView {

    /**
     * @param {ExploreModel} model
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {
      assert && assert( model instanceof ExploreModel, `invalid model: ${model}` );

      // view-specific Properties
      const viewProperties = new ExploreViewProperties();

      super( model, viewProperties.particleTypeProperty, viewProperties.sizeVisibleProperty, tandem, {
        redistributeParticles: false
      } );

      // Panel at upper right
      const toolsPanel = new ExploreToolsPanel(
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
          right: toolsPanel.right,
          top: toolsPanel.bottom + 15
        } );

      // Rendering order. Everything we add should be behind what is created by super.
      const parent = new Node();
      parent.addChild( toolsPanel );
      parent.addChild( particleCountsAccordionBox );
      this.addChild( parent );
      parent.moveToBack();

      // @private used in methods
      this.viewProperties = viewProperties;
    }

    /**
     * Resets the screen.
     * @protected
     * @override
     */
    reset() {
      super.reset();
      this.viewProperties.reset();
    }
  }

  return gasProperties.register( 'ExploreScreenView', ExploreScreenView );
} );