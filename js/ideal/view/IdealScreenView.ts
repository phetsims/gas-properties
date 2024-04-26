// Copyright 2018-2024, University of Colorado Boulder

/**
 * IdealScreenView is the view for the 'Ideal' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import { VBox } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import GasPropertiesOopsDialog from '../../common/view/GasPropertiesOopsDialog.js';
import IdealGasLawScreenView, { IdealGasLawScreenViewOptions } from '../../common/view/IdealGasLawScreenView.js';
import ParticlesAccordionBox from '../../common/view/ParticlesAccordionBox.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import IdealModel from '../model/IdealModel.js';
import IdealControlPanel from './IdealControlPanel.js';
import IdealViewProperties from './IdealViewProperties.js';
import IdealToolsPanel from './IdealToolsPanel.js';

type SelfOptions = {
  hasHoldConstantControls?: boolean;
};

type IdealScreenViewOptions = SelfOptions & IdealGasLawScreenViewOptions;

export default class IdealScreenView extends IdealGasLawScreenView {

  private readonly viewProperties: IdealViewProperties;

  public constructor( model: IdealModel, tandem: Tandem, providedOptions?: IdealScreenViewOptions ) {

    const options = optionize<IdealScreenViewOptions, SelfOptions, IdealGasLawScreenViewOptions>()( {

      // SelfOptions
      hasHoldConstantControls: true,

      // IdealScreenViewOptions
      resizeGripColor: GasPropertiesColors.idealResizeGripColorProperty
    }, providedOptions );

    // view-specific Properties
    const viewProperties = new IdealViewProperties( tandem.createTandem( 'viewProperties' ) );

    super( model, viewProperties.particleTypeProperty, viewProperties.widthVisibleProperty, tandem, options );

    const collisionCounter = model.collisionCounter!;
    assert && assert( collisionCounter );

    const panels = [];

    let holdConstantPanel;
    if ( options.hasHoldConstantControls ) {
      holdConstantPanel = new IdealControlPanel(
        model.holdConstantProperty,
        model.particleSystem.numberOfParticlesProperty,
        model.pressureModel.pressureProperty,
        model.container.isOpenProperty, {
          fixedWidth: GasPropertiesConstants.RIGHT_PANEL_WIDTH,
          tandem: tandem.createTandem( 'controlPanel' )
        } );
      panels.push( holdConstantPanel );
    }

    const toolsPanel = new IdealToolsPanel(
      viewProperties.widthVisibleProperty,
      model.stopwatch.isVisibleProperty,
      collisionCounter.visibleProperty, {
        fixedWidth: GasPropertiesConstants.RIGHT_PANEL_WIDTH,
        tandem: tandem.createTandem( 'toolsPanel' )
      }
    );
    panels.push( toolsPanel );

    // Particles accordion box
    const particlesAccordionBox = new ParticlesAccordionBox(
      model.particleSystem.numberOfHeavyParticlesProperty,
      model.particleSystem.numberOfLightParticlesProperty,
      model.modelViewTransform, {
        fixedWidth: GasPropertiesConstants.RIGHT_PANEL_WIDTH,
        expandedProperty: viewProperties.particlesExpandedProperty,
        tandem: tandem.createTandem( 'particlesAccordionBox' )
      } );
    panels.push( particlesAccordionBox );

    const vBox = new VBox( {
      align: 'left',
      spacing: GasPropertiesConstants.PANELS_Y_SPACING,
      children: panels,
      right: this.layoutBounds.right - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
      top: this.layoutBounds.top + GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
    } );
    this.addChild( vBox );
    vBox.moveToBack();

    // OopsDialogs related to the 'Hold Constant' feature. When holding a quantity constant would break the model,
    // the model puts itself in a sane configuration, the model notifies the view via an Emitter, and the view
    // notifies the user via a dialog. The student is almost certain to encounter these conditions, so dialogs are
    // created eagerly and reused.
    const oopsTemperatureEmptyDialog = new GasPropertiesOopsDialog( GasPropertiesStrings.oopsTemperatureEmptyStringProperty,
      tandem.createTandem( 'oopsTemperatureEmptyDialog' ) );
    model.oopsEmitters.temperatureEmptyEmitter.addListener( () => { this.showDialog( oopsTemperatureEmptyDialog ); } );

    const oopsTemperatureOpenDialog = new GasPropertiesOopsDialog( GasPropertiesStrings.oopsTemperatureOpenStringProperty,
      tandem.createTandem( 'oopsTemperatureOpenDialog' ) );
    model.oopsEmitters.temperatureOpenEmitter.addListener( () => { this.showDialog( oopsTemperatureOpenDialog ); } );

    const oopsPressureEmptyDialog = new GasPropertiesOopsDialog( GasPropertiesStrings.oopsPressureEmptyStringProperty,
      tandem.createTandem( 'oopsPressureEmptyDialog' ) );
    model.oopsEmitters.pressureEmptyEmitter.addListener( () => { this.showDialog( oopsPressureEmptyDialog ); } );

    const oopsPressureLargeDialog = new GasPropertiesOopsDialog( GasPropertiesStrings.oopsPressureLargeStringProperty,
      tandem.createTandem( 'oopsPressureLargeDialog' ) );
    model.oopsEmitters.pressureLargeEmitter.addListener( () => { this.showDialog( oopsPressureLargeDialog ); } );

    const oopsPressureSmallDialog = new GasPropertiesOopsDialog( GasPropertiesStrings.oopsPressureSmallStringProperty,
      tandem.createTandem( 'oopsPressureSmallDialog' ) );
    model.oopsEmitters.pressureSmallEmitter.addListener( () => { this.showDialog( oopsPressureSmallDialog ); } );

    this.viewProperties = viewProperties;

    // Play Area focus order, see https://github.com/phetsims/gas-properties/issues/213.
    this.pdomPlayAreaNode.pdomOrder = [
      this.heavyBicyclePumpNode,
      this.lightBicyclePumpNode,
      this.particleTypeRadioButtonGroup,
      particlesAccordionBox,
      this.eraseParticlesButton,
      this.heaterCoolerNode,
      this.containerNode,
      this.returnLidButton,
      this.collisionCounterNode!,
      this.stopwatchNode
    ];

    // Control Area focus order, see https://github.com/phetsims/gas-properties/issues/213.
    assert && assert( this.collisionCounterNode );
    const pdomOrder = [
      this.thermometerNode,
      this.pressureGaugeNode
    ];
    holdConstantPanel && pdomOrder.push( holdConstantPanel );
    pdomOrder.push( toolsPanel );
    pdomOrder.push( this.timeControlNode );
    pdomOrder.push( this.resetAllButton );
    this.pdomControlAreaNode.pdomOrder = pdomOrder;
  }

  protected override reset(): void {
    super.reset();
    this.viewProperties.reset();
  }
}

gasProperties.register( 'IdealScreenView', IdealScreenView );