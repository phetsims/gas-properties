// Copyright 2018, University of Colorado Boulder

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
     * @param {CollidableBody} bodyA
     * @param {CollidableBody} bodyB
     * @returns {boolean}
     */
    detectAndDoCollision( bodyA, bodyB ) {
      throw new Error( 'detectAndDoCollision must be implemented by subclass' );
    }
  }

  return gasProperties.register( 'CollisionExpert', CollisionExpert );
} );