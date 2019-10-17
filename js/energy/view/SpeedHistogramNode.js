// Copyright 2019, University of Colorado Boulder

/**
 * SpeedHistogramNode shows the distribution of particle speeds in the container.
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
  const numberOfParticlesString = require( 'string!GAS_PROPERTIES/numberOfParticles' );
  const speedString = require( 'string!GAS_PROPERTIES/speed' );

  class SpeedHistogramNode extends HistogramNode {

    /**
     * @param {HistogramsModel} histogramsModel
     * @param {Object} [options]
     */
    constructor( histogramsModel, options ) {
      assert && assert( histogramsModel instanceof HistogramsModel, `invalid histogramModel: ${histogramsModel}` );

      options = merge( {

        // superclass options
        barColor: GasPropertiesColorProfile.speedHistogramBarColorProperty
      }, options );

      super(
        histogramsModel.numberOfBins,
        histogramsModel.speedBinWidth,
        histogramsModel.binCountsUpdatedEmitter,
        histogramsModel.allSpeedBinCountsProperty,
        histogramsModel.heavySpeedBinCountsProperty,
        histogramsModel.lightSpeedBinCountsProperty,
        histogramsModel.yScaleProperty,
        speedString, // x-axis label
        numberOfParticlesString, // y-axis label
        options
      );
    }
  }

  return gasProperties.register( 'SpeedHistogramNode', SpeedHistogramNode );
} );