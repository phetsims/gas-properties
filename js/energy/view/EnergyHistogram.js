// Copyright 2019, University of Colorado Boulder

/**
 * Base class for histograms in the 'Energy' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const ColorDef = require( 'SCENERY/util/ColorDef' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const Histogram = require( 'GAS_PROPERTIES/energy/view/Histogram' );
  const HistogramStyle = require( 'GAS_PROPERTIES/energy/model/HistogramStyle' );
  const Node = require( 'SCENERY/nodes/Node' );

  // constants
  const SAMPLE_PERIOD = GasPropertiesQueryParameters.histogramSamplePeriod; // ps

  class EnergyHistogram extends Histogram {

    /**
     * @param {number} numberOfBins - number of bins, determines the width of bars in the histogram
     * @param {number} binWidth - bin width, in whatever units are relevant to the data being displayed
     * @param {Node} xAxisLabel - label on the x axis
     * @param {Node} yAxisLabel - label on the y axis
     * @param {BooleanProperty} heavyVisibleProperty - visibility of the histogram for heavy particles
     * @param {BooleanProperty} lightVisibleProperty - visibility of the histogram for light particles
     * @param {function:number[]} getHeavyValues - gets the model values for heavy particles
     * @param {function:number[]} getLightValues - gets the model values for light particles
     * @param {ColorDef} barsColor - color of the 'bars' in the histogram
     * @param {Object} [options]
     */
    constructor( numberOfBins, binWidth,
                 xAxisLabel, yAxisLabel,
                 heavyVisibleProperty, lightVisibleProperty,
                 getHeavyValues, getLightValues,
                 barsColor, options ) {
      assert && assert( typeof numberOfBins === 'number' && numberOfBins > 0, `invalid numberOfBins: ${numberOfBins}` );
      assert && assert( typeof binWidth === 'number' && binWidth > 0, `invalid binWidth: ${binWidth}` );
      assert && assert( xAxisLabel instanceof Node, `invalid xAxisLabel: ${xAxisLabel}` );
      assert && assert( yAxisLabel instanceof Node, `invalid yAxisLabel: ${yAxisLabel}` );
      assert && assert( heavyVisibleProperty instanceof BooleanProperty, `invalid heavyVisibleProperty: ${heavyVisibleProperty}` );
      assert && assert( lightVisibleProperty instanceof BooleanProperty, `invalid lightVisibleProperty: ${lightVisibleProperty}` );
      assert && assert( typeof getHeavyValues === 'function', `invalid heavyVisibleProperty: ${getHeavyValues}` );
      assert && assert( typeof getLightValues === 'function', `invalid getLightValues: ${getLightValues}` );
      assert && assert( ColorDef.isColorDef( barsColor ), `invalid barsColor: ${barsColor}` );

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
      this.allIndex = this.addDataSet( HistogramStyle.BARS, barsColor );
      this.heavyIndex = this.addDataSet( HistogramStyle.LINE_SEGMENTS, GasPropertiesColorProfile.heavyParticleColorProperty  );
      this.lightIndex = this.addDataSet( HistogramStyle.LINE_SEGMENTS, GasPropertiesColorProfile.lightParticleColorProperty );

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
      assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );

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