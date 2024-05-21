// Copyright 2019-2024, University of Colorado Boulder

/**
 * HistogramsModel is a sub-model in the Energy screen, responsible for the Speed and Kinetic Energy histograms.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property, { PropertyOptions } from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import Particle from '../../common/model/Particle.js';
import IdealGasLawParticleSystem from '../../common/model/IdealGasLawParticleSystem.js';
import gasProperties from '../../gasProperties.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import ReferenceArrayIO from '../../../../tandem/js/types/ReferenceArrayIO.js';

// Describes the properties of the histograms at a specific zoom level.
type ZoomLevel = {
  yMax: number; // maximum of the y-axis range
  majorGridLineSpacing: number; // spacing of major grid lines
  minorGridLineSpacing: number | null; // spacing of minor grid lines, null means no minor grid lines
};

type SelfOptions = EmptySelfOptions;

type HistogramsModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

// This should match STATE_SCHEMA, but with JavaScript types.
type HistogramsModelStateObject = {
  dtAccumulator: number;
  numberOfSamples: number;
  heavySpeedCumulativeBinCounts: number[];
  lightSpeedCumulativeBinCounts: number[];
  heavyKineticEnergyCumulativeBinCounts: number[];
  lightKineticEnergyCumulativeBinCounts: number[];
};

// This should match HistogramsModelStateObject, but with IOTypes.
const STATE_SCHEMA = {
  dtAccumulator: NumberIO,
  numberOfSamples: NumberIO,
  heavySpeedCumulativeBinCounts: ReferenceArrayIO( NumberIO ),
  lightSpeedCumulativeBinCounts: ReferenceArrayIO( NumberIO ),
  heavyKineticEnergyCumulativeBinCounts: ReferenceArrayIO( NumberIO ),
  lightKineticEnergyCumulativeBinCounts: ReferenceArrayIO( NumberIO )
};

export default class HistogramsModel extends PhetioObject {

  private readonly particleSystem: IdealGasLawParticleSystem;
  private readonly isPlayingProperty: TReadOnlyProperty<boolean>;
  private readonly samplePeriod: number;

  public readonly numberOfBins: number; // number of bins, common to both histograms
  public readonly speedBinWidth: number; // bin width for the Speed histogram, in pm/ps
  public readonly kineticEnergyBinWidth: number; // bin width for the Kinetic Energy histogram, in AMU * pm^2 / ps^2;

  // Cumulative bin counts for Speed over samplePeriod, serialized by HistogramsModelIO.
  private readonly heavySpeedCumulativeBinCounts: number[];
  private readonly lightSpeedCumulativeBinCounts: number[];

  // Cumulative bin counts for Kinetic Energy over samplePeriod, serialized by HistogramsModelIO.
  private readonly heavyKineticEnergyCumulativeBinCounts: number[];
  private readonly lightKineticEnergyCumulativeBinCounts: number[];

  // Averaged bin counts for Speed, in pm/ps
  public readonly heavySpeedBinCountsProperty: Property<number[]>;
  public readonly lightSpeedBinCountsProperty: Property<number[]>;
  public readonly totalSpeedBinCountsProperty: Property<number[]>;

  // Averaged bin counts for Kinetic Energy, in AMU * pm^2 / ps^2
  public readonly heavyKineticEnergyBinCountsProperty: Property<number[]>;
  public readonly lightKineticEnergyBinCountsProperty: Property<number[]>;
  public readonly totalKineticEnergyBinCountsProperty: Property<number[]>;

  // Index into ZOOM_LEVELS, shared by all histograms.
  public readonly zoomLevelIndexProperty: NumberProperty;

  // emits when the averaged bin counts have been updated
  public readonly binCountsUpdatedEmitter: Emitter;

  // The amount of time that has elapsed in the current sample period.
  private dtAccumulator: number;

  // The number of samples that have been taken in the current sample period.
  private numberOfSamples: number;

  // Describes each of the zoom levels, ordered from largest to smallest yMax value. zoomLevelIndexProperty provides
  // the index into this array. This is a brute force specification that contains some duplication. But it's easier
  // to specify and change than an algorithmic description.
  public static readonly ZOOM_LEVELS: ZoomLevel[] = [
    { yMax: 2000, majorGridLineSpacing: 500, minorGridLineSpacing: 100 },
    { yMax: 1500, majorGridLineSpacing: 500, minorGridLineSpacing: 100 },
    { yMax: 1000, majorGridLineSpacing: 500, minorGridLineSpacing: 100 },
    { yMax: 500, majorGridLineSpacing: 100, minorGridLineSpacing: 50 },
    { yMax: 200, majorGridLineSpacing: 50, minorGridLineSpacing: 10 },
    { yMax: 100, majorGridLineSpacing: 50, minorGridLineSpacing: 10 },
    { yMax: 50, majorGridLineSpacing: 50, minorGridLineSpacing: 10 }
  ];

  /**
   * @param particleSystem
   * @param isPlayingProperty
   * @param samplePeriod - data is averaged over this period, in ps
   * @param providedOptions
   */
  public constructor( particleSystem: IdealGasLawParticleSystem, isPlayingProperty: TReadOnlyProperty<boolean>,
                      samplePeriod: number, providedOptions: HistogramsModelOptions ) {
    assert && assert( samplePeriod > 0, `invalid samplePeriod: ${samplePeriod}` );

    const options = optionize<HistogramsModelOptions, SelfOptions, PhetioObjectOptions>()( {
      
      // PhetioObjectOptions
      isDisposable: false,
      phetioType: HistogramsModel.HistogramsModelIO
    }, providedOptions );
    
    super( options );

    this.particleSystem = particleSystem;
    this.isPlayingProperty = isPlayingProperty;
    this.samplePeriod = samplePeriod;

    // values chosen in https://github.com/phetsims/gas-properties/issues/52
    this.numberOfBins = 19;
    this.speedBinWidth = 170;
    this.kineticEnergyBinWidth = 8E5;

    // Initialize all cumulative bin counts to zero.
    this.heavySpeedCumulativeBinCounts = new Array( this.numberOfBins ).fill( 0 );
    this.lightSpeedCumulativeBinCounts = new Array( this.numberOfBins ).fill( 0 );
    this.heavyKineticEnergyCumulativeBinCounts = new Array( this.numberOfBins ).fill( 0 );
    this.lightKineticEnergyCumulativeBinCounts = new Array( this.numberOfBins ).fill( 0 );

    // Initialize bin count Properties with 0 in all bins
    const emptyBins = new Array( this.numberOfBins ).fill( 0 );

    const binCountsPropertyOptions = {
      isValidValue: ( binCounts: number[] ) => ( binCounts.length === this.numberOfBins ),
      phetioValueType: ArrayIO( NumberIO ),
      phetioReadOnly: true // derived from the state of the particle system
    };

    const speedTandem = options.tandem.createTandem( 'speed' );
    const speedBinsDocumentation = `There are ${this.numberOfBins} bins, with bin width ${this.speedBinWidth} pm/ps.`;

    this.heavySpeedBinCountsProperty = new Property( emptyBins,
      combineOptions<PropertyOptions<number[]>>( {}, binCountsPropertyOptions, {
        tandem: speedTandem.createTandem( 'heavySpeedCumulativeBinCountsProperty' ),
        phetioFeatured: true,
        phetioReadOnly: true,
        phetioDocumentation: `Bin counts for the speed of heavy particles (time averaged). ${speedBinsDocumentation}`
      } ) );

    this.lightSpeedBinCountsProperty = new Property( emptyBins,
      combineOptions<PropertyOptions<number[]>>( {}, binCountsPropertyOptions, {
        tandem: speedTandem.createTandem( 'lightSpeedBinCountsProperty' ),
        phetioFeatured: true,
        phetioReadOnly: true,
        phetioDocumentation: `Bin counts for the speed of light particles (time averaged). ${speedBinsDocumentation}`
      } ) );

    // While this could be a DerivedProperty, it's more efficient to avoid intermediate states by setting it in update().
    this.totalSpeedBinCountsProperty = new Property( emptyBins,
      combineOptions<PropertyOptions<number[]>>( {}, binCountsPropertyOptions, {
        tandem: speedTandem.createTandem( 'totalSpeedBinCountsProperty' ),
        phetioFeatured: true,
        phetioReadOnly: true,
        phetioDocumentation: `Bin counts for the speed of all particles (time averaged). ${speedBinsDocumentation}`
      } ) );

    const kineticEnergyTandem = options.tandem.createTandem( 'kineticEnergy' );
    const kineticEnergyBinsDocumentation = `There are ${this.numberOfBins} bins, with bin width ${this.kineticEnergyBinWidth} AMU * pm<sup>2</sup> / ps<sup>2</sup>.`;

    this.heavyKineticEnergyBinCountsProperty = new Property( emptyBins,
      combineOptions<PropertyOptions<number[]>>( {}, binCountsPropertyOptions, {
        tandem: kineticEnergyTandem.createTandem( 'heavyKineticEnergyBinCountsProperty' ),
        phetioFeatured: true,
        phetioReadOnly: true,
        phetioDocumentation: `Bin counts for the kinetic energy of heavy particles (time averaged). ${kineticEnergyBinsDocumentation}`
      } ) );

    this.lightKineticEnergyBinCountsProperty = new Property( emptyBins,
      combineOptions<PropertyOptions<number[]>>( {}, binCountsPropertyOptions, {
        tandem: kineticEnergyTandem.createTandem( 'lightKineticEnergyBinCountsProperty' ),
        phetioFeatured: true,
        phetioReadOnly: true,
        phetioDocumentation: `Bin counts for the kinetic energy of light particles (time averaged). ${kineticEnergyBinsDocumentation}`
      } ) );

    // While this could be a DerivedProperty, it's more efficient to avoid intermediate states by setting it in update().
    this.totalKineticEnergyBinCountsProperty = new Property( emptyBins,
      combineOptions<PropertyOptions<number[]>>( {}, binCountsPropertyOptions, {
        tandem: kineticEnergyTandem.createTandem( 'totalKineticEnergyBinCountsProperty' ),
        phetioFeatured: true,
        phetioReadOnly: true,
        phetioDocumentation: `Bin counts for the kinetic energy of all particles (time averaged). ${kineticEnergyBinsDocumentation}`
      } ) );

    this.zoomLevelIndexProperty = new NumberProperty( HistogramsModel.ZOOM_LEVELS.length - 2, {
      numberType: 'Integer',
      range: new Range( 0, HistogramsModel.ZOOM_LEVELS.length - 1 ),
      tandem: options.tandem.createTandem( 'zoomLevelIndexProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Zoom level shared by the Speed and Kinetic Energy histograms. A larger value is more zoomed in.'
    } );

    this.binCountsUpdatedEmitter = new Emitter();

    this.dtAccumulator = 0;
    this.numberOfSamples = 0;

    // Clear sample data when the play state changes, so that we can update immediately if manually stepping.
    isPlayingProperty.link( () => {
      this.clearSamples();
    } );

    // If the number of particles becomes zero, or changes while paused, update immediately.
    particleSystem.numberOfParticlesProperty.link( numberOfParticles => {
      if ( !isSettingPhetioStateProperty.value ) {
        if ( numberOfParticles === 0 || !isPlayingProperty.value ) {
          this.clearSamples();
          this.step( this.samplePeriod ); // using the sample period causes an immediate update
        }
      }
    } );
  }

  public reset(): void {
    this.clearSamples();
    this.heavySpeedBinCountsProperty.reset();
    this.lightSpeedBinCountsProperty.reset();
    this.totalSpeedBinCountsProperty.reset();
    this.heavyKineticEnergyBinCountsProperty.reset();
    this.lightKineticEnergyBinCountsProperty.reset();
    this.totalKineticEnergyBinCountsProperty.reset();
    this.zoomLevelIndexProperty.reset();
  }

  /**
   * Clears the sample data.
   */
  private clearSamples(): void {

    this.dtAccumulator = 0;
    this.numberOfSamples = 0;

    // Reset all cumulative bin counts to zero.
    this.heavySpeedCumulativeBinCounts.fill( 0 );
    this.lightSpeedCumulativeBinCounts.fill( 0 );
    this.heavyKineticEnergyCumulativeBinCounts.fill( 0 );
    this.lightKineticEnergyCumulativeBinCounts.fill( 0 );
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
   * Takes a data sample for both histograms. Rather than keeping these samples for later processing, we adjust the
   * cumulative bin counts immediately, then discard the samples. This greatly reduces the size of the data serialized
   * by HistogramsModelIO. See https://github.com/phetsims/gas-properties/issues/235.
   */
  private sample(): void {
    assert && assert( !( this.numberOfSamples !== 0 && !this.isPlayingProperty.value ),
      'numberOfSamples should be 0 if called while the sim is paused' );

    // Speed
    const heavySpeedSample = getSpeedSample( this.particleSystem.heavyParticles );
    processSample( heavySpeedSample, this.heavySpeedCumulativeBinCounts, this.speedBinWidth );
    const lightSpeedSample = getSpeedSample( this.particleSystem.lightParticles );
    processSample( lightSpeedSample, this.lightSpeedCumulativeBinCounts, this.speedBinWidth );

    // Kinetic Energy
    const heavyKineticEnergySample = getKineticEnergySample( this.particleSystem.heavyParticles );
    processSample( heavyKineticEnergySample, this.heavyKineticEnergyCumulativeBinCounts, this.kineticEnergyBinWidth );
    const lightKineticEnergySample = getKineticEnergySample( this.particleSystem.lightParticles );
    processSample( lightKineticEnergySample, this.lightKineticEnergyCumulativeBinCounts, this.kineticEnergyBinWidth );

    this.numberOfSamples++;
  }

  /**
   * Updates the histograms using the current bin counts.
   */
  private update(): void {
    assert && assert( !( this.numberOfSamples !== 1 && !this.isPlayingProperty.value ),
      'numberOfSamples should be 1 if called while the sim is paused' );

    // average the Speed bin counts
    this.heavySpeedBinCountsProperty.value = this.heavySpeedCumulativeBinCounts.map( count => count / this.numberOfBins );
    this.lightSpeedBinCountsProperty.value = this.lightSpeedCumulativeBinCounts.map( count => count / this.numberOfBins );
    this.totalSpeedBinCountsProperty.value = sumBinCounts( this.heavySpeedBinCountsProperty.value, this.lightSpeedBinCountsProperty.value );

    // average the Kinetic Energy bin counts
    this.heavyKineticEnergyBinCountsProperty.value = this.heavyKineticEnergyCumulativeBinCounts.map( count => count / this.numberOfBins );
    this.lightKineticEnergyBinCountsProperty.value = this.lightKineticEnergyCumulativeBinCounts.map( count => count / this.numberOfBins );
    this.totalKineticEnergyBinCountsProperty.value = sumBinCounts( this.heavyKineticEnergyBinCountsProperty.value, this.lightKineticEnergyBinCountsProperty.value );

    // Notify listeners that the bin counts have been updated.
    this.binCountsUpdatedEmitter.emit();

    // Clear sample data in preparation for the next sample period.
    this.clearSamples();
  }

  /**
   * HistogramModelIO handles serialization of data that supports derivation of speed and kinetic energy histograms.
   * It implements reference-type serialization, as described in
   * https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization.
   */
  private static readonly HistogramsModelIO = new IOType<HistogramsModel, HistogramsModelStateObject>( 'HistogramsModelIO', {
    valueType: HistogramsModel,
    stateSchema: STATE_SCHEMA,
    documentation: 'PhET-iO Type that supports sampling of the Speed and Kinetic Energy of the particle system. ' +
                   'All fields in this type are for internal use only.'
    // toStateObject: Use the default, which is derived from stateSchema.
    // applyState: Use the default, which is derived from stateSchema.
  } );
}

/**
 * Gets the speed values for a set of particles, in pm/ps.
 */
function getSpeedSample( particles: Particle[] ): number[] {
  const values = [];
  for ( let i = particles.length - 1; i >= 0; i-- ) {
    values.push( particles[ i ].getSpeed() );
  }
  return values;
}

/**
 * Gets the kinetic energy values for a set of particles, in AMU * pm^2 / ps^2.
 */
function getKineticEnergySample( particles: Particle[] ): number[] {
  const values = [];
  for ( let i = particles.length - 1; i >= 0; i-- ) {
    values.push( particles[ i ].getKineticEnergy() );
  }
  return values;
}

/**
 * Processes a sample (an array of values) and adjusts bin counts accordingly.
 */
function processSample( sample: number[], binCounts: number[], binWidth: number ): void {
  for ( let i = sample.length - 1; i >= 0; i-- ) {
    const index = Math.floor( sample[ i ] / binWidth ); // bin range is [min,max)
    if ( index >= 0 && index < binCounts.length ) {
      binCounts[ index ]++;
    }
  }
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

assert && assert( _.every( HistogramsModel.ZOOM_LEVELS, ( zoomLevel, index ) =>
    ( index === 0 || HistogramsModel.ZOOM_LEVELS[ index - 1 ].yMax > zoomLevel.yMax ) ),
  'ZOOM_LEVELS must be ordered by descending yMax' );

gasProperties.register( 'HistogramsModel', HistogramsModel );