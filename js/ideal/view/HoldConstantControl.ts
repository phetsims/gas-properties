// Copyright 2018-2022, University of Colorado Boulder

/**
 * HoldConstantControl is the control for selecting which quantity should be held constant.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Text, TextOptions, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import AquaRadioButton from '../../../../sun/js/AquaRadioButton.js';
import AquaRadioButtonGroup, { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import { HoldConstant } from '../../common/model/HoldConstant.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';

// constants
const TEXT_OPTIONS: TextOptions = {
  font: GasPropertiesConstants.CONTROL_FONT,
  fill: GasPropertiesColors.textFillProperty,
  maxWidth: 175 // determined empirically
};
const SPACING = 12;

type SelfOptions = EmptySelfOptions;

type HoldConstantControlOptions = SelfOptions & PickOptional<VBoxOptions, 'maxWidth'> & PickRequired<VBoxOptions, 'tandem'>;

export default class HoldConstantControl extends VBox {

  public constructor( holdConstantProperty: StringUnionProperty<HoldConstant>,
                      numberOfParticlesProperty: TReadOnlyProperty<number>,
                      pressureProperty: TReadOnlyProperty<number>,
                      isContainerOpenProperty: TReadOnlyProperty<boolean>,
                      providedOptions: HoldConstantControlOptions ) {

    const options = optionize<HoldConstantControlOptions, SelfOptions, VBoxOptions>()( {

      // VBoxOptions
      align: 'left',
      spacing: SPACING
    }, providedOptions );

    const titleText = new Text( GasPropertiesStrings.holdConstant.titleStringProperty, {
      font: GasPropertiesConstants.TITLE_FONT,
      fill: GasPropertiesColors.textFillProperty,
      maxWidth: 200, // determined empirically
      tandem: options.tandem.createTandem( 'titleText' )
    } );

    const items: AquaRadioButtonGroupItem<HoldConstant>[] = [
      {
        value: 'nothing',
        createNode: ( tandem: Tandem ) => new Text( GasPropertiesStrings.holdConstant.nothingStringProperty, TEXT_OPTIONS ),
        tandemName: `nothing${AquaRadioButton.TANDEM_NAME_SUFFIX}`
      },
      {
        value: 'volume',
        createNode: ( tandem: Tandem ) => new Text( GasPropertiesStrings.holdConstant.volumeStringProperty, TEXT_OPTIONS ),
        tandemName: `volume${AquaRadioButton.TANDEM_NAME_SUFFIX}`
      },
      {
        value: 'temperature',
        createNode: ( tandem: Tandem ) => new Text( GasPropertiesStrings.holdConstant.temperatureStringProperty, TEXT_OPTIONS ),
        tandemName: `temperature${AquaRadioButton.TANDEM_NAME_SUFFIX}`
      },
      {
        value: 'pressureV',
        createNode: ( tandem: Tandem ) => new Text( GasPropertiesStrings.holdConstant.pressureVStringProperty, TEXT_OPTIONS ),
        tandemName: `pressureV${AquaRadioButton.TANDEM_NAME_SUFFIX}`
      },
      {
        value: 'pressureT',
        createNode: ( tandem: Tandem ) => new Text( GasPropertiesStrings.holdConstant.pressureTStringProperty, TEXT_OPTIONS ),
        tandemName: `pressureT${AquaRadioButton.TANDEM_NAME_SUFFIX}`
      }
    ];

    const radioButtonGroup = new AquaRadioButtonGroup( holdConstantProperty, items, {
      radioButtonOptions: GasPropertiesConstants.AQUA_RADIO_BUTTON_OPTIONS,
      orientation: 'vertical',
      align: 'left',
      spacing: SPACING,
      tandem: options.tandem.createTandem( 'radioButtonGroup' )
    } );

    options.children = [ titleText, radioButtonGroup ];

    super( options );

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

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

gasProperties.register( 'HoldConstantControl', HoldConstantControl );