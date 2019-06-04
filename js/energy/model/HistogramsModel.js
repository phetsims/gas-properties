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
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );

  // constants
  const SAMPLE_PERIOD = GasPropertiesQueryParameters.histogramSamplePeriod; // ps
  const MIN_Y_SCALE = 20;

  class HistogramsModel {

    /**
     * @param {EnergyModel} model
     */
    constructor( model ) {
      
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

      // @private Speed samples
      this.heavySpeedSamples = []; // {number[][]} Speed samples for heavy particles
      this.lightSpeedSamples = []; // {number[][]} Speed samples for light particles

      // @private Kinetic Energy samples
      this.heavyKineticEnergySamples = []; // {number[][]} Kinetic Energy samples for heavy particles
      this.lightKineticEnergySamples = []; // {number[][]} Kinetic Energy samples for light particles

      // @private for measuring sample period
      this.dtAccumulator = 0;
    }
    
    // @public
    reset() {
      this.resetAccumulators();
    }

    // @private
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
      if ( this.dtAccumulator >= SAMPLE_PERIOD ) {

        // update Speed histograms
        this.heavySpeedBinCountsProperty.value =
          samplesToBinCounts( this.heavySpeedSamples, this.numberOfBins, this.speedBinWidth );
        this.lightSpeedBinCountsProperty.value =
          samplesToBinCounts( this.lightSpeedSamples, this.numberOfBins, this.speedBinWidth );
        this.allSpeedBinCountsProperty.value =
          sumBinCounts( this.heavySpeedBinCountsProperty.value, this.lightSpeedBinCountsProperty.value );

        // update Speed histograms
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

        // Increase the y scale a bit so that there's always a little space above maxBinCount.
        this.yScaleProperty.value = Math.max( 1.05 * maxBinCount, MIN_Y_SCALE );

        // Notify listeners that the bin counts have been update
        this.binCountsUpdatedEmitter.emit();
        
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

    const binCounts = [];

    //TODO #52 inefficient, iterate once over sampleArrays to put values in binCounts, once over binCounts to average
    for ( let i = 0; i < numberOfBins; i++ ) {

      // Determine the range of the bin, [min,max)
      const min = i * binWidth;
      const max = ( i + 1 ) * binWidth;

      // Determine the number of values that belong in this bin
      let totalCount = 0;
      for ( let j = 0; j < sampleArrays.length; j++ ) {
        const values = sampleArrays[ j ];
        for ( let k = 0; k < values.length; k++ ) {
          const value = values[ k ];
          if ( value >= min && value < max ) {
            totalCount++;
          }
        }
      }

      // Average over the number of samples
      binCounts.push( totalCount / sampleArrays.length );
    }
    
    assert && assert( binCounts.length === numberOfBins, `unexpected number of bins: ${binCounts.length}` );
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