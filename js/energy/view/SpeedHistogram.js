// Copyright 2019, University of Colorado Boulder

//TODO flesh out
/**
 * Speed histogram, shows the distribution of the speeds of the particles in the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const Histogram = require( 'GAS_PROPERTIES/energy/view/Histogram' );

  // strings
  const numberOfParticlesString = require( 'string!GAS_PROPERTIES/numberOfParticles' );
  const speedString = require( 'string!GAS_PROPERTIES/speed' );

  class SpeedHistogram extends Histogram {

    /**
     * @param {GasPropertiesModel} model
     * @param {BooleanProperty} heavyVisibleProperty
     * @param {BooleanProperty} lightVisibleProperty
     * @param {Object} [options]
     */
    constructor( model, heavyVisibleProperty, lightVisibleProperty, options ) {

      options = _.extend( {
        xAxisString: speedString,
        yAxisString: numberOfParticlesString
      }, options );

      super( model, options );
    }
  }

  return gasProperties.register( 'SpeedHistogram', SpeedHistogram );
} );