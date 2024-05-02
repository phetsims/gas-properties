// Copyright 2019-2024, University of Colorado Boulder

/**
 * TemperatureModel is a sub-model of IdealGasModel. It is responsible for the T (temperature) component of
 * the Ideal Gas Law (PV = NkT) and for the thermometer.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Disposable from '../../../../axon/js/Disposable.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';
import Thermometer from './Thermometer.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import optionize from '../../../../phet-core/js/optionize.js';

// constants

// temperature used to compute the initial speed for particles, in K
const INITIAL_TEMPERATURE_RANGE = new RangeWithValue( 50, 1000, 300 );

type SelfOptions = {

  // Determines whether Properties related to Injection Temperature will be instrumented.
  hasInjectionTemperatureFeature?: boolean;
};

type TemperatureModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class TemperatureModel {

  private readonly numberOfParticlesProperty: TReadOnlyProperty<number>;
  private readonly getAverageKineticEnergy: () => number;

  // T, temperature in the container, in K, null when the container is empty
  public readonly temperatureProperty: Property<number | null>;

  // Whether injection temperature can be set by the user.
  public readonly setInjectionTemperatureEnabledProperty: Property<boolean>;

  // Injection temperature set by the user, in K. Ignored if !setInjectionTemperatureEnabledProperty.value
  public readonly injectionTemperatureProperty: NumberProperty;

  // thermometer that displays temperatureProperty with a choice of units
  public readonly thermometer: Thermometer;

  public constructor( numberOfParticlesProperty: TReadOnlyProperty<number>,
                      getAverageKineticEnergy: () => number,
                      providedOptions: TemperatureModelOptions ) {

    const options = optionize<TemperatureModelOptions, SelfOptions>()( {

      // SelfOptions
      hasInjectionTemperatureFeature: false
    }, providedOptions );

    this.numberOfParticlesProperty = numberOfParticlesProperty;
    this.getAverageKineticEnergy = getAverageKineticEnergy;

    this.temperatureProperty = new Property<number | null>( null, {
      units: 'K',
      isValidValue: value => ( value === null || value >= 0 ),
      phetioValueType: NullableIO( NumberIO ),
      tandem: options.tandem.createTandem( 'temperatureProperty' ),
      phetioReadOnly: true, // value is derived from state of particle system
      phetioDocumentation: 'Temperature in K.'
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

    this.thermometer = new Thermometer( this.temperatureProperty, {
      tandem: options.tandem.createTandem( 'thermometer' )
    } );
  }

  public dispose(): void {
    Disposable.assertNotDisposable();
  }

  public reset(): void {
    this.temperatureProperty.reset();
    this.setInjectionTemperatureEnabledProperty.reset();
    this.injectionTemperatureProperty.reset();
    this.thermometer.reset();
  }

  /**
   * Updates the model to match the state of the system.
   */
  public update(): void {
    this.temperatureProperty.value = this.computeTemperature();
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
    else if ( this.temperatureProperty.value !== null ) {

      // Current temperature in the container
      initialTemperature = this.temperatureProperty.value;
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