// Copyright 2018-2020, University of Colorado Boulder

/**
 * TemperatureDisplay displays the temperature value, with the ability to switch units via a combo box.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import ComboBoxDisplay from '../../../../scenery-phet/js/ComboBoxDisplay.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasPropertiesStrings from '../../gasPropertiesStrings.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';
import Thermometer from '../model/Thermometer.js';

const degreesCelsiusString = gasPropertiesStrings.degreesCelsius;
const kelvinString = gasPropertiesStrings.kelvin;

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
        numberProperty: thermometer.temperatureKelvinProperty,
        range: NUMBER_DISPLAY_RANGE,
        units: kelvinString
      },
      {
        choice: Thermometer.Units.CELSIUS,
        numberProperty: thermometer.temperatureCelsiusProperty,
        range: NUMBER_DISPLAY_RANGE,
        units: degreesCelsiusString
      }
    ];

    super( items, thermometer.unitsProperty, listParent, options );
  }
}

gasProperties.register( 'TemperatureDisplay', TemperatureDisplay );
export default TemperatureDisplay;