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
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const numberOfParticlesString = require( 'string!GAS_PROPERTIES/numberOfParticles' );
  const speedString = require( 'string!GAS_PROPERTIES/speed' );

  class SpeedHistogram extends EnergyHistogram {

    /**
     * @param {EnergyModel} model
     * @param {BooleanProperty} heavyVisibleProperty
     * @param {BooleanProperty} lightVisibleProperty
     * @param {Object} [options]
     */
    constructor( model, heavyVisibleProperty, lightVisibleProperty, options ) {
      super(
        GasPropertiesQueryParameters.bins,
        GasPropertiesQueryParameters.speedBinWidth, // pm/ps
        new Text( speedString, GasPropertiesConstants.HISTOGRAM_AXIS_LABEL_OPTIONS ),
        new Text( numberOfParticlesString, GasPropertiesConstants.HISTOGRAM_AXIS_LABEL_OPTIONS ),
        heavyVisibleProperty, lightVisibleProperty,
        model.getHeavyParticleSpeedValues.bind( model ),
        model.getLightParticleSpeedValues.bind( model ),
        GasPropertiesColorProfile.speedHistogramBarColorProperty,
        options
      );
    }
  }

  return gasProperties.register( 'SpeedHistogram', SpeedHistogram );
} );