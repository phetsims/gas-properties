// Copyright 2018-2024, University of Colorado Boulder

/**
 * HoldConstantPanel is the panel titled 'Hold Constant' that appears in the 'Ideal' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Text, TextOptions, VBox } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import gasProperties from '../../gasProperties.js';
import { HoldConstant } from '../../common/model/HoldConstant.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import AquaRadioButtonGroup, { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Tandem from '../../../../tandem/js/Tandem.js';

const SPACING = 12;
const TEXT_OPTIONS: TextOptions = {
  font: GasPropertiesConstants.CONTROL_FONT,
  fill: GasPropertiesColors.textFillProperty,
  maxWidth: 175 // determined empirically
};

export default class HoldConstantPanel extends Panel {

  public constructor( holdConstantProperty: StringUnionProperty<HoldConstant>,
                      numberOfParticlesProperty: TReadOnlyProperty<number>,
                      pressureProperty: TReadOnlyProperty<number>,
                      isContainerOpenProperty: TReadOnlyProperty<boolean>,
                      tandem: Tandem ) {

    const options = combineOptions<PanelOptions>( {}, GasPropertiesConstants.PANEL_OPTIONS, {
      isDisposable: false,
      xMargin: GasPropertiesConstants.PANEL_OPTIONS.xMargin,
      tandem: tandem
    } );

    const titleText = new Text( GasPropertiesStrings.holdConstant.titleStringProperty, {
      font: GasPropertiesConstants.TITLE_FONT,
      fill: GasPropertiesColors.textFillProperty,
      maxWidth: 200 // determined empirically
    } );

    const items: AquaRadioButtonGroupItem<HoldConstant>[] = [

      // Nothing
      {
        value: 'nothing',
        createNode: () => new Text( GasPropertiesStrings.holdConstant.nothingStringProperty, TEXT_OPTIONS ),
        tandemName: 'nothingRadioButton'
      },

      // Volume (V)
      {
        value: 'volume',
        createNode: () => new Text( GasPropertiesStrings.holdConstant.volumeStringProperty, TEXT_OPTIONS ),
        tandemName: 'volumeRadioButton'
      },

      // Temperature (T)
      {
        value: 'temperature',
        createNode: () => new Text( GasPropertiesStrings.holdConstant.temperatureStringProperty, TEXT_OPTIONS ),
        tandemName: 'temperatureRadioButton'
      },

      // Pressure (V)
      {
        value: 'pressureV',
        createNode: () => new Text( GasPropertiesStrings.holdConstant.pressureVStringProperty, TEXT_OPTIONS ),
        tandemName: 'pressureVRadioButton'
      },

      // Pressure (T)
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
      tandem: tandem.createTandem( 'radioButtonGroup' ),
      phetioVisiblePropertyInstrumented: false // Clients should hide the entire panel.
    } );

    const content = new VBox( {
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