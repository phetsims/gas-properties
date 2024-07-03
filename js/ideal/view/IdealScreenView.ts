// Copyright 2018-2024, University of Colorado Boulder

/**
 * IdealScreenView is the view for the 'Ideal' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import { Node, VBox } from '../../../../scenery/js/imports.js';
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
import Tandem from '../../../../tandem/js/Tandem.js';

type SelfOptions = {

  // Whether the sim has the 'Hold Constant' feature.
  hasHoldConstantFeature?: boolean;
};

type IdealScreenViewOptions = SelfOptions & IdealGasLawScreenViewOptions;

export default class IdealScreenView extends IdealGasLawScreenView {

  private readonly viewProperties: IdealViewProperties;

  public constructor( model: IdealModel, providedOptions: IdealScreenViewOptions ) {

    const options = optionize<IdealScreenViewOptions, SelfOptions, IdealGasLawScreenViewOptions>()( {

      // SelfOptions
      hasHoldConstantFeature: false
    }, providedOptions );

    // view-specific Properties
    const viewProperties = new IdealViewProperties( options.tandem.createTandem( 'viewProperties' ) );

    super( model, viewProperties.particleTypeProperty, viewProperties.widthVisibleProperty, options );

    const collisionCounter = model.collisionCounter!;
    assert && assert( collisionCounter );

    // Group panels and accordion boxes in the Studio tree.
    const panelsTandem = options.tandem.createTandem( 'panels' );

    const panels = [];

    // Particles accordion box
    const particlesAccordionBox = new ParticlesAccordionBox(
      model.particleSystem.numberOfHeavyParticlesProperty,
      model.particleSystem.numberOfLightParticlesProperty,
      model.modelViewTransform, {
        expandedProperty: viewProperties.particlesExpandedProperty,
        tandem: panelsTandem.createTandem( 'particlesAccordionBox' )
      } );
    panels.push( particlesAccordionBox );

    let holdConstantPanel;
    if ( options.hasHoldConstantFeature ) {
      holdConstantPanel = new HoldConstantPanel(
        model.holdConstantProperty,
        model.particleSystem.numberOfParticlesProperty,
        model.pressureModel.pressureKilopascalsProperty,
        model.container.lidIsOpenProperty,
        panelsTandem.createTandem( 'holdConstantPanel' ) );
      panels.push( holdConstantPanel );
    }

    const toolsPanel = new IdealToolsPanel(
      viewProperties.widthVisibleProperty,
      model.stopwatch.isVisibleProperty,
      collisionCounter.visibleProperty,
      panelsTandem.createTandem( 'toolsPanel' ) );
    panels.push( toolsPanel );

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
      tandem: options.hasHoldConstantFeature ? this.oopsDialogsTandem.createTandem( 'oopsTemperatureContainerEmptyDialog' ) : Tandem.OPT_OUT,
      phetioDocumentation: 'Displayed if holding Temperature constant when the container is empty. To recover, Hold Constant is set to Nothing.'
    } );
    model.oopsEmitters.temperatureContainerEmptyEmitter.addListener( () => this.showDialog( oopsTemperatureContainerEmptyDialog ) );

    const oopsTemperatureLidOpenDialog = new GasPropertiesOopsDialog( GasPropertiesStrings.oopsTemperatureOpenStringProperty, {
      tandem: options.hasHoldConstantFeature ? this.oopsDialogsTandem.createTandem( 'oopsTemperatureLidOpenDialog' ) : Tandem.OPT_OUT,
      phetioDocumentation: 'Displayed if holding Temperature constant with the container lid open. To recover, Hold Constant is set to Nothing.'
    } );
    model.oopsEmitters.temperatureLidOpenEmitter.addListener( () => this.showDialog( oopsTemperatureLidOpenDialog ) );

    const oopsPressureContainerEmptyDialog = new GasPropertiesOopsDialog( GasPropertiesStrings.oopsPressureEmptyStringProperty, {
      tandem: options.hasHoldConstantFeature ? this.oopsDialogsTandem.createTandem( 'oopsPressureContainerEmptyDialog' ) : Tandem.OPT_OUT,
      phetioDocumentation: 'Displayed if holding Pressure constant when the container is empty. To recover, Hold Constant is set to Nothing.'
    } );
    model.oopsEmitters.pressureContainerEmptyEmitter.addListener( () => this.showDialog( oopsPressureContainerEmptyDialog ) );

    const oopsPressureVolumeTooLargeDialog = new GasPropertiesOopsDialog( GasPropertiesStrings.oopsPressureLargeStringProperty, {
      tandem: options.hasHoldConstantFeature ? this.oopsDialogsTandem.createTandem( 'oopsPressureVolumeTooLargeDialog' ) : Tandem.OPT_OUT,
      phetioDocumentation: 'Displayed if holding Pressure constant would result in Volume that is too large. To recover, Hold Constant is set to Nothing.'
    } );
    model.oopsEmitters.pressureVolumeTooLargeEmitter.addListener( () => this.showDialog( oopsPressureVolumeTooLargeDialog ) );

    const oopsPressureVolumeTooSmallDialog = new GasPropertiesOopsDialog( GasPropertiesStrings.oopsPressureSmallStringProperty, {
      tandem: options.hasHoldConstantFeature ? this.oopsDialogsTandem.createTandem( 'oopsPressureVolumeTooSmallDialog' ) : Tandem.OPT_OUT,
      phetioDocumentation: 'Displayed if holding Pressure constant would result in Volume that is too small. To recover, Hold Constant is set to Nothing.'
    } );
    model.oopsEmitters.pressureVolumeTooSmallEmitter.addListener( () => this.showDialog( oopsPressureVolumeTooSmallDialog ) );

    this.viewProperties = viewProperties;

    // Play Area focus order, see https://github.com/phetsims/gas-properties/issues/213.
    assert && assert( this.collisionCounterNode );
    const pdomOrderPlayArea: Node[] = [
      particlesAccordionBox
    ];
    holdConstantPanel && pdomOrderPlayArea.push( holdConstantPanel );
    pdomOrderPlayArea.push(
      this.bicyclePumpControl,
      this.eraseParticlesButton,
      this.heaterCoolerNode,
      this.containerNode,
      this.returnLidButton,
      this.thermometerNode,
      this.pressureGaugeNode,
      this.stopwatchNode,
      this.collisionCounterNode!
    );
    this.pdomPlayAreaNode.pdomOrder = pdomOrderPlayArea;

    // Control Area focus order, see https://github.com/phetsims/gas-properties/issues/213.
    this.pdomControlAreaNode.pdomOrder = [
      toolsPanel,
      this.timeControlNode,
      this.resetAllButton
    ];
  }

  protected override reset(): void {
    super.reset();
    this.viewProperties.reset();
  }
}

gasProperties.register( 'IdealScreenView', IdealScreenView );