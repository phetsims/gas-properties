// Copyright 2018-2019, University of Colorado Boulder

/**
 * Thermometer is the model for the thermometer. It is responsible for determining what units will be used to present
 * the temperature, and for deriving pressure in those units.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DerivedPropertyIO = require( 'AXON/DerivedPropertyIO' );
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const merge = require( 'PHET_CORE/merge' );
  const NullableIO = require( 'TANDEM/types/NullableIO' );
  const NumberIO = require( 'TANDEM/types/NumberIO' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Tandem = require( 'TANDEM/Tandem' );

  // constants
  const DEFAULT_RANGE = new Range( 0, 1000 ); // in K

  class Thermometer {

    /**
     * @param {Property.<number|null>} temperatureKelvinProperty - temperature in the container, in K
     * @param {Object} [options]
     */
    constructor( temperatureKelvinProperty, options ) {
      assert && assert( temperatureKelvinProperty instanceof Property,
        `invalid temperatureKelvinProperty: ${temperatureKelvinProperty}` );

      options = merge( {
        range: DEFAULT_RANGE,

        // phet-io
        tandem: Tandem.REQUIRED
      }, options );

      // @public {Range} range of thermometer display, in K. temperatureProperty is expected to exceed this.
      this.range = options.range;

      // @public temperature in the container, in K
      // Value is null when the container is empty.
      this.temperatureKelvinProperty = temperatureKelvinProperty;

      // @public {Property.<number|null>} temperature in the container, in Celsius.
      // Value is null when the container is empty.
      this.temperatureCelsiusProperty = new DerivedProperty( [ this.temperatureKelvinProperty ],
        temperatureKelvin => ( temperatureKelvin === null ) ? null : temperatureKelvin - 273.15, {
          units: '\u00B0C',
          isValidValue: value => ( value === null || ( typeof value === 'number' && value !== 0 ) ),
          phetioType: DerivedPropertyIO( NullableIO( NumberIO ) ),
          tandem: options.tandem.createTandem( 'temperatureCelsiusProperty' ),
          phetioDocumentation: 'temperature in degrees C'
        } );

      // @public temperature units displayed by the thermometer
      this.unitsProperty = new EnumerationProperty( Thermometer.Units, Thermometer.Units.KELVIN, {
        tandem: options.tandem.createTandem( 'unitsProperty' ),
        phetioDocumentation: 'units displayed by the thermometer'
      } );
    }

    /**
     * Resets the thermometer.
     * @public
     */
    reset() {
      this.unitsProperty.reset();
    }
  }

  // @public Choice of temperature units that the thermometer can display
  Thermometer.Units = Enumeration.byKeys( [ 'KELVIN', 'CELSIUS' ] );

  return gasProperties.register( 'Thermometer', Thermometer );
} );