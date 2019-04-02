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
  const Histogram = require( 'GAS_PROPERTIES/energy/view/Histogram' );

  // strings
  const numberOfParticlesString = require( 'string!GAS_PROPERTIES/numberOfParticles' );
  const kineticEnergyString = require( 'string!GAS_PROPERTIES/kineticEnergy' );

  class KineticEnergyHistogram extends Histogram {

    /**
     * @param {GasPropertiesModel} model
     * @param {Object} [options]
     */
    constructor( model, options ) {

      options = _.extend( {
        xAxisString: kineticEnergyString,
        yAxisString: numberOfParticlesString
      }, options );

      super( model, options );
    }
  }

  return gasProperties.register( 'KineticEnergyHistogram', KineticEnergyHistogram );
} );