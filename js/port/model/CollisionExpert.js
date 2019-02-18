// Copyright 2019, University of Colorado Boulder

/**
 * TODO port of Java interface
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );

  class CollisionExpert {

    /**
     *
     * @param {Particle} particle1
     * @param {Particle} particle2
     * @returns {boolean}
     */
    detectAndDoCollision( particle1, particle2 ) {
      throw new Error( 'detectAndDoCollision must be implemented by subclass' );
    }
  }

  return gasProperties.register( 'CollisionExpert', CollisionExpert );
} );