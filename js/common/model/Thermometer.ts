// Copyright 2018-2022, University of Colorado Boulder

/**
 * Thermometer is the model for the thermometer. It is responsible for determining what units will be used to present
 * the temperature, and for deriving pressure in those units.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import gasProperties from '../../gasProperties.js';
import { TemperatureUnits, TemperatureUnitsValues } from './TemperatureUnits.js';

// constants
const DEFAULT_RANGE = new Range( 0, 1000 ); // in K

type SelfOptions = {
  range?: Range;
};

type ThermometerOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class Thermometer {

  // range of thermometer display, in K. temperatureProperty is expected to exceed this.
  public readonly range: Range;

  // temperature in the container, in K. null when the container is empty.
  public readonly temperatureKelvinProperty: Property<number | null>;

  // temperature in the container, in Celsius. null when the container is empty.
  public readonly temperatureCelsiusProperty: TReadOnlyProperty<number | null>;

  // temperature units displayed by the thermometer
  public readonly unitsProperty: StringUnionProperty<TemperatureUnits>;

  public constructor( temperatureKelvinProperty: Property<number | null>, providedOptions: ThermometerOptions ) {

    const options = optionize<ThermometerOptions, SelfOptions>()( {

      // SelfOptions
      range: DEFAULT_RANGE
    }, providedOptions );

    this.range = options.range;

    this.temperatureKelvinProperty = temperatureKelvinProperty;

    this.temperatureCelsiusProperty = new DerivedProperty( [ this.temperatureKelvinProperty ],
      temperatureKelvin => ( temperatureKelvin === null ) ? null : temperatureKelvin - 273.15, {
        units: '\u00B0C',
        isValidValue: value => ( value === null || value !== 0 ),
        phetioValueType: NullableIO( NumberIO ),
        tandem: options.tandem.createTandem( 'temperatureCelsiusProperty' ),
        phetioDocumentation: 'temperature in degrees C'
      } );

    this.unitsProperty = new StringUnionProperty<TemperatureUnits>( 'kelvin', {
      validValues: TemperatureUnitsValues,
      tandem: options.tandem.createTandem( 'unitsProperty' ),
      phetioDocumentation: 'units displayed by the thermometer'
    } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  public reset(): void {
    this.unitsProperty.reset();
  }
}

gasProperties.register( 'Thermometer', Thermometer );