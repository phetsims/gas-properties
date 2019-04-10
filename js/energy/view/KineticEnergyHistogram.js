// Copyright 2019, University of Colorado Boulder

//TODO flesh out
/**
 * Kinetic Energy histogram, shows the distribution of kinetic energy of the particles in the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const Histogram = require( 'GAS_PROPERTIES/energy/view/Histogram' );
  const HistogramDataSet = require( 'GAS_PROPERTIES/energy/model/HistogramDataSet' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const numberOfParticlesString = require( 'string!GAS_PROPERTIES/numberOfParticles' );
  const kineticEnergyString = require( 'string!GAS_PROPERTIES/kineticEnergy' );

  // constants
  const BIN_WIDTH = 50; //TODO value and units

  class KineticEnergyHistogram extends Histogram {

    /**
     * @param {GasPropertiesModel} model
     * @param {Object} [options]
     */
    constructor( model, options ) {

      const xAxisLabel = new Text( kineticEnergyString, GasPropertiesConstants.HISTOGRAM_AXIS_LABEL_OPTIONS );
      const yAxisLabel = new Text( numberOfParticlesString, GasPropertiesConstants.HISTOGRAM_AXIS_LABEL_OPTIONS );

      super( xAxisLabel, yAxisLabel, options );

      // @private
      this.model = model;
    }

    /**
     * Steps the histogram.
     * @param {number} dt - time delta, in ps
     */
    step( dt ) {
      this.removeAllDataSets();
      this.addDataSet( new HistogramDataSet( this.model.getKineticEnergyValues(), BIN_WIDTH, {
        fill: GasPropertiesColorProfile.histogramBarColorProperty,
        stroke: null
      } ) );
      this.update();
    }
  }

  return gasProperties.register( 'KineticEnergyHistogram', KineticEnergyHistogram );
} );