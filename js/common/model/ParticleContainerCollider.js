// Copyright 2019, University of Colorado Boulder

//TODO see Java SphereBoxExpert, SphereBoxCollision
/**
 * Detects and handles particle-container collisions.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );

  class ParticleContainerCollider {

    constructor() {
      //TODO
    }

    /**
     * Detects and handles collision between 2 particles.
     * @param {Particle} particle
     * @param {Container} container
     * @returns {boolean} true if the particle and container collided, false otherwise
     */
    doCollision( particle, container ) {
      return false; //TODO
    }
  }

  return gasProperties.register( 'ParticleContainerCollider', ParticleContainerCollider );
} );