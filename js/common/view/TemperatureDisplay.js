// Copyright 2018-2022, University of Colorado Boulder

/**
 * TemperatureDisplay displays the temperature value, with the ability to switch units via a combo box.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import ComboBoxDisplay from '../../../../scenery-phet/js/ComboBoxDisplay.js';
import { Node } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import gasPropertiesStrings from '../../gasPropertiesStrings.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';
import Thermometer from '../model/Thermometer.js';

// constants
const NUMBER_DISPLAY_RANGE = new Range( -99999, 99999 ); // determines how wide items in the ComboBoxDisplay will be

class TemperatureDisplay extends ComboBoxDisplay {

  /**
   * @param {Thermometer} thermometer
   * @param {Node} listParent - parent for the ComboBox list
   * @param {Object} [options]
   */
  constructor( thermometer, listParent, options ) {
    assert && assert( thermometer instanceof Thermometer, `invalid thermometer: ${thermometer}` );
    assert && assert( listParent instanceof Node, `invalid listParent: ${listParent}` );

    options = merge( {
      tandem: Tandem.REQUIRED
    }, GasPropertiesConstants.COMBO_BOX_DISPLAY_OPTIONS, options );

    const items = [
      {
        choice: Thermometer.Units.KELVIN,
        tandemName: `${Thermometer.Units.KELVIN.toString().toLowerCase()}Item`,
        numberProperty: thermometer.temperatureKelvinProperty,
        range: NUMBER_DISPLAY_RANGE,
        units: gasPropertiesStrings.kelvin
      },
      {
        choice: Thermometer.Units.CELSIUS,
        tandemName: `${Thermometer.Units.CELSIUS.toString().toLowerCase()}Item`,
        numberProperty: thermometer.temperatureCelsiusProperty,
        range: NUMBER_DISPLAY_RANGE,
        units: gasPropertiesStrings.degreesCelsius
      }
    ];

    super( thermometer.unitsProperty, items, listParent, options );
  }
}

gasProperties.register( 'TemperatureDisplay', TemperatureDisplay );
export default TemperatureDisplay;