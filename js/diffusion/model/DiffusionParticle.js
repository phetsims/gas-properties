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
        radius: 125 // pm
      }, options ) );
    }
  }

  return gasProperties.register( 'DiffusionParticle', DiffusionParticle );
} );