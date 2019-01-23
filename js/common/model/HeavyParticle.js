// Copyright 2019, University of Colorado Boulder

/**
 * Model for heavy particles.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const Particle = require( 'GAS_PROPERTIES/common/model/Particle' );

  class HeavyParticle extends Particle {

    /**
     * @param {Object} [options] see Particle
     */
    constructor( options ) {

      options = _.extend( {
        mass: 28, // N2, rounded to the closest integer
        radius: 5
      }, options );

      super( options );
    }
  }

  return gasProperties.register( 'HeavyParticle', HeavyParticle );
} );