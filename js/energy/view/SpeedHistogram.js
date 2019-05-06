// Copyright 2019, University of Colorado Boulder

/**
 * Speed histogram, shows the distribution of the speeds of the particles in the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const EnergyHistogram = require( 'GAS_PROPERTIES/energy/view/EnergyHistogram' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const numberOfParticlesString = require( 'string!GAS_PROPERTIES/numberOfParticles' );
  const speedString = require( 'string!GAS_PROPERTIES/speed' );

  // constants
  const NUMBER_OF_BINS = GasPropertiesQueryParameters.speedBins;
  const BIN_WIDTH = GasPropertiesQueryParameters.speedBinWidth; // pm/ps

  class SpeedHistogram extends EnergyHistogram {

    /**
     * @param {EnergyModel} model
     * @param {BooleanProperty} heavyVisibleProperty
     * @param {BooleanProperty} lightVisibleProperty
     * @param {Object} [options]
     */
    constructor( model, heavyVisibleProperty, lightVisibleProperty, options ) {
      super(
        NUMBER_OF_BINS, BIN_WIDTH,
        new Text( speedString, GasPropertiesConstants.HISTOGRAM_AXIS_LABEL_OPTIONS ),
        new Text( numberOfParticlesString, GasPropertiesConstants.HISTOGRAM_AXIS_LABEL_OPTIONS ),
        heavyVisibleProperty, lightVisibleProperty,
        model.getHeavyParticleSpeedValues.bind( model ),
        model.getLightParticleSpeedValues.bind( model ),
        options
      );
    }
  }

  return gasProperties.register( 'SpeedHistogram', SpeedHistogram );
} );