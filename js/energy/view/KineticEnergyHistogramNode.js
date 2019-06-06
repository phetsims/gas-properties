// Copyright 2019, University of Colorado Boulder

/**
 * KineticEnergyHistogramNode shows the distribution of the kinetic energy of particles in the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const HistogramNode = require( 'GAS_PROPERTIES/energy/view/HistogramNode' );
  const HistogramsModel = require( 'GAS_PROPERTIES/energy/model/HistogramsModel' );

  // strings
  const numberOfParticlesString = require( 'string!GAS_PROPERTIES/numberOfParticles' );
  const kineticEnergyString = require( 'string!GAS_PROPERTIES/kineticEnergy' );

  class KineticEnergyHistogramNode extends HistogramNode {

    /**
     * @param {HistogramsModel} histogramsModel
     * @param {Object} [options]
     */
    constructor( histogramsModel, options ) {
      assert && assert( histogramsModel instanceof HistogramsModel, `invalid histogramModel: ${histogramsModel}` );

      options = _.extend( {

        // superclass options
        barColor: GasPropertiesColorProfile.kineticEnergyHistogramBarColorProperty
      }, options );

      super(
        histogramsModel.numberOfBins,
        histogramsModel.kineticEnergyBinWidth,
        histogramsModel.binCountsUpdatedEmitter,
        histogramsModel.allKineticEnergyBinCountsProperty,
        histogramsModel.heavyKineticEnergyBinCountsProperty,
        histogramsModel.lightKineticEnergyBinCountsProperty,
        histogramsModel.yScaleProperty,
        kineticEnergyString, // x-axis label
        numberOfParticlesString, // y-axis label
        options
      );
    }
  }

  return gasProperties.register( 'KineticEnergyHistogramNode', KineticEnergyHistogramNode );
} );