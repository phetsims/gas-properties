// Copyright 2018-2019, University of Colorado Boulder

/**
 * The view for the 'Ideal' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AnimatedHeaterCoolerNode = require( 'GAS_PROPERTIES/common/view/AnimatedHeaterCoolerNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesScreenView = require( 'GAS_PROPERTIES/common/view/GasPropertiesScreenView' );
  const IdealControlPanel = require( 'GAS_PROPERTIES/ideal/view/IdealControlPanel' );
  const IdealModel = require( 'GAS_PROPERTIES/ideal/model/IdealModel' );
  const IdealViewProperties = require( 'GAS_PROPERTIES/ideal/view/IdealViewProperties' );
  const ParticlesAccordionBox = require( 'GAS_PROPERTIES/common/view/ParticlesAccordionBox' );
  const Tandem = require( 'TANDEM/Tandem' );

  // constants
  const RIGHT_PANEL_WIDTH = 225; // width of panels on the right side of the container, determined empirically

  class IdealScreenView extends GasPropertiesScreenView {

    /**
     * @param {IdealModel} model
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {
      assert && assert( model instanceof IdealModel, `invalid model: ${model}` );
      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      // view-specific Properties
      const viewProperties = new IdealViewProperties();

      super( model, viewProperties.particleTypeProperty, viewProperties.sizeVisibleProperty, tandem, {
        resizeGripColor: GasPropertiesColorProfile.idealResizeGripColorProperty
      } );

      // Flame/ice is animated when holding pressure constant and adjusting temperature (HoldConstant.PRESSURE_T).
      // The user is not controlling the heat, and we animate the bucket to correspond to the temperature change.
      const animatedHeaterCoolerNode = new AnimatedHeaterCoolerNode(
        model.temperatureProperty, model.holdConstantProperty, {
          translation: this.heaterCoolerNode.translation,
          scale: GasPropertiesConstants.HEATER_COOLER_SCALE
        } );
      this.addChild( animatedHeaterCoolerNode );

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
      this.addChild( controlPanel );
      controlPanel.moveToBack();

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
      this.addChild( particlesAccordionBox );
      particlesAccordionBox.moveToBack();

      // @private used in methods
      this.viewProperties = viewProperties;
      this.animatedHeaterCoolerNode = animatedHeaterCoolerNode;
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

    /**
     * Steps the model using real time units.
     * @param {number} dt - delta time, in seconds
     * @public
     * @override
     */
    stepManual( dt ) {
      super.stepManual( dt );
      this.animatedHeaterCoolerNode.step( dt );
    }
  }

  return gasProperties.register( 'IdealScreenView', IdealScreenView );
} );