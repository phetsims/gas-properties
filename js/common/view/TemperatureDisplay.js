// Copyright 2018-2019, University of Colorado Boulder

/**
 * Displays dynamic temperature values, with the ability to switch units via a combo box.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ComboBoxDisplay = require( 'SCENERY_PHET/ComboBoxDisplay' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Range = require( 'DOT/Range' );
  const Thermometer = require( 'GAS_PROPERTIES/common/model/Thermometer' );

  // strings
  const degreesCelsiusString = require( 'string!GAS_PROPERTIES/degreesCelsius' );
  const kelvinString = require( 'string!GAS_PROPERTIES/kelvin' );

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

      options = _.extend( {}, GasPropertiesConstants.COMBO_BOX_DISPLAY_OPTIONS, options );

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

  return gasProperties.register( 'TemperatureDisplay', TemperatureDisplay );
} );