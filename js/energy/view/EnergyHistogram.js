// Copyright 2019, University of Colorado Boulder

/**
 * Base class for histograms in the 'Energy' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const Histogram = require( 'GAS_PROPERTIES/energy/view/Histogram' );
  const PlotType = require( 'GAS_PROPERTIES/energy/model/PlotType' );

  // constants
  const SAMPLE_PERIOD = GasPropertiesQueryParameters.histogramSamplePeriod; // ps

  class EnergyHistogram extends Histogram {

    /**
     * @param {number} numberOfBins
     * @param {number} binWidth
     * @param {Node} xAxisLabel
     * @param {Node} yAxisLabel
     * @param {BooleanProperty} heavyVisibleProperty
     * @param {BooleanProperty} lightVisibleProperty
     * @param {function:number[]} getHeavyValues
     * @param {function:number[]} getLightValues
     * @param {ColorDef} barsColor
     * @param {Object} [options]
     */
    constructor( numberOfBins, binWidth,
                 xAxisLabel, yAxisLabel,
                 heavyVisibleProperty, lightVisibleProperty,
                 getHeavyValues, getLightValues,
                 barsColor, options ) {

      super( numberOfBins, binWidth, xAxisLabel, yAxisLabel, options );

      // @private
      this.heavyVisibleProperty = heavyVisibleProperty;
      this.lightVisibleProperty = lightVisibleProperty;
      this.getHeavyValues = getHeavyValues;
      this.getLightValues = getLightValues;

      // @private accumulators
      this.dtAccumulator = 0;
      this.numberOfSamples = 0;
      this.numberOfValues = 0; // {number} number of values in this.allValues
      this.heavyValues = []; // {number[][]} samples for heavy particles
      this.lightValues = []; // {number[][]} samples for light particles
      this.allValues = []; // {number[][]} samples for all particles

      // @private add data sets and store indices
      this.allIndex = this.addDataSet( PlotType.BARS, barsColor );
      this.heavyIndex = this.addDataSet( PlotType.LINES, GasPropertiesColorProfile.heavyParticleColorProperty  );
      this.lightIndex = this.addDataSet( PlotType.LINES, GasPropertiesColorProfile.lightParticleColorProperty );

      // Sets visibility of data sets for heavy and light particles
      this.heavyVisibleProperty.link( visible => {
        this.setDataSetVisible( this.heavyIndex, visible );
      } );
      this.lightVisibleProperty.link( visible => {
        this.setDataSetVisible( this.lightIndex, visible );
      } );
    }

    // @public
    reset() {
      this.resetAccumulators();
      this.updateDataSets();
    }

    // @private
    resetAccumulators() {
      this.dtAccumulator = 0;
      this.numberOfSamples = 0;
      this.numberOfValues = 0;
      this.heavyValues.length = 0;
      this.lightValues.length = 0;
      this.allValues.length = 0;
    }

    /**
     * Steps the histogram.
     * @param {number} dt - time delta, in ps
     */
    step( dt ) {

      // take a sample
      const heavyValues = this.getHeavyValues();
      const lightValues = this.getLightValues();
      const allValues = heavyValues.concat( lightValues ); //TODO concat is expensive

      // accumulate the sample
      this.dtAccumulator += dt;
      this.numberOfSamples++;
      this.numberOfValues += allValues.length;
      this.heavyValues.push( heavyValues );
      this.lightValues.push( lightValues );
      this.allValues.push( allValues );

      if ( this.dtAccumulator >= SAMPLE_PERIOD ) {

        // set the y-axis scale
        const valuesPerSample = this.numberOfValues / this.numberOfSamples;
        this.setMaxY( Math.max( 0.2 * valuesPerSample, 1 ) );

        // update data sets
        this.updateDataSets();
        
        this.resetAccumulators();
      }
    }

    /**
     * Updates the data sets.
     * @private
     */
    updateDataSets() {
      this.updateDataSet( this.allIndex, this.allValues );
      this.updateDataSet( this.heavyIndex, this.heavyValues );
      this.updateDataSet( this.lightIndex, this.lightValues );
      this.update();
    }
  }

  return gasProperties.register( 'EnergyHistogram', EnergyHistogram );
} );