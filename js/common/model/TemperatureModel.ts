// Copyright 2019-2025, University of Colorado Boulder

/**
 * TemperatureModel is a sub-model of IdealGasModel. It is responsible for the T (temperature) component of
 * the Ideal Gas Law (PV = NkT) and for the thermometer.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';
import { TemperatureUnits, TemperatureUnitsValues } from './TemperatureUnits.js';

const DEFAULT_TEMPERATURE_KELVIN_RANGE = new Range( 0, 1000 ); // in K

// Temperature (in K) used to compute the initial speed for particles when the container is empty and the user
// has not set a specific injection temperature.
const DEFAULT_INITIAL_TEMPERATURE = 300;

// Range of injectionTemperatureProperty.
const INJECTION_TEMPERATURE_RANGE = new Range( 50, 1000 );
assert && assert( INJECTION_TEMPERATURE_RANGE.contains( DEFAULT_INITIAL_TEMPERATURE ) );

type SelfOptions = {

  // Temperature range, in K.
  temperatureKelvinRange?: Range;

  // Determines whether Properties related to Injection Temperature will be instrumented.
  hasInjectionTemperatureFeature?: boolean;
};

type TemperatureModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class TemperatureModel extends PhetioObject {

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

  // Default temperature used to compute the speed of particles added to an empty container.
  // Private because this Property is not used elsewhere in the sim; it is provided for PhET-iO only.
  private readonly defaultInitialTemperatureProperty: NumberProperty;

  public constructor( numberOfParticlesProperty: TReadOnlyProperty<number>,
                      getAverageKineticEnergy: () => number,
                      providedOptions: TemperatureModelOptions ) {

    const options = optionize<TemperatureModelOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      temperatureKelvinRange: DEFAULT_TEMPERATURE_KELVIN_RANGE,
      hasInjectionTemperatureFeature: false,

      // PhetioObjectOptions
      isDisposable: false,
      phetioState: false,
      phetioFeatured: true
    }, providedOptions );

    assert && assert( options.temperatureKelvinRange.contains( DEFAULT_INITIAL_TEMPERATURE ) );
    assert && assert( options.temperatureKelvinRange.contains( INJECTION_TEMPERATURE_RANGE.min ) );
    assert && assert( options.temperatureKelvinRange.contains( INJECTION_TEMPERATURE_RANGE.max ) );

    super( options );

    this.numberOfParticlesProperty = numberOfParticlesProperty;
    this.getAverageKineticEnergy = getAverageKineticEnergy;

    this.temperatureKelvinRange = options.temperatureKelvinRange;

    this.temperatureKelvinProperty = new Property<number | null>( null, {
      units: 'K',
      isValidValue: value => ( value === null || value >= 0 ),
      phetioValueType: NullableIO( NumberIO ),
      tandem: options.tandem.createTandem( 'temperatureKelvinProperty' ),
      phetioReadOnly: true, // value is derived from state of particle system
      phetioFeatured: true,
      phetioDocumentation: 'Temperature in K.'
    } );

    this.temperatureCelsiusProperty = new DerivedProperty( [ this.temperatureKelvinProperty ],
      temperatureKelvin => ( temperatureKelvin === null ) ? null : temperatureKelvin - 273.15, {
        units: '\u00B0C',
        isValidValue: value => ( value === null || value !== 0 ),
        phetioValueType: NullableIO( NumberIO ),
        tandem: options.tandem.createTandem( 'temperatureCelsiusProperty' ),
        phetioFeatured: true,
        phetioDocumentation: 'Temperature in degrees C.'
      } );

    this.unitsProperty = new StringUnionProperty<TemperatureUnits>( 'kelvin', {
      validValues: TemperatureUnitsValues,
      tandem: options.tandem.createTandem( 'unitsProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Units displayed by the thermometer.'
    } );

    this.setInjectionTemperatureEnabledProperty = new BooleanProperty( false, {
      tandem: options.hasInjectionTemperatureFeature ?
              options.tandem.createTandem( 'setInjectionTemperatureEnabledProperty' ) : Tandem.OPT_OUT,
      phetioFeatured: true,
      phetioDocumentation: 'Determines whether the user can set the injection temperature.'
    } );

    this.injectionTemperatureProperty = new NumberProperty( DEFAULT_INITIAL_TEMPERATURE, {
      range: INJECTION_TEMPERATURE_RANGE,
      units: 'K',
      tandem: options.hasInjectionTemperatureFeature ?
              options.tandem.createTandem( 'injectionTemperatureProperty' ) : Tandem.OPT_OUT,
      phetioFeatured: true,
      phetioDocumentation: 'Injection temperature set by the user.'
    } );

    this.defaultInitialTemperatureProperty = new NumberProperty( DEFAULT_INITIAL_TEMPERATURE, {
      range: INJECTION_TEMPERATURE_RANGE,
      units: 'K',
      tandem: options.tandem.createTandem( 'defaultInitialTemperatureProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Default temperature used to compute the speed of particles added to an empty container.'
    } );
  }

  public reset(): void {
    this.unitsProperty.reset();
    this.setInjectionTemperatureEnabledProperty.reset();
    this.injectionTemperatureProperty.reset();
    // Do not reset this.defaultInitialTemperatureProperty, because it is provided for PhET-iO only.
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
      initialTemperature = this.defaultInitialTemperatureProperty.value;
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