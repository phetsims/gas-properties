// Copyright 2018-2022, University of Colorado Boulder

/**
 * HoldConstantControl is the control for selecting which quantity should be held constant.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationDeprecatedProperty from '../../../../axon/js/EnumerationDeprecatedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import AquaRadioButtonGroup from '../../../../sun/js/AquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import HoldConstant from '../../common/model/HoldConstant.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';

// constants
const TEXT_OPTIONS = {
  font: GasPropertiesConstants.CONTROL_FONT,
  fill: GasPropertiesColors.textFillProperty,
  maxWidth: 175 // determined empirically
};
const SPACING = 12;

class HoldConstantControl extends VBox {

  /**
   * @param {EnumerationDeprecatedProperty} holdConstantProperty
   * @param {ReadOnlyProperty.<number>>} numberOfParticlesProperty
   * @param {NumberProperty} pressureProperty
   * @param {ReadOnlyProperty.<boolean>} isContainerOpenProperty
   * @param {Object} [options]
   */
  constructor( holdConstantProperty, numberOfParticlesProperty, pressureProperty, isContainerOpenProperty, options ) {
    assert && assert( holdConstantProperty instanceof EnumerationDeprecatedProperty,
      `invalid holdConstantProperty: ${holdConstantProperty}` );
    assert && assert( numberOfParticlesProperty instanceof ReadOnlyProperty,
      `invalid numberOfParticlesProperty: ${numberOfParticlesProperty}` );
    assert && assert( pressureProperty instanceof NumberProperty,
      `invalid pressureProperty: ${pressureProperty}` );
    assert && assert( isContainerOpenProperty instanceof ReadOnlyProperty,
      `invalid isContainerOpenProperty: ${isContainerOpenProperty}` );

    options = merge( {

      // superclass options
      align: 'left',
      spacing: SPACING,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    const titleText = new Text( GasPropertiesStrings.holdConstant.titleStringProperty, {
      font: GasPropertiesConstants.TITLE_FONT,
      fill: GasPropertiesColors.textFillProperty,
      maxWidth: 200, // determined empirically
      tandem: options.tandem.createTandem( 'titleText' )
    } );

    const items = [
      {
        value: HoldConstant.NOTHING,
        createNode: tandem => new Text( GasPropertiesStrings.holdConstant.nothingStringProperty, TEXT_OPTIONS ),
        tandemName: 'nothingRadioButton'
      },
      {
        value: HoldConstant.VOLUME,
        createNode: tandem => new Text( GasPropertiesStrings.holdConstant.volumeStringProperty, TEXT_OPTIONS ),
        tandemName: 'volumeRadioButton'
      },
      {
        value: HoldConstant.TEMPERATURE,
        createNode: tandem => new Text( GasPropertiesStrings.holdConstant.temperatureStringProperty, TEXT_OPTIONS ),
        tandemName: 'temperatureRadioButton'
      },
      {
        value: HoldConstant.PRESSURE_V,
        createNode: tandem => new Text( GasPropertiesStrings.holdConstant.pressureVStringProperty, TEXT_OPTIONS ),
        tandemName: 'pressureVRadioButton'
      },
      {
        value: HoldConstant.PRESSURE_T,
        createNode: tandem => new Text( GasPropertiesStrings.holdConstant.pressureTStringProperty, TEXT_OPTIONS ),
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
      children: [ titleText, radioButtonGroup ]
    }, options );

    super( options );

    // Disable "Temperature (T)" radio button for conditions that are not possible.
    const temperatureRadioButton = radioButtonGroup.getButton( HoldConstant.TEMPERATURE );
    Multilink.multilink(
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