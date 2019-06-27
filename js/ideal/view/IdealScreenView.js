// Copyright 2018-2019, University of Colorado Boulder

/**
 * IdealScreenView is the view for the 'Ideal' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AnimatedHeaterCoolerNode = require( 'GAS_PROPERTIES/ideal/view/AnimatedHeaterCoolerNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesOopsDialog = require( 'GAS_PROPERTIES/common/view/GasPropertiesOopsDialog' );
  const GasPropertiesScreenView = require( 'GAS_PROPERTIES/common/view/GasPropertiesScreenView' );
  const HoldConstant = require( 'GAS_PROPERTIES/common/model/HoldConstant' );
  const IdealControlPanel = require( 'GAS_PROPERTIES/ideal/view/IdealControlPanel' );
  const IdealModel = require( 'GAS_PROPERTIES/ideal/model/IdealModel' );
  const IdealViewProperties = require( 'GAS_PROPERTIES/ideal/view/IdealViewProperties' );
  const ParticlesAccordionBox = require( 'GAS_PROPERTIES/common/view/ParticlesAccordionBox' );
  const Tandem = require( 'TANDEM/Tandem' );

  // strings
  const oopsTemperatureEmptyString = require( 'string!GAS_PROPERTIES/oopsTemperatureEmpty' );
  const oopsPressureEmptyString = require( 'string!GAS_PROPERTIES/oopsPressureEmpty' );
  const oopsPressureLargeString = require( 'string!GAS_PROPERTIES/oopsPressureLarge' );
  const oopsPressureSmallString = require( 'string!GAS_PROPERTIES/oopsPressureSmall' );

  // constants
  const RIGHT_PANEL_WIDTH = 225; // width of panels on the right side of the container, determined empirically

  class IdealScreenView extends GasPropertiesScreenView {

    /**
     * @param {IdealModel} model
     * @param {Tandem} tandem
     * @param {Object} [options]
     */
    constructor( model, tandem, options ) {
      assert && assert( model instanceof IdealModel, `invalid model: ${model}` );
      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      options = _.extend( {

        // superclass options
        hasHoldConstantControls: true,
        resizeGripColor: GasPropertiesColorProfile.idealResizeGripColorProperty
      }, options );

      // view-specific Properties
      const viewProperties = new IdealViewProperties();

      super( model, viewProperties.particleTypeProperty, viewProperties.sizeVisibleProperty, tandem, options );

      // Flame/ice is animated when holding pressure constant and adjusting temperature (HoldConstant.PRESSURE_T).
      // The user is not controlling the heat, and we animate the bucket to correspond to the temperature change.
      const animatedHeaterCoolerNode = new AnimatedHeaterCoolerNode(
        model.holdConstantProperty,
        model.particleSystem.numberOfParticlesProperty,
        model.temperatureModel.temperatureProperty, {
          translation: this.heaterCoolerNode.translation,
          scale: GasPropertiesConstants.HEATER_COOLER_NODE_SCALE
        } );
      this.addChild( animatedHeaterCoolerNode );

      // Swap visibility of HeaterCoolerNodes
      model.holdConstantProperty.link( holdConstant => {
        animatedHeaterCoolerNode.visible = ( holdConstant === HoldConstant.PRESSURE_T );
        this.heaterCoolerNode.visible = ( holdConstant !== HoldConstant.PRESSURE_T );
      } );

      // Control panel at upper right
      const controlPanel = new IdealControlPanel(
        model.holdConstantProperty,
        model.particleSystem.numberOfParticlesProperty,
        model.pressureModel.pressureProperty,
        viewProperties.sizeVisibleProperty,
        model.stopwatch.visibleProperty,
        model.collisionCounter.visibleProperty, {
          hasHoldConstantControls: options.hasHoldConstantControls,
          fixedWidth: RIGHT_PANEL_WIDTH,
          right: this.layoutBounds.right - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
          top: this.layoutBounds.top + GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
        } );
      this.addChild( controlPanel );
      controlPanel.moveToBack();

      // Particles accordion box
      const particlesAccordionBox = new ParticlesAccordionBox(
        model.particleSystem.numberOfHeavyParticlesProperty,
        model.particleSystem.numberOfLightParticlesProperty,
        model.modelViewTransform, {
          fixedWidth: RIGHT_PANEL_WIDTH,
          expandedProperty: viewProperties.particleCountsExpandedProperty,
          right: controlPanel.right,
          top: controlPanel.bottom + 15
        } );
      this.addChild( particlesAccordionBox );
      particlesAccordionBox.moveToBack();

      // OopsDialogs related to the 'Hold Constant' feature. When holding a quantity constant would break the model,
      // the model puts itself in a sane configuration, the model notifies the view via an Emitter, and the view
      // notifies the user via a dialog. The student is almost certain to encounter these conditions, so dialogs are
      // created eagerly and reused.
      const oopsTemperatureEmptyDialog = new GasPropertiesOopsDialog( oopsTemperatureEmptyString );
      model.oopsEmitters.temperatureEmptyEmitter.addListener( () => { oopsTemperatureEmptyDialog.show(); } );

      const oopsPressureEmptyDialog = new GasPropertiesOopsDialog( oopsPressureEmptyString );
      model.oopsEmitters.pressureEmptyEmitter.addListener( () => { oopsPressureEmptyDialog.show(); } );

      const oopsPressureLargeDialog = new GasPropertiesOopsDialog( oopsPressureLargeString );
      model.oopsEmitters.pressureLargeEmitter.addListener( () => { oopsPressureLargeDialog.show(); } );

      const oopsPressureSmallDialog = new GasPropertiesOopsDialog( oopsPressureSmallString );
      model.oopsEmitters.pressureSmallEmitter.addListener( () => { oopsPressureSmallDialog.show(); } );

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
     * Steps the view using real time units.
     * @param {number} dt - delta time, in seconds
     * @public
     * @override
     */
    stepView( dt ) {
      assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );
      super.stepView( dt );
      this.animatedHeaterCoolerNode.step( dt );
    }
  }

  return gasProperties.register( 'IdealScreenView', IdealScreenView );
} );