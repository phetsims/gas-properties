// Copyright 2018, University of Colorado Boulder

/**
 * Model for the thermometer
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const TemperatureUnitsEnum = require( 'GAS_PROPERTIES/common/model/TemperatureUnitsEnum' );

  // constants
  const DEFAULT_RANGE = new Range( 0, 1000 );

  class Thermometer {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = _.extend( {
        range: DEFAULT_RANGE
      }, options );

      // @public {Range} range of thermometer, in K. temperatureProperty is expected to exceed this.
      this.range = options.range;

      // @public {Property.<number|null>} the temperature in the container, in Kelvin.
      // Value is null when the container is empty.
      this.temperatureKelvinProperty = new Property( null, {
        isValidValue: value => ( value === null || typeof value === 'number' )
      } );

      // @public {Property.<number|null>} temperature in the container, in Celsius.
      // Value is null when the container is empty.
      this.temperatureCelsiusProperty = new DerivedProperty( [ this.temperatureKelvinProperty ],
        temperatureKelvin => ( temperatureKelvin === null ) ? null : temperatureKelvin - 273.15 );

      // @public {Property.<TemperatureUnitsEnum>} temperature units displayed by the thermometer
      this.unitsProperty = new Property( TemperatureUnitsEnum.KELVIN, {
        isValidValue: value => TemperatureUnitsEnum.includes( value )
      } );
    }

    // @public
    reset() {
      this.temperatureKelvinProperty.reset();
      this.unitsProperty.reset();
    }
  }

  return gasProperties.register( 'Thermometer', Thermometer );
} );