// Copyright 2018-2019, University of Colorado Boulder

/**
 * The view for the 'Explore' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const CollisionCounterNode = require( 'GAS_PROPERTIES/common/view/CollisionCounterNode' );
  const ExploreToolsPanel = require( 'GAS_PROPERTIES/explore/view/ExploreToolsPanel' );
  const ExploreViewProperties = require( 'GAS_PROPERTIES/explore/view/ExploreViewProperties' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesScreenView = require( 'GAS_PROPERTIES/common/view/GasPropertiesScreenView' );
  const ParticleCountsAccordionBox = require( 'GAS_PROPERTIES/common/view/ParticleCountsAccordionBox' );
  const StopwatchNode = require( 'GAS_PROPERTIES/common/view/StopwatchNode' );

  // constants
  const RIGHT_PANEL_WIDTH = 225; // width of panels on the right side of the container, determined empirically

  class ExploreScreenView extends GasPropertiesScreenView {

    /**
     * @param {ExploreModel} model
     */
    constructor( model ) {

      // view-specific Properties
      const viewProperties = new ExploreViewProperties();

      super( model, viewProperties.particleTypeProperty, viewProperties.sizeVisibleProperty );

      // Panel at upper right
      const toolsPanel = new ExploreToolsPanel(
        viewProperties.sizeVisibleProperty,
        model.stopwatch.visibleProperty,
        model.collisionCounter.visibleProperty, {
          fixedWidth: RIGHT_PANEL_WIDTH,
          right: this.layoutBounds.right - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
          top: this.layoutBounds.top + GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
        } );
      this.addChild( toolsPanel );

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
      this.addChild( particleCountsAccordionBox );

      // Collision Counter
      const collisionCounterNode = new CollisionCounterNode( model.collisionCounter, this.comboBoxListParent, {
        dragBoundsProperty: this.visibleBoundsProperty
      } );
      this.addChild( collisionCounterNode );

      // Stopwatch
      const stopwatchNode = new StopwatchNode( model.stopwatch, {
        dragBoundsProperty: this.visibleBoundsProperty
      } );
      this.addChild( stopwatchNode );

      // This should be in front of everything else.
      this.comboBoxListParent.moveToFront();

      // @private
      this.viewProperties = viewProperties;
    }

    // @protected @override
    reset() {
      this.viewProperties.reset();
      super.reset();
    }
  }

  return gasProperties.register( 'ExploreScreenView', ExploreScreenView );
} );