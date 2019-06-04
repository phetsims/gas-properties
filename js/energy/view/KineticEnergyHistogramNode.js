// Copyright 2019, University of Colorado Boulder

/**
 * KineticEnergyHistogramNode shows the distribution of kinetic energy of the particles in the container.
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
  const kineticEnergyString = require( 'string!GAS_PROPERTIES/kineticEnergy' );

  class KineticEnergyHistogramNode extends HistogramNode {

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
        barColor: GasPropertiesColorProfile.kineticEnergyHistogramBarColorProperty
      }, options );

      const xAxisLabel = new Text( kineticEnergyString, GasPropertiesConstants.HISTOGRAM_AXIS_LABEL_OPTIONS );
      const yAxisLabel = new Text( numberOfParticlesString, GasPropertiesConstants.HISTOGRAM_AXIS_LABEL_OPTIONS );

      super(
        histogramsModel.numberOfBins,
        histogramsModel.kineticEnergyBinWidth,
        histogramsModel.yScaleProperty,
        histogramsModel.binCountsUpdatedEmitter,
        histogramsModel.allKineticEnergyBinCountsProperty,
        histogramsModel.heavyKineticEnergyBinCountsProperty,
        histogramsModel.lightKineticEnergyBinCountsProperty,
        xAxisLabel,
        yAxisLabel,
        heavyVisibleProperty,
        lightVisibleProperty,
        options
      );
    }
  }

  return gasProperties.register( 'KineticEnergyHistogramNode', KineticEnergyHistogramNode );
} );