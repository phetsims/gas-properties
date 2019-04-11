// Copyright 2019, University of Colorado Boulder

/**
 * Base class for particles in the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const Particle = require( 'GAS_PROPERTIES/common/model/Particle' );

  class DiffusionParticle extends Particle {

    /**
     * @param {Object} [options] see Particle
     */
    constructor( options ) {
      super( _.extend( {
        mass: 28, // N2, rounded to the closest integer
        radius: 0.125 // nm
      }, options ) );
    }
  }

  return gasProperties.register( 'DiffusionParticle', DiffusionParticle );
} );