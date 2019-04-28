// Copyright 2018-2019, University of Colorado Boulder

/**
 * Model for the thermometer
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );

  // constants
  const DEFAULT_RANGE = new Range( 0, 1000 );

  class Thermometer {

    /**
     * @param {Property.<number|null>} temperatureKelvinProperty - temperature in the container, in K
     * @param {Object} [options]
     */
    constructor( temperatureKelvinProperty, options ) {

      options = _.extend( {
        range: DEFAULT_RANGE
      }, options );

      // @public {Range} range of thermometer, in K. temperatureProperty is expected to exceed this.
      this.range = options.range;

      // @public temperature in the container, in K
      this.temperatureKelvinProperty = temperatureKelvinProperty;

      // @public {Property.<number|null>} temperature in the container, in Celsius.
      // Value is null when the container is empty.
      this.temperatureCelsiusProperty = new DerivedProperty( [ this.temperatureKelvinProperty ],
        temperatureKelvin => ( temperatureKelvin === null ) ? null : temperatureKelvin - 273.15, {
        units: '\u00B0C'
        } );

      // @public {Property.<Thermometer.Units>} temperature units displayed by the thermometer
      this.unitsProperty = new Property( Thermometer.Units.KELVIN, {
        isValidValue: value => Thermometer.Units.includes( value )
      } );
    }

    // @public
    reset() {
      this.unitsProperty.reset();
    }
  }

  // @public Choice of temperature units that the thermometer can display
  Thermometer.Units = new Enumeration( [ 'KELVIN', 'CELSIUS' ] );

  return gasProperties.register( 'Thermometer', Thermometer );
} );