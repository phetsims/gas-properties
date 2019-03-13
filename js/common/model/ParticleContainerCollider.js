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
  const Container = require( 'GAS_PROPERTIES/common/model/Container' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const Particle = require( 'GAS_PROPERTIES/common/model/Particle' );

  class ParticleContainerCollider {

    constructor() {
      //TODO does this need to be a class?
    }

    /**
     * Detects and handles collision between a particle and a container.
     * @param {Particle} particle
     * @param {Container} container
     * @public
     */
    doCollision( particle, container ) {
      assert && assert( particle instanceof Particle, 'particle is not a Particle' );
      assert && assert( container instanceof Container, 'container is not a Container' );

      // adjust x
      if ( particle.location.x - particle.radius < container.left ) {
        particle.setLocation( container.left + particle.radius, particle.location.y );
        particle.invertDirectionX();
      }
      else if ( particle.location.x + particle.radius > container.right ) {
        particle.setLocation( container.right - particle.radius, particle.location.y );
        particle.invertDirectionX();
      }

      // adjust y
      if ( particle.location.y + particle.radius > container.top ) {
        particle.setLocation( particle.location.x, container.top - particle.radius );
        particle.invertDirectionY();
      }
      else if ( particle.location.y - particle.radius < container.bottom ) {
        particle.setLocation( particle.location.x, container.bottom + particle.radius );
        particle.invertDirectionY();
      }
    }
  }

  return gasProperties.register( 'ParticleContainerCollider', ParticleContainerCollider );
} );