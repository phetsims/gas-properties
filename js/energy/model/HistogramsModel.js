// Copyright 2019, University of Colorado Boulder

/**
 * HistogramsModel is a sub-model in the Energy screen, responsible for the Speed and Kinetic Energy histograms.
 * 
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Emitter = require( 'AXON/Emitter' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );

  class HistogramsModel {

    /**
     * @param {EnergyModel} model
     * @param {number} samplePeriod - data is averaged over this period, in ps
     */
    constructor( model, samplePeriod ) {
      assert && assert( typeof samplePeriod === 'number' && samplePeriod > 0,
        `invalid samplePeriod: ${samplePeriod}` );
      
      // @public (read-only)
      this.numberOfBins = GasPropertiesQueryParameters.bins;
      this.speedBinWidth = GasPropertiesQueryParameters.speedBinWidth; // pm/ps
      this.kineticEnergyBinWidth = GasPropertiesQueryParameters.keBinWidth; // AMU * pm^2 / ps^2;

      // Initialize histograms with 0 in all bins
      const emptyBins = [];
      for ( let i = 0; i < this.numberOfBins; i++ ) {
        emptyBins[ i ] = 0;
      }

      const binCountsPropertyOptions = {
        isValidValue: value => ( Array.isArray( value ) && value.length === this.numberOfBins )
      };

      // Speed bin counts
      this.heavySpeedBinCountsProperty = new Property( emptyBins, binCountsPropertyOptions );
      this.lightSpeedBinCountsProperty = new Property( emptyBins, binCountsPropertyOptions );
      this.allSpeedBinCountsProperty = new Property( emptyBins, binCountsPropertyOptions );

      // Kinetic Energy bin counts
      this.heavyKineticEnergyBinCountsProperty = new Property( emptyBins, binCountsPropertyOptions );
      this.lightKineticEnergyBinCountsProperty = new Property( emptyBins, binCountsPropertyOptions );
      this.allKineticEnergyBinCountsProperty = new Property( emptyBins, binCountsPropertyOptions );

      // @public (read-only) the y-axis scale for all histograms
      this.yScaleProperty = new NumberProperty( 0, {
        isValidValue: value => ( value >= 0 )
      } );

      // @public emits when the bin counts have been updated
      this.binCountsUpdatedEmitter = new Emitter();
      
      // @private
      this.model = model;
      this.samplePeriod = samplePeriod;

      // @private Speed samples
      this.heavySpeedSamples = []; // {number[][]} Speed samples for heavy particles
      this.lightSpeedSamples = []; // {number[][]} Speed samples for light particles

      // @private Kinetic Energy samples
      this.heavyKineticEnergySamples = []; // {number[][]} Kinetic Energy samples for heavy particles
      this.lightKineticEnergySamples = []; // {number[][]} Kinetic Energy samples for light particles

      // @private for measuring sample period
      this.dtAccumulator = 0;
    }

    /**
     * @public
     */
    reset() {
      this.resetAccumulators();
    }

    /**
     * Resets dt accumulator and clears samples.
     * @private
     */
    resetAccumulators() {
      
      this.dtAccumulator = 0;
      
      // clear Speed samples
      this.heavySpeedSamples.length = 0;
      this.lightSpeedSamples.length = 0;
      
      // clear Kinetic Energy samples
      this.heavyKineticEnergySamples.length = 0;
      this.lightKineticEnergySamples.length = 0;
    }

    /**
     * Steps the histograms.
     * @param {number} dt - time delta, in ps
     */
    step( dt ) {
      assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );

      // take a Speed sample
      const heavySpeedSamples = this.model.getHeavyParticleSpeedValues();
      const lightSpeedSamples = this.model.getLightParticleSpeedValues();
      this.heavySpeedSamples.push( heavySpeedSamples );
      this.lightSpeedSamples.push( lightSpeedSamples );

      // take a Kinetic Energy sample
      const heavyKineticEnergySamples = this.model.getHeavyParticleKineticEnergyValues();
      const lightKineticEnergySamples = this.model.getLightParticleKineticEnergyValues();
      this.heavyKineticEnergySamples.push( heavyKineticEnergySamples );
      this.lightKineticEnergySamples.push( lightKineticEnergySamples );

      // Accumulate dt
      this.dtAccumulator += dt;

      // When we reach the sample period, average the samples and update the histograms.
      if ( this.dtAccumulator >= this.samplePeriod ) {

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
          _.max( this.allSpeedBinCountsProperty.value ),
          _.max( this.allKineticEnergyBinCountsProperty.value ) );

        // Adjust the y-axis scale to accommodate the maximum bin count.
        // Increase the y scale a bit so that there's always a little space above maxBinCount.
        // The minimum scale is determined by the spacing between horizontal lines in the histogram view.
        // We don't want to the scale to be less than one interval of the horizontal lines, so that the
        // y axis doesn't scale for small numbers of particles.
        this.yScaleProperty.value = Math.max( 1.05 * maxBinCount, GasPropertiesConstants.HISTOGRAM_LINE_SPACING );

        // Notify listeners that the bin counts have been updated.
        this.binCountsUpdatedEmitter.emit();

        // Reset accumulators in preparation for the next sample period.
        this.resetAccumulators();
      }
    }
  }
  
  /**
   * Converts a collection of samples to bin counts.
   * @param {number[][]} sampleArrays
   * @param {number} numberOfBins
   * @param {number} binWidth
   * @returns {number[]}
   * @private
   */
  function samplesToBinCounts( sampleArrays, numberOfBins, binWidth ) {
    assert && assert( Array.isArray( sampleArrays ) && sampleArrays.length > 0, `invalid sampleArrays: ${sampleArrays}` );
    assert && assert( typeof numberOfBins === 'number' && numberOfBins > 0, `invalid numberOfBins: ${numberOfBins}` );
    assert && assert( typeof binWidth === 'number' && binWidth > 0, `invalid binWidth: ${binWidth}` );

    // Initialize the bins with 0 counts
    const binCounts = [];
    for ( let i = 0; i < numberOfBins; i++ ) {
      binCounts[ i ] = 0;
    }

    // Bin all of the sample data, for total binCounts
    for ( let i = 0; i < sampleArrays.length; i++ ) {
      const values = sampleArrays[ i ];
      for ( let j = 0; j < values.length; j++ ) {
        const index = Math.floor( values[ j ] / binWidth ); // bin range is [min,max)
        if ( index >=0 && index < binCounts.length ) {
          binCounts[ index ]++;
        }
      }
    }

    // Average the bin counts
    for ( let i = 0; i < binCounts.length; i++ ) {
      assert && assert( typeof binCounts[ i ] === 'number' && binCounts[ i ] >= 0,
        `invalid binCount: ${binCounts[ i ]}` );
      binCounts[ i ] = binCounts[ i ] / sampleArrays.length;
    }
    
    assert && assert( binCounts.length === numberOfBins, `unexpected number of binCounts: ${binCounts.length}` );
    return binCounts;
  }

  /**
   * Sums the heavy and light bin counts to produce the bin counts for all particles.
   * @param {number[]} heavyBinCounts
   * @param {number[]} lightBinCounts
   * @returns {number[]}
   */
  function sumBinCounts( heavyBinCounts, lightBinCounts ) {
    assert && assert(  Array.isArray( heavyBinCounts ), `invalid heavyBinCounts: ${heavyBinCounts}` );
    assert && assert(  Array.isArray( lightBinCounts ), `invalid heavyBinCounts: ${lightBinCounts}` );
    assert && assert(  heavyBinCounts.length === lightBinCounts.length, 'lengths should be the same' );

    const sumBinCounts = [];
    for ( let i = 0; i < heavyBinCounts.length; i++ ) {
      sumBinCounts[ i ] = heavyBinCounts[ i ] + lightBinCounts[ i ];
    }
    return sumBinCounts;
  }

  return gasProperties.register( 'HistogramsModel', HistogramsModel );
} );