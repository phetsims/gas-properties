// Copyright 2018-2022, University of Colorado Boulder

// @ts-nocheck
/**
 * IdealScreenView is the view for the 'Ideal' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import GasPropertiesOopsDialog from '../../common/view/GasPropertiesOopsDialog.js';
import IdealGasLawScreenView from '../../common/view/IdealGasLawScreenView.js';
import ParticlesAccordionBox from '../../common/view/ParticlesAccordionBox.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import IdealModel from '../model/IdealModel.js';
import IdealControlPanel from './IdealControlPanel.js';
import IdealViewProperties from './IdealViewProperties.js';

export default class IdealScreenView extends IdealGasLawScreenView {

  /**
   * @param {IdealModel} model
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( model, tandem, options ) {
    assert && assert( model instanceof IdealModel, `invalid model: ${model}` );
    assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

    options = merge( {

      // superclass options
      hasHoldConstantControls: true,
      resizeGripColor: GasPropertiesColors.idealResizeGripColorProperty
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
      model.stopwatch.isVisibleProperty,
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
    const oopsTemperatureEmptyDialog = new GasPropertiesOopsDialog( GasPropertiesStrings.oopsTemperatureEmptyStringProperty );
    model.oopsEmitters.temperatureEmptyEmitter.addListener( () => { this.showDialog( oopsTemperatureEmptyDialog ); } );

    const oopsTemperatureOpenDialog = new GasPropertiesOopsDialog( GasPropertiesStrings.oopsTemperatureOpenStringProperty );
    model.oopsEmitters.temperatureOpenEmitter.addListener( () => { this.showDialog( oopsTemperatureOpenDialog ); } );

    const oopsPressureEmptyDialog = new GasPropertiesOopsDialog( GasPropertiesStrings.oopsPressureEmptyStringProperty );
    model.oopsEmitters.pressureEmptyEmitter.addListener( () => { this.showDialog( oopsPressureEmptyDialog ); } );

    const oopsPressureLargeDialog = new GasPropertiesOopsDialog( GasPropertiesStrings.oopsPressureLargeStringProperty );
    model.oopsEmitters.pressureLargeEmitter.addListener( () => { this.showDialog( oopsPressureLargeDialog ); } );

    const oopsPressureSmallDialog = new GasPropertiesOopsDialog( GasPropertiesStrings.oopsPressureSmallStringProperty );
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

gasProperties.register( 'IdealScreenView', IdealScreenView );