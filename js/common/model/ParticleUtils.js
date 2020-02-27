// Copyright 2019-2020, University of Colorado Boulder

/**
 * ParticleUtils is a set of utility methods related to collections of Particles.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesQueryParameters from '../GasPropertiesQueryParameters.js';
import IdealGasLawContainer from './IdealGasLawContainer.js';
import Particle from './Particle.js';

const ParticleUtils = {

  /**
   * Steps a collection of particles.
   * @param {Particle[]} particles
   * @param {number} dt - time step in ps
   * @public
   */
  stepParticles( particles, dt ) {
    assert && assert( Array.isArray( particles ), `invalid particles: ${particles}` );
    assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );

    for ( let i = particles.length - 1; i >= 0; i-- ) {
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
    assert && assert( particle instanceof Particle, `invalid particle: ${particle}` );
    assert && assert( Array.isArray( particles ), `invalid particles: ${particles}` );

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
  removeLastParticles: function( n, particles ) {
    assert && assert( n <= particles.length,
      `attempted to remove ${n} particles, but we only have ${particles.length} particles` );
    assert && assert( Array.isArray( particles ), `invalid particles: ${particles}` );

    for ( let i = 0; i < n; i++ ) {
      ParticleUtils.removeParticle( particles[ particles.length - 1 ], particles );
    }
  },

  /**
   * Removes and disposes an entire collection of particles.
   * @param {Particle[]} particles
   * @public
   */
  removeAllParticles: function( particles ) {
    assert && assert( Array.isArray( particles ), `invalid particles: ${particles}` );

    ParticleUtils.removeLastParticles( particles.length, particles );
  },

  /**
   * Removes particles that are out of bounds and disposes them.
   * @param {Particle[]} particles
   * @param {Bounds2} bounds
   * @public
   */
  removeParticlesOutOfBounds: function( particles, bounds ) {
    assert && assert( Array.isArray( particles ), `invalid particles: ${particles}` );
    assert && assert( bounds instanceof Bounds2, `invalid bounds: ${bounds}` );

    // Iterate backwards, since we're modifying the array, so we don't skip any particles.
    for ( let i = particles.length - 1; i >= 0; i-- ) {
      if ( !particles[ i ].intersectsBounds( bounds ) ) {
        ParticleUtils.removeParticle( particles[ i ], particles );
      }
    }
  },

  /**
   * Redistributes particles in the horizontal dimension.
   * @param {Particle[]} particles
   * @param {number} scaleX - amount to scale the position's x component
   * @public
   */
  redistributeParticles: function( particles, scaleX ) {
    assert && assert( Array.isArray( particles ), `invalid particles: ${particles}` );
    assert && assert( typeof scaleX === 'number' && scaleX > 0, `invalid scaleX: ${scaleX}` );

    for ( let i = particles.length - 1; i >= 0; i-- ) {
      particles[ i ].position.setX( scaleX * particles[ i ].position.x );
    }
  },

  /**
   * Heats or cools a collection of particles.
   * @param {Particle[]} particles
   * @param {number} heatCoolFactor - (-1,1), heat=[0,1), cool=(-1,0]
   * @public
   */
  heatCoolParticles: function( particles, heatCoolFactor ) {
    assert && assert( Array.isArray( particles ), `invalid particles: ${particles}` );
    assert && assert( typeof heatCoolFactor === 'number' && heatCoolFactor >= -1 && heatCoolFactor <= 1,
      `invalid heatCoolFactor: ${heatCoolFactor}` );

    const velocityScale = 1 + heatCoolFactor / GasPropertiesQueryParameters.heatCool;
    for ( let i = particles.length - 1; i >= 0; i-- ) {
      particles[ i ].scaleVelocity( velocityScale );
    }
  },

  /**
   * Identifies particles that have escaped via the opening in the top of the container, and
   * moves them from insideParticles to outsideParticles.
   * @param {IdealGasLawContainer} container
   * @param {NumberProperty} numberOfParticlesProperty - number of particles inside the container
   * @param {Particle[]} insideParticles - particles inside the container
   * @param {Particle[]} outsideParticles - particles outside the container
   * @public
   */
  escapeParticles: function( container, numberOfParticlesProperty, insideParticles, outsideParticles ) {
    assert && assert( container instanceof IdealGasLawContainer, `invalid container: ${container}` );
    assert && assert( numberOfParticlesProperty instanceof NumberProperty,
      `invalid numberOfParticlesProperty: ${numberOfParticlesProperty}` );
    assert && assert( Array.isArray( insideParticles ), `invalid insideParticles: ${insideParticles}` );
    assert && assert( Array.isArray( outsideParticles ), `invalid outsideParticles: ${outsideParticles}` );

    // Iterate backwards, since we're modifying the array, so we don't skip any particles.
    for ( let i = insideParticles.length - 1; i >= 0; i-- ) {
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
   * Gets the total kinetic energy of a collection of particles.
   * @param {Particle[]} particles
   * @returns {number} in AMU * pm^2 / ps^2
   * @public
   */
  getTotalKineticEnergy: function( particles ) {
    assert && assert( Array.isArray( particles ), `invalid particles: ${particles}` );

    let totalKineticEnergy = 0;
    for ( let i = particles.length - 1; i >= 0; i-- ) {
      totalKineticEnergy += particles[ i ].getKineticEnergy();
    }
    return totalKineticEnergy;
  },

  /**
   * Gets the centerX of mass for a collection of particles.
   * @param {Particle[]} particles
   * @returns {number|null} null if there are no particles and therefore no center of mass
   * @public
   */
  getCenterXOfMass: function( particles ) {
    assert && assert( Array.isArray( particles ), `invalid particles: ${particles}` );

    let centerXOfMass = null;
    if ( particles.length > 0 ) {
      let numerator = 0;
      let totalMass = 0;
      for ( let i = particles.length - 1; i >= 0; i-- ) {
        const particle = particles[ i ];
        numerator += ( particle.mass * particle.position.x );
        totalMass += particle.mass;
      }
      centerXOfMass = numerator / totalMass;
    }
    return centerXOfMass;
  }
};

gasProperties.register( 'ParticleUtils', ParticleUtils );
export default ParticleUtils;