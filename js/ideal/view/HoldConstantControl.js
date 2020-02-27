// Copyright 2018-2020, University of Colorado Boulder

/**
 * HoldConstantControl is the control for selecting which quantity should be held constant.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import AquaRadioButtonGroup from '../../../../sun/js/AquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GasPropertiesColorProfile from '../../common/GasPropertiesColorProfile.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import HoldConstant from '../../common/model/HoldConstant.js';
import gasPropertiesStrings from '../../gas-properties-strings.js';
import gasProperties from '../../gasProperties.js';

const holdConstantNothingString = gasPropertiesStrings.holdConstant.nothing;
const holdConstantPressureTString = gasPropertiesStrings.holdConstant.pressureT;
const holdConstantPressureVString = gasPropertiesStrings.holdConstant.pressureV;
const holdConstantTitleString = gasPropertiesStrings.holdConstant.title;
const holdConstantTemperatureString = gasPropertiesStrings.holdConstant.temperature;
const holdConstantVolumeString = gasPropertiesStrings.holdConstant.volume;

// constants
const TEXT_OPTIONS = {
  font: GasPropertiesConstants.CONTROL_FONT,
  fill: GasPropertiesColorProfile.textFillProperty,
  maxWidth: 175 // determined empirically
};
const SPACING = 12;

class HoldConstantControl extends VBox {

  /**
   * @param {EnumerationProperty} holdConstantProperty
   * @param {Property.<number>>} numberOfParticlesProperty
   * @param {NumberProperty} pressureProperty
   * @param {BooleanProperty} isContainerOpenProperty
   * @param {Object} [options]
   */
  constructor( holdConstantProperty, numberOfParticlesProperty, pressureProperty, isContainerOpenProperty, options ) {
    assert && assert( holdConstantProperty instanceof EnumerationProperty,
      `invalid holdConstantProperty: ${holdConstantProperty}` );
    assert && assert( numberOfParticlesProperty instanceof Property,
      `invalid numberOfParticlesProperty: ${numberOfParticlesProperty}` );
    assert && assert( pressureProperty instanceof NumberProperty,
      `invalid pressureProperty: ${pressureProperty}` );
    assert && assert( isContainerOpenProperty instanceof Property,
      `invalid isContainerOpenProperty: ${isContainerOpenProperty}` );

    options = merge( {

      // superclass options
      align: 'left',
      spacing: SPACING,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    const titleNode = new Text( holdConstantTitleString, {
      font: GasPropertiesConstants.TITLE_FONT,
      fill: GasPropertiesColorProfile.textFillProperty,
      maxWidth: 200, // determined empirically
      tandem: options.tandem.createTandem( 'titleNode' )
    } );

    const items = [
      {
        value: HoldConstant.NOTHING,
        node: new Text( holdConstantNothingString, TEXT_OPTIONS ),
        tandemName: 'nothingRadioButton'
      },
      {
        value: HoldConstant.VOLUME,
        node: new Text( holdConstantVolumeString, TEXT_OPTIONS ),
        tandemName: 'volumeRadioButton'
      },
      {
        value: HoldConstant.TEMPERATURE,
        node: new Text( holdConstantTemperatureString, TEXT_OPTIONS ),
        tandemName: 'temperatureRadioButton'
      },
      {
        value: HoldConstant.PRESSURE_V,
        node: new Text( holdConstantPressureVString, TEXT_OPTIONS ),
        tandemName: 'pressureVRadioButton'
      },
      {
        value: HoldConstant.PRESSURE_T,
        node: new Text( holdConstantPressureTString, TEXT_OPTIONS ),
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

    assert && assert( !options.children, 'HoldConstantControl sets children' );
    options = merge( {
      children: [ titleNode, radioButtonGroup ]
    }, options );

    super( options );

    // Disable "Temperature (T)" radio button for conditions that are not possible.
    const temperatureRadioButton = radioButtonGroup.getButton( HoldConstant.TEMPERATURE );
    Property.multilink(
      [ numberOfParticlesProperty, isContainerOpenProperty ],
      ( numberOfParticles, isContainerOpen ) => {
        temperatureRadioButton.enabledProperty.value = ( numberOfParticles !== 0 ) && !isContainerOpen;
      } );

    // Disable radio buttons for selections that are not possible with zero pressure.
    const pressureVRadioButton = radioButtonGroup.getButton( HoldConstant.PRESSURE_V );
    const pressureTRadioButton = radioButtonGroup.getButton( HoldConstant.PRESSURE_T );
    pressureProperty.link( pressure => {
      pressureVRadioButton.enabledProperty.value = ( pressure !== 0 );
      pressureTRadioButton.enabledProperty.value = ( pressure !== 0 );
    } );
  }
}

gasProperties.register( 'HoldConstantControl', HoldConstantControl );
export default HoldConstantControl;