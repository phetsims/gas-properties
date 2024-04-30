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
import HoldConstantPanel from './HoldConstantPanel.js';
import IdealViewProperties from './IdealViewProperties.js';
import IdealToolsPanel from './IdealToolsPanel.js';

type SelfOptions = {
  hasHoldConstantPanel?: boolean;
};

type IdealScreenViewOptions = SelfOptions & IdealGasLawScreenViewOptions;

export default class IdealScreenView extends IdealGasLawScreenView {

  private readonly viewProperties: IdealViewProperties;

  public constructor( model: IdealModel, tandem: Tandem, providedOptions?: IdealScreenViewOptions ) {

    const oopsDialogsTandem = tandem.createTandem( 'oopsDialogs' );

    const options = optionize<IdealScreenViewOptions, SelfOptions, IdealGasLawScreenViewOptions>()( {

      // SelfOptions
      hasHoldConstantPanel: true,

      // IdealScreenViewOptions
      resizeGripColor: GasPropertiesColors.idealResizeGripColorProperty,
      oopsDialogsTandem: oopsDialogsTandem
    }, providedOptions );

    // view-specific Properties
    const viewProperties = new IdealViewProperties( tandem.createTandem( 'viewProperties' ) );

    super( model, viewProperties.particleTypeProperty, viewProperties.widthVisibleProperty, tandem, options );

    const collisionCounter = model.collisionCounter!;
    assert && assert( collisionCounter );

    // Group panels and accordion boxes in the Studio tree.
    const panelsTandem = tandem.createTandem( 'panels' );

    const panels = [];

    let holdConstantPanel;
    if ( options.hasHoldConstantPanel ) {
      holdConstantPanel = new HoldConstantPanel(
        model.holdConstantProperty,
        model.particleSystem.numberOfParticlesProperty,
        model.pressureModel.pressureProperty,
        model.container.isOpenProperty,
        panelsTandem.createTandem( 'holdConstantPanel' ) );
      panels.push( holdConstantPanel );
    }

    const toolsPanel = new IdealToolsPanel(
      viewProperties.widthVisibleProperty,
      model.stopwatch.isVisibleProperty,
      collisionCounter.visibleProperty,
      panelsTandem.createTandem( 'toolsPanel' ) );
    panels.push( toolsPanel );

    // Particles accordion box
    const particlesAccordionBox = new ParticlesAccordionBox(
      model.particleSystem.numberOfHeavyParticlesProperty,
      model.particleSystem.numberOfLightParticlesProperty,
      model.modelViewTransform, {
        expandedProperty: viewProperties.particlesExpandedProperty,
        tandem: panelsTandem.createTandem( 'particlesAccordionBox' )
      } );
    panels.push( particlesAccordionBox );

    const vBox = new VBox( {
      align: 'left',
      spacing: GasPropertiesConstants.PANELS_Y_SPACING,
      children: panels,
      right: this.layoutBounds.right - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
      top: this.layoutBounds.top + GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN,

      // All panels have the same fixed width.
      stretch: true,
      minContentWidth: GasPropertiesConstants.RIGHT_PANEL_WIDTH,
      maxWidth: GasPropertiesConstants.RIGHT_PANEL_WIDTH
    } );
    this.addChild( vBox );
    vBox.moveToBack();

    // OopsDialogs related to the 'Hold Constant' feature. When holding a quantity constant would break the model,
    // the model puts itself in a sane configuration, the model notifies the view via an Emitter, and the view
    // notifies the user via a dialog. The student is almost certain to encounter these conditions, so dialogs are
    // created eagerly and reused.
    const oopsTemperatureContainerEmptyDialog = new GasPropertiesOopsDialog( GasPropertiesStrings.oopsTemperatureEmptyStringProperty, {
      tandem: oopsDialogsTandem.createTandem( 'oopsTemperatureContainerEmptyDialog' ),
      phetioDocumentation: 'Displayed if holding Temperature constant when the container is empty. To recover, Hold Constant is set to Nothing.'
    } );
    model.oopsEmitters.temperatureContainerEmptyEmitter.addListener( () => this.showDialog( oopsTemperatureContainerEmptyDialog ) );

    const oopsTemperatureLidOpenDialog = new GasPropertiesOopsDialog( GasPropertiesStrings.oopsTemperatureOpenStringProperty, {
      tandem: oopsDialogsTandem.createTandem( 'oopsTemperatureLidOpenDialog' ),
      phetioDocumentation: 'Displayed if holding Temperature constant with the container lid open. To recover, Hold Constant is set to Nothing.'
    } );
    model.oopsEmitters.temperatureLidOpenEmitter.addListener( () => this.showDialog( oopsTemperatureLidOpenDialog ) );

    const oopsPressureContainerEmptyDialog = new GasPropertiesOopsDialog( GasPropertiesStrings.oopsPressureEmptyStringProperty, {
      tandem: oopsDialogsTandem.createTandem( 'oopsPressureContainerEmptyDialog' ),
      phetioDocumentation: 'Displayed if holding Pressure constant when the container is empty. To recover, Hold Constant is set to Nothing.'
    } );
    model.oopsEmitters.pressureContainerEmptyEmitter.addListener( () => this.showDialog( oopsPressureContainerEmptyDialog ) );

    const oopsPressureVolumeTooLargeDialog = new GasPropertiesOopsDialog( GasPropertiesStrings.oopsPressureLargeStringProperty, {
      tandem: oopsDialogsTandem.createTandem( 'oopsPressureVolumeTooLargeDialog' ),
      phetioDocumentation: 'Displayed if holding Pressure constant would result in Volume that is too large. To recover, Hold Constant is set to Nothing.'
    } );
    model.oopsEmitters.pressureVolumeTooLargeEmitter.addListener( () => this.showDialog( oopsPressureVolumeTooLargeDialog ) );

    const oopsPressureVolumeTooSmallDialog = new GasPropertiesOopsDialog( GasPropertiesStrings.oopsPressureSmallStringProperty, {
      tandem: oopsDialogsTandem.createTandem( 'oopsPressureVolumeTooSmallDialog' ),
      phetioDocumentation: 'Displayed if holding Pressure constant would result in Volume that is too small. To recover, Hold Constant is set to Nothing.'
    } );
    model.oopsEmitters.pressureVolumeTooSmallEmitter.addListener( () => this.showDialog( oopsPressureVolumeTooSmallDialog ) );

    this.viewProperties = viewProperties;

    // Play Area focus order, see https://github.com/phetsims/gas-properties/issues/213.
    assert && assert( this.collisionCounterNode );
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