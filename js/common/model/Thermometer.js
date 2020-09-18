// Copyright 2018-2020, University of Colorado Boulder

/**
 * Thermometer is the model for the thermometer. It is responsible for determining what units will be used to present
 * the temperature, and for deriving pressure in those units.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import gasProperties from '../../gasProperties.js';

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
        phetioType: DerivedProperty.DerivedPropertyIO( NullableIO( NumberIO ) ),
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

gasProperties.register( 'Thermometer', Thermometer );
export default Thermometer;