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
  const Histogram = require( 'GAS_PROPERTIES/energy/view/Histogram' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const numberOfParticlesString = require( 'string!GAS_PROPERTIES/numberOfParticles' );
  const speedString = require( 'string!GAS_PROPERTIES/speed' );

  // constants
  const NUMBER_OF_BINS = 10;
  const BIN_WIDTH = 0.25; // nm/ps

  class SpeedHistogram extends Histogram {

    /**
     * @param {GasPropertiesModel} model
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
    }

    /**
     * Steps the histogram.
     * @param {number} dt - time delta, in ps
     */
    step( dt ) {

      this.removeAllDataSets();

      // Get speed values, {number[]}
      const heavyValues = this.model.getHeavyParticleSpeedValues();
      const lightValues = this.model.getLightParticleSpeedValues();
      const allValues = heavyValues.concat( lightValues );

      if ( allValues.length > 0 ) {

        // set the y-axis scale
        this.maxY = allValues.length; //TODO

        // all particles
        this.addDataSet( new DataSet( allValues, {
          fill: GasPropertiesColorProfile.histogramBarColorProperty,
          stroke: null
        } ) );

        // heavy particles
        if ( this.heavyVisibleProperty.value ) {
          this.addDataSet( new DataSet( heavyValues, {
            stroke: GasPropertiesColorProfile.heavyParticleColorProperty,
            fill: null
          } ) );
        }

        // light particles
        if ( this.lightVisibleProperty.value ) {
          this.addDataSet( new DataSet( lightValues, {
            stroke: GasPropertiesColorProfile.lightParticleColorProperty,
            fill: null
          } ) );
        }
      }

      this.update();
    }
  }

  return gasProperties.register( 'SpeedHistogram', SpeedHistogram );
} );