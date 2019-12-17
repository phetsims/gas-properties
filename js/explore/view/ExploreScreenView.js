// Copyright 2018-2019, University of Colorado Boulder

/**
 * ExploreScreenView is the view for the 'Explore' screen.
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
  const IdealGasLawScreenView = require( 'GAS_PROPERTIES/common/view/IdealGasLawScreenView' );
  const Node = require( 'SCENERY/nodes/Node' );
  const ParticlesAccordionBox = require( 'GAS_PROPERTIES/common/view/ParticlesAccordionBox' );
  const Tandem = require( 'TANDEM/Tandem' );

  class ExploreScreenView extends IdealGasLawScreenView {

    /**
     * @param {ExploreModel} model
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {
      assert && assert( model instanceof ExploreModel, `invalid model: ${model}` );
      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      // view-specific Properties
      const viewProperties = new ExploreViewProperties( tandem.createTandem( 'viewProperties' ) );

      super( model, viewProperties.particleTypeProperty, viewProperties.widthVisibleProperty, tandem );

      // Panel at upper right
      const toolsPanel = new ExploreToolsPanel(
        viewProperties.widthVisibleProperty,
        model.stopwatch.isVisibleProperty,
        model.collisionCounter.visibleProperty, {
          fixedWidth: GasPropertiesConstants.RIGHT_PANEL_WIDTH,
          right: this.layoutBounds.right - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
          top: this.layoutBounds.top + GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN,
          tandem: tandem.createTandem( 'toolsPanel' )
        } );

      // Particles accordion box
      const particlesAccordionBox = new ParticlesAccordionBox(
        model.particleSystem.numberOfHeavyParticlesProperty,
        model.particleSystem.numberOfLightParticlesProperty,
        model.modelViewTransform, {
          fixedWidth: GasPropertiesConstants.RIGHT_PANEL_WIDTH,
          expandedProperty: viewProperties.particlesExpandedProperty,
          right: toolsPanel.right,
          top: toolsPanel.bottom + 15,
          tandem: tandem.createTandem( 'particlesAccordionBox' )
        } );

      // Rendering order. Everything we add should be behind what is created by super.
      const parent = new Node();
      parent.addChild( toolsPanel );
      parent.addChild( particlesAccordionBox );
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