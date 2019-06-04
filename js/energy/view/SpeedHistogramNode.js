// Copyright 2019, University of Colorado Boulder

/**
 * SpeedHistogramNode shows the distribution of the speeds of the particles in the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const HistogramNode = require( 'GAS_PROPERTIES/energy/view/HistogramNode' );
  const HistogramsModel = require( 'GAS_PROPERTIES/energy/model/HistogramsModel' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const numberOfParticlesString = require( 'string!GAS_PROPERTIES/numberOfParticles' );
  const speedString = require( 'string!GAS_PROPERTIES/speed' );

  class SpeedHistogramNode extends HistogramNode {

    /**
     * @param {HistogramsModel} histogramsModel
     * @param {BooleanProperty} heavyVisibleProperty - visibility of the histogram for heavy particles
     * @param {BooleanProperty} lightVisibleProperty - visibility of the histogram for light particles
     * @param {Object} [options]
     */
    constructor( histogramsModel, heavyVisibleProperty, lightVisibleProperty, options ) {
      assert && assert( histogramsModel instanceof HistogramsModel,
        `invalid histogramModel: ${histogramsModel}` );
      assert && assert( heavyVisibleProperty instanceof BooleanProperty,
        `invalid heavyVisibleProperty: ${heavyVisibleProperty}` );
      assert && assert( lightVisibleProperty instanceof BooleanProperty,
        `invalid lightVisibleProperty: ${lightVisibleProperty}` );

      options = _.extend( {
        barColor: GasPropertiesColorProfile.speedHistogramBarColorProperty
      }, options );

      const xAxisLabel = new Text( speedString, GasPropertiesConstants.HISTOGRAM_AXIS_LABEL_OPTIONS );
      const yAxisLabel = new Text( numberOfParticlesString, GasPropertiesConstants.HISTOGRAM_AXIS_LABEL_OPTIONS );

      super(
        histogramsModel.numberOfBins,
        histogramsModel.speedBinWidth,
        histogramsModel.yScaleProperty,
        histogramsModel.binCountsUpdatedEmitter,
        histogramsModel.allSpeedBinCountsProperty,
        histogramsModel.heavySpeedBinCountsProperty,
        histogramsModel.lightSpeedBinCountsProperty,
        xAxisLabel,
        yAxisLabel,
        heavyVisibleProperty,
        lightVisibleProperty,
        options
      );
    }
  }

  return gasProperties.register( 'SpeedHistogramNode', SpeedHistogramNode );
} );