// Copyright 2019-2024, University of Colorado Boulder

/**
 * TemperatureModel is a sub-model of IdealGasModel. It is responsible for the T (temperature) component of
 * the Ideal Gas Law (PV = NkT) and for the thermometer.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Range from '../../../../dot/js/Range.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import optionize from '../../../../phet-core/js/optionize.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import { TemperatureUnits, TemperatureUnitsValues } from './TemperatureUnits.js';

const DEFAULT_TEMPERATURE_KELVIN_RANGE = new Range( 0, 1000 ); // in K

// temperature used to compute the initial speed for particles, in K
const INITIAL_TEMPERATURE_RANGE = new RangeWithValue( 50, 1000, 300 );

type SelfOptions = {

  // Temperature range, in K.
  temperatureKelvinRange?: Range;

  // Determines whether Properties related to Injection Temperature will be instrumented.
  hasInjectionTemperatureFeature?: boolean;
};

type TemperatureModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class TemperatureModel {

  private readonly numberOfParticlesProperty: TReadOnlyProperty<number>;
  private readonly getAverageKineticEnergy: () => number;

  public readonly temperatureKelvinRange: Range;

  // Temperature in the container, in K. null when the container is empty.
  public readonly temperatureKelvinProperty: Property<number | null>;

  // Temperature in the container, in Celsius. null when the container is empty.
  public readonly temperatureCelsiusProperty: TReadOnlyProperty<number | null>;

  // Temperature units displayed by the thermometer.
  public readonly unitsProperty: StringUnionProperty<TemperatureUnits>;

  // Whether injection temperature can be set by the user.
  public readonly setInjectionTemperatureEnabledProperty: Property<boolean>;

  // Injection temperature set by the user, in K. Ignored if !setInjectionTemperatureEnabledProperty.value
  public readonly injectionTemperatureProperty: NumberProperty;

  public constructor( numberOfParticlesProperty: TReadOnlyProperty<number>,
                      getAverageKineticEnergy: () => number,
                      providedOptions: TemperatureModelOptions ) {

    const options = optionize<TemperatureModelOptions, SelfOptions>()( {

      // SelfOptions
      temperatureKelvinRange: DEFAULT_TEMPERATURE_KELVIN_RANGE,
      hasInjectionTemperatureFeature: false
    }, providedOptions );

    this.numberOfParticlesProperty = numberOfParticlesProperty;
    this.getAverageKineticEnergy = getAverageKineticEnergy;

    this.temperatureKelvinRange = options.temperatureKelvinRange;

    this.temperatureKelvinProperty = new Property<number | null>( null, {
      units: 'K',
      isValidValue: value => ( value === null || value >= 0 ),
      phetioValueType: NullableIO( NumberIO ),
      tandem: options.tandem.createTandem( 'temperatureKelvinProperty' ),
      phetioReadOnly: true, // value is derived from state of particle system
      phetioDocumentation: 'Temperature in K.'
    } );

    this.temperatureCelsiusProperty = new DerivedProperty( [ this.temperatureKelvinProperty ],
      temperatureKelvin => ( temperatureKelvin === null ) ? null : temperatureKelvin - 273.15, {
        units: '\u00B0C',
        isValidValue: value => ( value === null || value !== 0 ),
        phetioValueType: NullableIO( NumberIO ),
        tandem: options.tandem.createTandem( 'temperatureCelsiusProperty' ),
        phetioDocumentation: 'Temperature in degrees C.'
      } );

    this.unitsProperty = new StringUnionProperty<TemperatureUnits>( 'kelvin', {
      validValues: TemperatureUnitsValues,
      tandem: options.tandem.createTandem( 'unitsProperty' ),
      phetioDocumentation: 'Units displayed by the thermometer.'
    } );

    this.setInjectionTemperatureEnabledProperty = new BooleanProperty( false, {
      tandem: options.hasInjectionTemperatureFeature ?
              options.tandem.createTandem( 'setInjectionTemperatureEnabledProperty' ) : Tandem.OPT_OUT,
      phetioDocumentation: 'Determines whether the user can set the injection temperature.'
    } );

    this.injectionTemperatureProperty = new NumberProperty( INITIAL_TEMPERATURE_RANGE.defaultValue, {
      range: INITIAL_TEMPERATURE_RANGE,
      units: 'K',
      tandem: options.hasInjectionTemperatureFeature ?
              options.tandem.createTandem( 'injectionTemperatureProperty' ) : Tandem.OPT_OUT,
      phetioDocumentation: 'Injection temperature set by the user.'
    } );
  }

  public reset(): void {
    this.unitsProperty.reset();
    this.setInjectionTemperatureEnabledProperty.reset();
    this.injectionTemperatureProperty.reset();
  }

  /**
   * Updates the model to match the state of the system.
   */
  public update(): void {
    this.temperatureKelvinProperty.value = this.computeTemperature();
  }

  /**
   * Gets the temperature that will be used to compute initial velocity magnitude.
   */
  public getInitialTemperature(): number {

    let initialTemperature = null;

    if ( this.setInjectionTemperatureEnabledProperty.value ) {

      // User's setting
      initialTemperature = this.injectionTemperatureProperty.value;
    }
    else if ( this.temperatureKelvinProperty.value !== null ) {

      // Current temperature in the container
      initialTemperature = this.temperatureKelvinProperty.value;
    }
    else {

      // Default for empty container
      initialTemperature = INITIAL_TEMPERATURE_RANGE.defaultValue;
    }

    assert && assert( initialTemperature >= 0, `bad initialTemperature: ${initialTemperature}` );
    return initialTemperature;
  }

  /**
   * Computes the actual temperature, which is a measure of the kinetic energy of the particles in the container.
   * Returns actual temperature in K, null if the container is empty.
   */
  public computeTemperature(): number | null {
    let temperature = null;
    const n = this.numberOfParticlesProperty.value;
    if ( n > 0 ) {
      const averageKineticEnergy = this.getAverageKineticEnergy(); // AMU * pm^2 / ps^2
      const k = GasPropertiesConstants.BOLTZMANN; // (pm^2 * AMU)/(ps^2 * K)

      // T = (2/3)KE/k
      temperature = ( 2 / 3 ) * averageKineticEnergy / k; // K
    }
    return temperature;
  }
}

gasProperties.register( 'TemperatureModel', TemperatureModel );