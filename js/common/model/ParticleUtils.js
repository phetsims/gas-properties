// Copyright 2019, University of Colorado Boulder

/**
 * Utility methods related to Particles or collections of Particles, used primarily by BaseModel and its subclasses.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesContainer = require( 'GAS_PROPERTIES/common/model/GasPropertiesContainer' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const Particle = require( 'GAS_PROPERTIES/common/model/Particle' );

  const ParticleUtils = {

    /**
     * Steps a collection of particles.
     * @param {Particle[]} particles
     * @param {number} dt - time step in ps
     * @public
     */
    stepParticles( particles, dt ) {
      for ( let i = 0; i < particles.length; i++ ) {
        particles[ i ].step( dt );
      }
    },

    /**
     * Removes a particle from an array and disposes it.
     * @param {Particle} particle
     * @param {Particle[]} particles
     * @public
     */
    removeParticle: function( particle, particles ) {
      assert && assert( particle instanceof Particle, `not a Particle: ${particle}` );
      const index = particles.indexOf( particle );
      assert && assert( index !== -1, 'particle not found' );
      particles.splice( index, 1 );
      particle.dispose();
    },

    /**
     * Removes the last n particles from an array and disposes them.
     * @param {number} n
     * @param {Particle[]} particles
     * @public
     */
    removeParticles: function( n, particles ) {
      assert && assert( n <= particles.length,
        `attempted to remove ${n} particles, but we only have ${particles.length} particles` );
      const particlesToRemove = particles.slice( particles.length - n, particles.length );
      for ( let i = 0; i < particlesToRemove.length; i++ ) {
        ParticleUtils.removeParticle( particlesToRemove[ i ], particles );
      }
    },

    /**
     * Removes and disposes an entire collection of particles.
     * @param {Particle[]} particles
     * @public
     */
    removeAllParticles: function( particles ) {
      ParticleUtils.removeParticles( particles.length, particles );
    },

    /**
     * Removes particles that are out of bounds and disposes them.
     * @param {Particle[]} particles
     * @param {Bounds2} bounds
     * @public
     */
    removeParticlesOutOfBounds: function( particles, bounds ) {
      for ( let i = 0; i < particles.length; i++ ) {
        if ( !particles[ i ].intersectsBounds( bounds ) ) {
          ParticleUtils.removeParticle( particles[ i ], particles );
        }
      }
    },

    /**
     * Redistributes particles in the horizontal dimension.
     * @param {Particle[]} particles
     * @param {number} ratio
     * @public
     */
    redistributeParticles: function( particles, ratio ) {
      assert && assert( ratio > 0, `invalid ratio: ${ratio}` );
      for ( let i = 0; i < particles.length; i++ ) {
        particles[ i ].location.setX( ratio * particles[ i ].location.x );
      }
    },

    /**
     * Heats or cools a collection of particles.
     * @param {Particle[]} particles
     * @param {number} heatCoolFactor - (-1,1), heat=[0,1), cool=(-1,0]
     * @public
     */
    heatCoolParticles: function( particles, heatCoolFactor ) {
      assert && assert( heatCoolFactor >= -1 && heatCoolFactor <= 1, `invalid heatCoolFactor: ${heatCoolFactor}` );
      const velocityScale = 1 + heatCoolFactor / GasPropertiesQueryParameters.heatCool;
      for ( let i = 0; i < particles.length; i++ ) {
        particles[ i ].scaleVelocity( velocityScale );
      }
    },

    /**
     * Identifies particles that have escaped via the opening in the top of the container, and
     * moves them from insideParticles to outsideParticles.
     * @param {GasPropertiesContainer} container
     * @param {NumberProperty} numberOfParticlesProperty - number of particles inside the container
     * @param {Particle[]} insideParticles - particles inside the container
     * @param {Particle[]} outsideParticles - particles outside the container
     * @public
     */
    escapeParticles: function( container, numberOfParticlesProperty, insideParticles, outsideParticles ) {
      assert && assert( container instanceof GasPropertiesContainer, `invalid container type: ${container}` );
      for ( let i = 0; i < insideParticles.length; i++ ) {
        const particle = insideParticles[ i ];
        assert && assert( particle instanceof Particle, `invalid particle: ${particle}` );
        if ( particle.top > container.top &&
             particle.left > container.getOpeningLeft() &&
             particle.right < container.openingRight ) {
          insideParticles.splice( insideParticles.indexOf( particle ), 1 );
          numberOfParticlesProperty.value--;
          outsideParticles.push( particle );
        }
      }
    },

    /**
     * Gets the x-axis center of mass for a collection of particles.
     * @param {Particle[]} particles
     * @returns {number|null} null if there are no particles and therefore no center of mass
     * @public
     */
    getCenterXOfMass: function( particles ) {
      if ( particles.length > 0 ) {
        let numerator = 0;
        let totalMass = 0;
        for ( let i = 0; i < particles.length; i++ ) {
          const particle = particles[ i ];
          numerator += ( particle.mass * particle.location.x );
          totalMass += particle.mass;
        }
        return numerator / totalMass;
      }
      else {
        return null;
      }
    }
  };

  return gasProperties.register( 'ParticleUtils', ParticleUtils );
} );