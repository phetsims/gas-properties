// Copyright 2018-2024, University of Colorado Boulder

/**
 * HoldConstantPanel is the panel titled 'Hold Constant' that appears in the 'Ideal' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { NodeTranslationOptions, Text, TextOptions, VBox } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import gasProperties from '../../gasProperties.js';
import { HoldConstant } from '../../common/model/HoldConstant.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { optionize4 } from '../../../../phet-core/js/optionize.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import AquaRadioButtonGroup, { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import Multilink from '../../../../axon/js/Multilink.js';

const SPACING = 12;
const TEXT_OPTIONS: TextOptions = {
  font: GasPropertiesConstants.CONTROL_FONT,
  fill: GasPropertiesColors.textFillProperty,
  maxWidth: 175 // determined empirically
};

type SelfOptions = {
  fixedWidth?: number;
};

type IdealControlPanelOptions = SelfOptions & NodeTranslationOptions & PickRequired<PanelOptions, 'tandem'>;

export default class HoldConstantPanel extends Panel {

  public constructor( holdConstantProperty: StringUnionProperty<HoldConstant>,
                      numberOfParticlesProperty: TReadOnlyProperty<number>,
                      pressureProperty: TReadOnlyProperty<number>,
                      isContainerOpenProperty: TReadOnlyProperty<boolean>,
                      providedOptions: IdealControlPanelOptions ) {

    const options = optionize4<IdealControlPanelOptions, SelfOptions, PanelOptions>()(
      {}, GasPropertiesConstants.PANEL_OPTIONS, {

        // SelfOptions
        fixedWidth: 100,
        xMargin: GasPropertiesConstants.PANEL_OPTIONS.xMargin,

        // PanelOptions
        isDisposable: false
      }, providedOptions );

    const titleText = new Text( GasPropertiesStrings.holdConstant.titleStringProperty, {
      font: GasPropertiesConstants.TITLE_FONT,
      fill: GasPropertiesColors.textFillProperty,
      maxWidth: 200 // determined empirically
    } );

    const items: AquaRadioButtonGroupItem<HoldConstant>[] = [
      {
        value: 'nothing',
        createNode: () => new Text( GasPropertiesStrings.holdConstant.nothingStringProperty, TEXT_OPTIONS ),
        tandemName: 'nothingRadioButton'
      },
      {
        value: 'volume',
        createNode: () => new Text( GasPropertiesStrings.holdConstant.volumeStringProperty, TEXT_OPTIONS ),
        tandemName: 'volumeRadioButton'
      },
      {
        value: 'temperature',
        createNode: () => new Text( GasPropertiesStrings.holdConstant.temperatureStringProperty, TEXT_OPTIONS ),
        tandemName: 'temperatureRadioButton'
      },
      {
        value: 'pressureV',
        createNode: () => new Text( GasPropertiesStrings.holdConstant.pressureVStringProperty, TEXT_OPTIONS ),
        tandemName: 'pressureVRadioButton'
      },
      {
        value: 'pressureT',
        createNode: () => new Text( GasPropertiesStrings.holdConstant.pressureTStringProperty, TEXT_OPTIONS ),
        tandemName: 'pressureTRadioButton'
      }
    ];

    const radioButtonGroup = new AquaRadioButtonGroup( holdConstantProperty, items, {
      radioButtonOptions: GasPropertiesConstants.AQUA_RADIO_BUTTON_OPTIONS,
      orientation: 'vertical',
      align: 'left',
      spacing: SPACING,
      tandem: options.tandem.createTandem( 'radioButtonGroup' )
    } );

    const contentWidth = options.fixedWidth - ( 2 * options.xMargin );

    const content = new VBox( {
      preferredWidth: contentWidth,
      widthSizable: false, // so that width will remain preferredWidth
      align: 'left',
      spacing: SPACING,
      children: [ titleText, radioButtonGroup ]
    } );

    super( content, options );

    // Disable "Temperature (T)" radio button for conditions that are not possible.
    const temperatureRadioButton = radioButtonGroup.getButton( 'temperature' );
    Multilink.multilink(
      [ numberOfParticlesProperty, isContainerOpenProperty ],
      ( numberOfParticles, isContainerOpen ) => {
        temperatureRadioButton.enabledProperty.value = ( numberOfParticles !== 0 ) && !isContainerOpen;
      } );

    // Disable radio buttons for selections that are not possible with zero pressure.
    const pressureVRadioButton = radioButtonGroup.getButton( 'pressureV' );
    const pressureTRadioButton = radioButtonGroup.getButton( 'pressureT' );
    pressureProperty.link( pressure => {
      pressureVRadioButton.enabledProperty.value = ( pressure !== 0 );
      pressureTRadioButton.enabledProperty.value = ( pressure !== 0 );
    } );
  }
}

gasProperties.register( 'HoldConstantPanel', HoldConstantPanel );