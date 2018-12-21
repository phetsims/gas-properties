// Copyright 2018, University of Colorado Boulder

/**
 * ComboBox for choosing dynamic temperature values in specific units.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ComboDisplay = require( 'GAS_PROPERTIES/common/view/ComboDisplay' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const Range = require( 'DOT/Range' );
  const TemperatureUnitsEnum = require( 'GAS_PROPERTIES/common/model/TemperatureUnitsEnum' );

  // strings
  const celsiusString = require( 'string!GAS_PROPERTIES/celsius' );
  const kelvinString = require( 'string!GAS_PROPERTIES/kelvin' );

  // constants
  const NUMBER_DISPLAY_RANGE = new Range( -9999, 9999 ); // determines how wide items in the ComboDisplay will be

  class TemperatureComboDisplay extends ComboDisplay {

    /**
     * @param {Thermometer} thermometer
     * @param {Node} listParent - parent for the ComboBox list
     * @param {Object} [options]
     */
    constructor( thermometer, listParent, options ) {

      const items = [
        {
          choice: TemperatureUnitsEnum.KELVIN,
          numberProperty: thermometer.temperatureKelvinProperty,
          range: NUMBER_DISPLAY_RANGE,
          units: kelvinString
        },
        {
          choice: TemperatureUnitsEnum.CELSIUS,
          numberProperty: thermometer.temperatureCelsiusProperty,
          range: NUMBER_DISPLAY_RANGE,
          units: celsiusString
        }
      ];

      super( items, thermometer.unitsProperty, listParent, options );
    }
  }

  return gasProperties.register( 'TemperatureComboDisplay', TemperatureComboDisplay );
} );