// Copyright 2019-2025, University of Colorado Boulder

/**
 * AverageSpeedModel is a sub-model in the Energy screen, responsible for data that is displayed in the
 * Average Speed accordion box.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property, { PropertyOptions } from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import IdealGasLawParticleSystem from '../../common/model/IdealGasLawParticleSystem.js';
import Particle from '../../common/model/Particle.js';
import gasProperties from '../../gasProperties.js';

const AVERAGE_SPEED_PROPERTY_OPTIONS: PropertyOptions<number | null> = {
  units: 'pm/ps',
  isValidValue: averageSpeed => ( averageSpeed === null || averageSpeed >= 0 ),
  phetioValueType: NullableIO( NumberIO ),
  phetioReadOnly: true // derived from the state of the particle system
};

type SelfOptions = EmptySelfOptions;

type AverageSpeedModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

// This should match STATE_SCHEMA, but with JavaScript types.
type AverageSpeedModelStateObject = {
  dtAccumulator: number;
  numberOfSamples: number;
  heavyAverageSpeedSum: number;
  lightAverageSpeedSum: number;
};

// This should match AverageSpeedModelStateObject, but with IOTypes.
const STATE_SCHEMA = {
  dtAccumulator: NumberIO,
  numberOfSamples: NumberIO,
  heavyAverageSpeedSum: NumberIO,
  lightAverageSpeedSum: NumberIO
};

export default class AverageSpeedModel extends PhetioObject {

  private readonly particleSystem: IdealGasLawParticleSystem;
  private readonly isPlayingProperty: TReadOnlyProperty<boolean>;
  private readonly samplePeriod: number;

  // Average speed of particle species in the container, in pm/ps. null when the container is empty
  public readonly heavyAverageSpeedProperty: Property<number | null>;
  public readonly lightAverageSpeedProperty: Property<number | null>;

  // Used internally to smooth the average speed computation.
  private dtAccumulator: number; // accumulated dts during the sample period
  private numberOfSamples: number; // number of samples taken during the sample period
  private heavyAverageSpeedSum: number; // sum of samples for heavy particles
  private lightAverageSpeedSum: number; // sum of samples for light particles

  /**
   * @param particleSystem
   * @param isPlayingProperty
   * @param samplePeriod - data is averaged over this period, in ps
   * @param providedOptions
   */
  public constructor( particleSystem: IdealGasLawParticleSystem, isPlayingProperty: TReadOnlyProperty<boolean>,
                      samplePeriod: number, providedOptions: AverageSpeedModelOptions ) {
    assert && assert( samplePeriod > 0, `invalid samplePeriod: ${samplePeriod}` );

    const options = optionize<AverageSpeedModelOptions, SelfOptions, PhetioObjectOptions>()( {

      // PhetioObjectOptions
      isDisposable: false,
      phetioType: AverageSpeedModel.AverageSpeedModelIO
    }, providedOptions );

    super( options );

    this.particleSystem = particleSystem;
    this.isPlayingProperty = isPlayingProperty;
    this.samplePeriod = samplePeriod;

    this.heavyAverageSpeedProperty = new Property<number | null>( null,
      combineOptions<PropertyOptions<number | null>>( {}, AVERAGE_SPEED_PROPERTY_OPTIONS, {
        tandem: options.tandem.createTandem( 'heavyAverageSpeedProperty' ),
        phetioReadOnly: true,
        phetioFeatured: true,
        phetioDocumentation: 'Average speed of heavy particles in the container (time averaged).'
      } ) );

    this.lightAverageSpeedProperty = new Property<number | null>( null,
      combineOptions<PropertyOptions<number | null>>( {}, AVERAGE_SPEED_PROPERTY_OPTIONS, {
        tandem: options.tandem.createTandem( 'lightAverageSpeedProperty' ),
        phetioReadOnly: true,
        phetioFeatured: true,
        phetioDocumentation: 'Average speed of light particles in the container (time averaged).'
      } ) );

    this.dtAccumulator = 0;
    this.numberOfSamples = 0;
    this.heavyAverageSpeedSum = 0;
    this.lightAverageSpeedSum = 0;

    // Reset sample data when the play state changes, so that we can update immediately if manually stepping.
    isPlayingProperty.link( () => {
      this.clearSamples();
    } );

    // If the number of particles changes while paused, sample the current state and update immediately.
    particleSystem.numberOfParticlesProperty.link( numberOfParticles => {
      if ( numberOfParticles === 0 || !isPlayingProperty.value ) {
        this.step( this.samplePeriod ); // using the sample period causes an immediate update
      }
    } );
  }

  public reset(): void {
    this.heavyAverageSpeedProperty.reset();
    this.lightAverageSpeedProperty.reset();
    this.clearSamples();
  }

  /**
   * Clears the sample data.
   */
  private clearSamples(): void {
    this.dtAccumulator = 0;
    this.numberOfSamples = 0;
    this.heavyAverageSpeedSum = 0;
    this.lightAverageSpeedSum = 0;
  }

  /**
   * Computes the average speed for each particle type, smoothed over an interval.
   * @param dt - time delta, in ps
   */
  public step( dt: number ): void {

    // Accumulate dt
    this.dtAccumulator += dt;

    // Takes data samples
    this.sample();

    // Update now if we've reached the end of the sample period, or if we're manually stepping
    if ( this.dtAccumulator >= this.samplePeriod || !this.isPlayingProperty.value ) {
      this.update();
    }
  }

  /**
   * Takes a data sample.
   */
  private sample(): void {
    assert && assert( !( this.numberOfSamples !== 0 && !this.isPlayingProperty.value ),
      'numberOfSamples should be 0 if called while the sim is paused' );

    this.heavyAverageSpeedSum += getAverageSpeed( this.particleSystem.heavyParticles );
    this.lightAverageSpeedSum += getAverageSpeed( this.particleSystem.lightParticles );
    this.numberOfSamples++;
  }

  /**
   * Updates Properties using the current sample data.
   */
  private update(): void {
    assert && assert( !( this.numberOfSamples !== 1 && !this.isPlayingProperty.value ),
      'numberOfSamples should be 1 if called while the sim is paused' );

    // heavy particles
    if ( this.particleSystem.heavyParticles.length === 0 ) {
      this.heavyAverageSpeedProperty.value = null;
    }
    else {
      this.heavyAverageSpeedProperty.value = this.heavyAverageSpeedSum / this.numberOfSamples;
    }

    // light particles
    if ( this.particleSystem.lightParticles.length === 0 ) {
      this.lightAverageSpeedProperty.value = null;
    }
    else {
      this.lightAverageSpeedProperty.value = this.lightAverageSpeedSum / this.numberOfSamples;
    }

    // Clear sample data in preparation for the next sample period.
    this.clearSamples();
  }

  /**
   * AverageSpeedModelIO handles serialization of data that supports derivation of average speed.
   * It implements reference-type serialization, as described in
   * https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization.
   */
  private static readonly AverageSpeedModelIO = new IOType<AverageSpeedModel, AverageSpeedModelStateObject>( 'AverageSpeedModelIO', {
    valueType: AverageSpeedModel,
    stateSchema: STATE_SCHEMA,
    documentation: 'PhET-iO Type that supports sampling of the Average Speed of the particle system. ' +
                   'All fields in this type are for internal use only.'
    // toStateObject: Use the default, which is derived from stateSchema.
    // applyState: Use the default, which is derived from stateSchema.
  } );
}

/**
 * Gets the average speed for a set of particles, in pm/ps. Returns 0 if there are no particles
 */
function getAverageSpeed( particles: Particle[] ): number {
  let averageSpeed = 0;
  if ( particles.length > 0 ) {
    let totalSpeed = 0;
    for ( let i = particles.length - 1; i >= 0; i-- ) {
      totalSpeed += particles[ i ].getSpeed();
    }
    averageSpeed = totalSpeed / particles.length;
  }
  return averageSpeed;
}

gasProperties.register( 'AverageSpeedModel', AverageSpeedModel );