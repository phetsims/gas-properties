// Copyright 2018-2019, University of Colorado Boulder

/**
 * IdealScreenView is the view for the 'Ideal' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesOopsDialog = require( 'GAS_PROPERTIES/common/view/GasPropertiesOopsDialog' );
  const IdealGasLawScreenView = require( 'GAS_PROPERTIES/common/view/IdealGasLawScreenView' );
  const IdealControlPanel = require( 'GAS_PROPERTIES/ideal/view/IdealControlPanel' );
  const IdealModel = require( 'GAS_PROPERTIES/ideal/model/IdealModel' );
  const IdealViewProperties = require( 'GAS_PROPERTIES/ideal/view/IdealViewProperties' );
  const ParticlesAccordionBox = require( 'GAS_PROPERTIES/common/view/ParticlesAccordionBox' );
  const Tandem = require( 'TANDEM/Tandem' );

  // strings
  const oopsPressureEmptyString = require( 'string!GAS_PROPERTIES/oopsPressureEmpty' );
  const oopsPressureLargeString = require( 'string!GAS_PROPERTIES/oopsPressureLarge' );
  const oopsPressureSmallString = require( 'string!GAS_PROPERTIES/oopsPressureSmall' );
  const oopsTemperatureEmptyString = require( 'string!GAS_PROPERTIES/oopsTemperatureEmpty' );
  const oopsTemperatureOpenString = require( 'string!GAS_PROPERTIES/oopsTemperatureOpen' );

  class IdealScreenView extends IdealGasLawScreenView {

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
      const viewProperties = new IdealViewProperties( tandem.createTandem( 'viewProperties' ) );

      super( model, viewProperties.particleTypeProperty, viewProperties.widthVisibleProperty, tandem, options );

      // Control panel at upper right
      const controlPanel = new IdealControlPanel(
        model.holdConstantProperty,
        model.particleSystem.numberOfParticlesProperty,
        model.pressureModel.pressureProperty,
        model.container.isOpenProperty,
        viewProperties.widthVisibleProperty,
        model.stopwatch.visibleProperty,
        model.collisionCounter.visibleProperty, {
          hasHoldConstantControls: options.hasHoldConstantControls,
          fixedWidth: GasPropertiesConstants.RIGHT_PANEL_WIDTH,
          right: this.layoutBounds.right - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
          top: this.layoutBounds.top + GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN,
          tandem: tandem.createTandem( 'controlPanel' )
        } );
      this.addChild( controlPanel );
      controlPanel.moveToBack();

      // Particles accordion box
      const particlesAccordionBox = new ParticlesAccordionBox(
        model.particleSystem.numberOfHeavyParticlesProperty,
        model.particleSystem.numberOfLightParticlesProperty,
        model.modelViewTransform, {
          fixedWidth: GasPropertiesConstants.RIGHT_PANEL_WIDTH,
          expandedProperty: viewProperties.particlesExpandedProperty,
          right: controlPanel.right,
          top: controlPanel.bottom + 15,
          tandem: tandem.createTandem( 'particlesAccordionBox' )
        } );
      this.addChild( particlesAccordionBox );
      particlesAccordionBox.moveToBack();

      // OopsDialogs related to the 'Hold Constant' feature. When holding a quantity constant would break the model,
      // the model puts itself in a sane configuration, the model notifies the view via an Emitter, and the view
      // notifies the user via a dialog. The student is almost certain to encounter these conditions, so dialogs are
      // created eagerly and reused.
      const oopsTemperatureEmptyDialog = new GasPropertiesOopsDialog( oopsTemperatureEmptyString );
      model.oopsEmitters.temperatureEmptyEmitter.addListener( () => { this.showDialog( oopsTemperatureEmptyDialog ); } );

      const oopsTemperatureOpenDialog = new GasPropertiesOopsDialog( oopsTemperatureOpenString );
      model.oopsEmitters.temperatureOpenEmitter.addListener( () => { this.showDialog( oopsTemperatureOpenDialog ); } );

      const oopsPressureEmptyDialog = new GasPropertiesOopsDialog( oopsPressureEmptyString );
      model.oopsEmitters.pressureEmptyEmitter.addListener( () => { this.showDialog( oopsPressureEmptyDialog ); } );

      const oopsPressureLargeDialog = new GasPropertiesOopsDialog( oopsPressureLargeString );
      model.oopsEmitters.pressureLargeEmitter.addListener( () => { this.showDialog( oopsPressureLargeDialog ); } );

      const oopsPressureSmallDialog = new GasPropertiesOopsDialog( oopsPressureSmallString );
      model.oopsEmitters.pressureSmallEmitter.addListener( () => { this.showDialog( oopsPressureSmallDialog ); } );

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