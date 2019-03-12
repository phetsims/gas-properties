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
      //TODO does this need to be a class?
    }

    /**
     * Detects and handles collision between a particle and a container.
     * @param {Particle} particle
     * @param {Container} container
     * @public
     */
    doCollision( particle, container ) {

      if ( particle.left <= container.left ) {

        // particle collided with left wall
        const dx = 2 * Math.abs( container.left - particle.left );
        const newX = particle.location.x + dx;
        particle.setLocation( newX, particle.location.y );
        particle.setVelocityXY( -particle.velocity.x, particle.velocity.y );

        //TODO adjust kinetic energy due to moving left wall of container
      }
      else if ( particle.right >= container.right ) {

        // particle collided with right wall
        const dx = 2 * Math.abs( container.right - particle.right );
        const newX = particle.location.x - dx;
        particle.setLocation( newX, particle.location.y );
        particle.setVelocityXY( -particle.velocity.x, particle.velocity.y );
      }
      else if ( particle.top >= container.top ) {

        //TODO handle opening in top

        // particle collided with top wall
        const dy = 2 * Math.abs( container.top - particle.top );
        const newY = particle.location.y - dy;
        particle.setLocation( particle.location.x, newY );
        particle.setVelocityXY( particle.velocity.x, -particle.velocity.y );
      }
      else if ( particle.bottom <= container.bottom ) {

        // particle collided with bottom wall
        const dy = 2 * Math.abs( container.bottom - particle.bottom );
        const newY = particle.location.y + dy;
        particle.setLocation( particle.location.x, newY );
        particle.setVelocityXY( particle.velocity.x, -particle.velocity.y );
      }
    }
  }

  return gasProperties.register( 'ParticleContainerCollider', ParticleContainerCollider );
} );