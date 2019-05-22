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
  const IdealModel = require( 'GAS_PROPERTIES/ideal/model/IdealModel' );
  const IdealViewProperties = require( 'GAS_PROPERTIES/ideal/view/IdealViewProperties' );
  const Node = require( 'SCENERY/nodes/Node' );
  const ParticlesAccordionBox = require( 'GAS_PROPERTIES/common/view/ParticlesAccordionBox' );

  // constants
  const RIGHT_PANEL_WIDTH = 225; // width of panels on the right side of the container, determined empirically

  class IdealScreenView extends GasPropertiesScreenView {

    /**
     * @param {IdealModel} model
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {
      assert && assert( model instanceof IdealModel, `invalid model: ${model}` );

      // view-specific Properties
      const viewProperties = new IdealViewProperties();

      super( model, viewProperties.particleTypeProperty, viewProperties.sizeVisibleProperty, tandem, {
        resizeGripColor: GasPropertiesColorProfile.idealResizeGripColorProperty
      } );

      // Control panel at upper right
      const controlPanel = new IdealControlPanel(
        model.holdConstantProperty,
        model.totalNumberOfParticlesProperty,
        model.pressureProperty,
        viewProperties.sizeVisibleProperty,
        model.stopwatch.visibleProperty,
        model.collisionCounter.visibleProperty, {
          fixedWidth: RIGHT_PANEL_WIDTH,
          right: this.layoutBounds.right - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
          top: this.layoutBounds.top + GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
        } );

      // Particles accordion box
      const particlesAccordionBox = new ParticlesAccordionBox(
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

  return gasProperties.register( 'IdealScreenView', IdealScreenView );
} );