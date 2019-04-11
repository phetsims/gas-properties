// Copyright 2019, University of Colorado Boulder

/**
 * Kinetic Energy histogram, shows the distribution of kinetic energy of the particles in the container.
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
  const PlotType = require( 'GAS_PROPERTIES/energy/model/PlotType' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const numberOfParticlesString = require( 'string!GAS_PROPERTIES/numberOfParticles' );
  const kineticEnergyString = require( 'string!GAS_PROPERTIES/kineticEnergy' );

  // constants
  const NUMBER_OF_BINS = 10;
  const BIN_WIDTH = 1; // AMU * nm^2 / ps^2

  class KineticEnergyHistogram extends Histogram {

    /**
     * @param {GasPropertiesModel} model
     * @param {Object} [options]
     */
    constructor( model, options ) {

      const xAxisLabel = new Text( kineticEnergyString, GasPropertiesConstants.HISTOGRAM_AXIS_LABEL_OPTIONS );
      const yAxisLabel = new Text( numberOfParticlesString, GasPropertiesConstants.HISTOGRAM_AXIS_LABEL_OPTIONS );

      super( NUMBER_OF_BINS, BIN_WIDTH, xAxisLabel, yAxisLabel, options );

      // @private
      this.model = model;
    }

    /**
     * Steps the histogram.
     * @param {number} dt - time delta, in ps
     */
    step( dt ) {

      this.removeAllDataSets();

      // Get KE values, {number[]}
      const values = this.model.getKineticEnergyValues();

      if ( values.length > 0 ) {

        // set the y-axis scale
        this.setMaxY( values.length ); //TODO

        // KE data set
        this.addDataSet( new DataSet( values, PlotType.BARS, GasPropertiesColorProfile.histogramBarColorProperty ) );
      }

      this.update();
    }
  }

  return gasProperties.register( 'KineticEnergyHistogram', KineticEnergyHistogram );
} );