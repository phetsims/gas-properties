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
  const merge = require( 'PHET_CORE/merge' );

  // strings
  const kineticEnergyString = require( 'string!GAS_PROPERTIES/kineticEnergy' );
  const numberOfParticlesString = require( 'string!GAS_PROPERTIES/numberOfParticles' );

  class KineticEnergyHistogramNode extends HistogramNode {

    /**
     * @param {HistogramsModel} histogramsModel
     * @param {Object} [options]
     */
    constructor( histogramsModel, options ) {
      assert && assert( histogramsModel instanceof HistogramsModel, `invalid histogramModel: ${histogramsModel}` );

      options = merge( {

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