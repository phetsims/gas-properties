// Copyright 2019-2022, University of Colorado Boulder

/**
 * HistogramsModel is a sub-model in the Energy screen, responsible for the Speed and Kinetic Energy histograms.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property, { PropertyOptions } from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import Particle from '../../common/model/Particle.js';
import ParticleSystem from '../../common/model/ParticleSystem.js';
import gasProperties from '../../gasProperties.js';

type SelfOptions = EmptySelfOptions;

type HistogramsModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class HistogramsModel {

  private readonly particleSystem: ParticleSystem;
  private readonly isPlayingProperty: TReadOnlyProperty<boolean>;
  private readonly samplePeriod: number;

  public readonly numberOfBins: number; // number of bins, common to both histograms
  public readonly speedBinWidth: number; // bin width for the Speed histogram, in pm/ps
  public readonly kineticEnergyBinWidth: number; // bin width for the Kinetic Energy histogram, in AMU * pm^2 / ps^2;

  // Speed bin counts
  public readonly heavySpeedBinCountsProperty: Property<number[]>;
  public readonly lightSpeedBinCountsProperty: Property<number[]>;
  public readonly allSpeedBinCountsProperty: Property<number[]>;

  // Kinetic Energy bin counts
  public readonly heavyKineticEnergyBinCountsProperty: Property<number[]>;
  public readonly lightKineticEnergyBinCountsProperty: Property<number[]>;
  public readonly allKineticEnergyBinCountsProperty: Property<number[]>;

  // the y-axis scale for all histograms
  public readonly yScaleProperty: Property<number>;

  // emits when the bin counts have been updated
  public readonly binCountsUpdatedEmitter: Emitter;

  // speed samples
  private readonly heavySpeedSamples: number[][]; // Speed samples for heavy particles
  private readonly lightSpeedSamples: number[][]; // Speed samples for light particles

  // Kinetic Energy samples
  private readonly heavyKineticEnergySamples: number[][]; // Kinetic Energy samples for heavy particles
  private readonly lightKineticEnergySamples: number[][]; // Kinetic Energy samples for light particles

  // for measuring sample period
  private dtAccumulator: number;
  private numberOfSamples: number;

  /**
   * @param particleSystem
   * @param isPlayingProperty
   * @param samplePeriod - data is averaged over this period, in ps
   * @param providedOptions
   */
  public constructor( particleSystem: ParticleSystem, isPlayingProperty: TReadOnlyProperty<boolean>,
                      samplePeriod: number, providedOptions: HistogramsModelOptions ) {
    assert && assert( samplePeriod > 0, `invalid samplePeriod: ${samplePeriod}` );

    const options = providedOptions;

    this.particleSystem = particleSystem;
    this.isPlayingProperty = isPlayingProperty;
    this.samplePeriod = samplePeriod;

    // values chosen in https://github.com/phetsims/gas-properties/issues/52
    this.numberOfBins = 19;
    this.speedBinWidth = 170;
    this.kineticEnergyBinWidth = 8E5;

    // Initialize histograms with 0 in all bins
    const emptyBins = [];
    for ( let i = this.numberOfBins - 1; i >= 0; i-- ) {
      emptyBins[ i ] = 0;
    }

    const binCountsPropertyOptions = {
      isValidValue: ( binCounts: number[] ) => ( binCounts.length === this.numberOfBins ),
      phetioValueType: ArrayIO( NumberIO ),
      phetioReadOnly: true // derived from the state of the particle system
    };

    this.heavySpeedBinCountsProperty = new Property( emptyBins,
      combineOptions<PropertyOptions<number[]>>( {}, binCountsPropertyOptions, {
        tandem: options.tandem.createTandem( 'heavySpeedBinCountsProperty' ),
        phetioDocumentation: 'Speed histogram bin counts for heavy particles'
      } ) );

    this.lightSpeedBinCountsProperty = new Property( emptyBins,
      combineOptions<PropertyOptions<number[]>>( {}, binCountsPropertyOptions, {
        tandem: options.tandem.createTandem( 'lightSpeedBinCountsProperty' ),
        phetioDocumentation: 'Speed histogram bin counts for light particles'
      } ) );

    this.allSpeedBinCountsProperty = new Property( emptyBins,
      combineOptions<PropertyOptions<number[]>>( {}, binCountsPropertyOptions, {
        tandem: options.tandem.createTandem( 'allSpeedBinCountsProperty' ),
        phetioDocumentation: 'Speed histogram bin counts for all particles'
      } ) );

    this.heavyKineticEnergyBinCountsProperty = new Property( emptyBins,
      combineOptions<PropertyOptions<number[]>>( {}, binCountsPropertyOptions, {
        tandem: options.tandem.createTandem( 'heavyKineticEnergyBinCountsProperty' ),
        phetioDocumentation: 'Kinetic Energy histogram bin counts for heavy particles'
      } ) );

    this.lightKineticEnergyBinCountsProperty = new Property( emptyBins,
      combineOptions<PropertyOptions<number[]>>( {}, binCountsPropertyOptions, {
        tandem: options.tandem.createTandem( 'lightKineticEnergyBinCountsProperty' ),
        phetioDocumentation: 'Kinetic Energy histogram bin counts for light particles'
      } ) );

    this.allKineticEnergyBinCountsProperty = new Property( emptyBins,
      combineOptions<PropertyOptions<number[]>>( {}, binCountsPropertyOptions, {
        tandem: options.tandem.createTandem( 'allKineticEnergyBinCountsProperty' ),
        phetioDocumentation: 'Kinetic Energy histogram bin counts for all particles'
      } ) );

    this.yScaleProperty = new NumberProperty( GasPropertiesConstants.HISTOGRAM_LINE_SPACING, {
      isValidValue: value => ( value >= GasPropertiesConstants.HISTOGRAM_LINE_SPACING ),
      tandem: options.tandem.createTandem( 'yScaleProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'scale of the y-axis for the Speed and Kinetic Energy histograms'
    } );

    this.binCountsUpdatedEmitter = new Emitter();

    this.heavySpeedSamples = [];
    this.lightSpeedSamples = [];

    this.heavyKineticEnergySamples = [];
    this.lightKineticEnergySamples = [];

    this.dtAccumulator = 0;
    this.numberOfSamples = 0;

    // Clear sample data when the play state changes, so that we can update immediately if manually stepping.
    isPlayingProperty.link( () => {
      this.clearSamples();
    } );

    // If the number of particles becomes zero, or changes while paused, update immediately.
    particleSystem.numberOfParticlesProperty.link( numberOfParticles => {
      if ( numberOfParticles === 0 || !isPlayingProperty.value ) {
        this.clearSamples();
        this.step( this.samplePeriod ); // using the sample period causes an immediate update
      }
    } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  public reset(): void {
    this.clearSamples();
  }

  /**
   * Clears the sample data.
   */
  private clearSamples(): void {

    this.dtAccumulator = 0;
    this.numberOfSamples = 0;

    // clear Speed samples
    this.heavySpeedSamples.length = 0;
    this.lightSpeedSamples.length = 0;

    // clear Kinetic Energy samples
    this.heavyKineticEnergySamples.length = 0;
    this.lightKineticEnergySamples.length = 0;
  }

  /**
   * Steps the histograms.
   * @param dt - time delta, in ps
   */
  public step( dt: number ): void {
    assert && assert( dt > 0, `invalid dt: ${dt}` );

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
   * Takes a data sample for histograms.
   */
  private sample(): void {
    assert && assert( !( this.numberOfSamples !== 0 && !this.isPlayingProperty.value ),
      'numberOfSamples should be 0 if called while the sim is paused' );

    // take a Speed sample
    this.heavySpeedSamples.push( getSpeedValues( this.particleSystem.heavyParticles ) );
    this.lightSpeedSamples.push( getSpeedValues( this.particleSystem.lightParticles ) );

    // take a Kinetic Energy sample
    this.heavyKineticEnergySamples.push( getKineticEnergyValues( this.particleSystem.heavyParticles ) );
    this.lightKineticEnergySamples.push( getKineticEnergyValues( this.particleSystem.lightParticles ) );

    this.numberOfSamples++;
  }

  /**
   * Updates the histograms using the current sample data.
   */
  private update(): void {
    assert && assert( !( this.numberOfSamples !== 1 && !this.isPlayingProperty.value ),
      'numberOfSamples should be 1 if called while the sim is paused' );

    // update Speed bin counts
    this.heavySpeedBinCountsProperty.value =
      samplesToBinCounts( this.heavySpeedSamples, this.numberOfBins, this.speedBinWidth );
    this.lightSpeedBinCountsProperty.value =
      samplesToBinCounts( this.lightSpeedSamples, this.numberOfBins, this.speedBinWidth );
    this.allSpeedBinCountsProperty.value =
      sumBinCounts( this.heavySpeedBinCountsProperty.value, this.lightSpeedBinCountsProperty.value );

    // update Kinetic Energy bin counts
    this.heavyKineticEnergyBinCountsProperty.value =
      samplesToBinCounts( this.heavyKineticEnergySamples, this.numberOfBins, this.kineticEnergyBinWidth );
    this.lightKineticEnergyBinCountsProperty.value =
      samplesToBinCounts( this.lightKineticEnergySamples, this.numberOfBins, this.kineticEnergyBinWidth );
    this.allKineticEnergyBinCountsProperty.value =
      sumBinCounts( this.heavyKineticEnergyBinCountsProperty.value, this.lightKineticEnergyBinCountsProperty.value );

    // Find the maximum bin count for all histograms. It's sufficient to look at the 'all' histograms.
    // This is used to determine the y-axis scale, which must be the same for both histograms.
    const maxBinCount = Math.max(
      getMaxBinCount( this.allSpeedBinCountsProperty.value ),
      getMaxBinCount( this.allKineticEnergyBinCountsProperty.value ) );

    // Adjust the y-axis scale to accommodate the maximum bin count.
    // Increase the y scale a bit so that there's always a little space above maxBinCount.
    // The minimum scale is determined by the spacing between horizontal lines in the histogram view.
    // We don't want to the scale to be less than one interval of the horizontal lines, so that the
    // y-axis doesn't scale for small numbers of particles.
    this.yScaleProperty.value = Math.max( 1.05 * maxBinCount, GasPropertiesConstants.HISTOGRAM_LINE_SPACING );

    // Notify listeners that the bin counts have been updated.
    this.binCountsUpdatedEmitter.emit();

    // Clear sample data in preparation for the next sample period.
    this.clearSamples();
  }
}

/**
 * Gets the maximum in a set of bin counts, zero if the array is empty.
 */
function getMaxBinCount( binCounts: number[] ): number {
  let maxBinCount = 0;
  if ( binCounts.length > 0 ) {
    maxBinCount = _.max( binCounts )!;
  }
  return maxBinCount;
}

/**
 * Gets the speed values for a set of particles, in pm/ps.
 */
function getSpeedValues( particles: Particle[] ): number[] {
  const values = [];
  for ( let i = particles.length - 1; i >= 0; i-- ) {
    values.push( particles[ i ].velocity.magnitude );
  }
  return values;
}

/**
 * Gets the kinetic energy values for a set of particles, in in AMU * pm^2 / ps^2.
 */
function getKineticEnergyValues( particles: Particle[] ): number[] {
  const values = [];
  for ( let i = particles.length - 1; i >= 0; i-- ) {
    values.push( particles[ i ].getKineticEnergy() );
  }
  return values;
}

/**
 * Converts a collection of samples to bin counts.
 */
function samplesToBinCounts( sampleArrays: number[][], numberOfBins: number, binWidth: number ): number[] {
  assert && assert( numberOfBins > 0, `invalid numberOfBins: ${numberOfBins}` );
  assert && assert( binWidth > 0, `invalid binWidth: ${binWidth}` );

  // Initialize the bins with 0 counts
  const binCounts = [];
  for ( let i = 0; i < numberOfBins; i++ ) {
    binCounts[ i ] = 0;
  }

  // Bin the sample data, for total binCounts
  for ( let i = sampleArrays.length - 1; i >= 0; i-- ) {
    const values = sampleArrays[ i ];
    for ( let j = values.length - 1; j >= 0; j-- ) {
      const index = Math.floor( values[ j ] / binWidth ); // bin range is [min,max)
      if ( index >= 0 && index < binCounts.length ) {
        binCounts[ index ]++;
      }
    }
  }

  // Average the bin counts
  for ( let i = binCounts.length - 1; i >= 0; i-- ) {
    assert && assert( typeof binCounts[ i ] === 'number' && binCounts[ i ] >= 0,
      `invalid binCount: ${binCounts[ i ]}` );
    binCounts[ i ] = binCounts[ i ] / sampleArrays.length;
  }

  assert && assert( binCounts.length === numberOfBins, `unexpected number of binCounts: ${binCounts.length}` );
  return binCounts;
}

/**
 * Sums the heavy and light bin counts to produce the bin counts for all particles.
 */
function sumBinCounts( heavyBinCounts: number[], lightBinCounts: number[] ): number[] {
  assert && assert( heavyBinCounts.length === lightBinCounts.length, 'lengths should be the same' );

  const sumBinCounts = [];
  for ( let i = heavyBinCounts.length - 1; i >= 0; i-- ) {
    sumBinCounts[ i ] = heavyBinCounts[ i ] + lightBinCounts[ i ];
  }
  return sumBinCounts;
}

gasProperties.register( 'HistogramsModel', HistogramsModel );