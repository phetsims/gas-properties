// Copyright 2019, University of Colorado Boulder

/**
 * Speed histogram, shows the distribution of the speeds of the particles in the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const DataSet = require( 'GAS_PROPERTIES/energy/model/DataSet' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const Histogram = require( 'GAS_PROPERTIES/energy/view/Histogram' );
  const PlotType = require( 'GAS_PROPERTIES/energy/model/PlotType' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const numberOfParticlesString = require( 'string!GAS_PROPERTIES/numberOfParticles' );
  const speedString = require( 'string!GAS_PROPERTIES/speed' );

  // constants
  const NUMBER_OF_BINS = GasPropertiesQueryParameters.speedBins;
  const BIN_WIDTH = GasPropertiesQueryParameters.speedBinWidth; // pm/ps
  const SAMPLE_PERIOD = GasPropertiesQueryParameters.histogramSamplePeriod; // ps

  class SpeedHistogram extends Histogram {

    /**
     * @param {EnergyModel} model
     * @param {BooleanProperty} heavyVisibleProperty
     * @param {BooleanProperty} lightVisibleProperty
     * @param {Object} [options]
     */
    constructor( model, heavyVisibleProperty, lightVisibleProperty, options ) {

      const xAxisLabel = new Text( speedString, GasPropertiesConstants.HISTOGRAM_AXIS_LABEL_OPTIONS );
      const yAxisLabel = new Text( numberOfParticlesString, GasPropertiesConstants.HISTOGRAM_AXIS_LABEL_OPTIONS );

      super( NUMBER_OF_BINS, BIN_WIDTH, xAxisLabel, yAxisLabel, options );

      // @private
      this.model = model;
      this.heavyVisibleProperty = heavyVisibleProperty;
      this.lightVisibleProperty = lightVisibleProperty;

      // @private accumulators
      this.dtAccumulator = 0;
      this.numberOfSamples = 0;
      this.numberOfValues = 0; // {number} number of values in this.allValues
      this.heavyValues = []; // {number[][]} samples for heavy particles
      this.lightValues = []; // {number[][]} samples for light particles
      this.allValues = []; // {number[][]} samples for all particles
    }

    // @public @override
    reset() {
      super.reset();
      this.resetAccumulators();
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
      const heavyValues = this.model.getHeavyParticleSpeedValues();
      const lightValues = this.model.getLightParticleSpeedValues();
      const allValues = heavyValues.concat( lightValues ); //TODO concat is expensive

      // accumulate the sample
      this.dtAccumulator += dt;
      this.numberOfSamples++;
      this.numberOfValues += allValues.length;
      this.heavyValues.push( heavyValues );
      this.lightValues.push( lightValues );
      this.allValues.push( allValues );

      if ( this.dtAccumulator >= SAMPLE_PERIOD ) {

        this.removeAllDataSets();

        if ( this.numberOfValues > 0 ) {

          // set the y-axis scale
          const valuesPerSample = this.numberOfValues / this.numberOfSamples;
          this.setMaxY( Math.max( 0.2 * valuesPerSample, 2 * this.yInterval ) ); //TODO

          // all particles
          this.addDataSet( new DataSet( this.allValues, PlotType.BARS,
            GasPropertiesColorProfile.histogramBarColorProperty ) );

          // heavy particles
          if ( this.heavyVisibleProperty.value ) {
            this.addDataSet( new DataSet( this.heavyValues, PlotType.LINES,
              GasPropertiesColorProfile.heavyParticleColorProperty ) );
          }

          // light particles
          if ( this.lightVisibleProperty.value ) {
            this.addDataSet( new DataSet( this.lightValues, PlotType.LINES,
              GasPropertiesColorProfile.lightParticleColorProperty ) );
          }
        }

        this.update();
        this.resetAccumulators();
      }
    }
  }

  return gasProperties.register( 'SpeedHistogram', SpeedHistogram );
} );