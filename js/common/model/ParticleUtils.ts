// Copyright 2019-2022, University of Colorado Boulder

/**
 * ParticleUtils is a set of utility methods related to collections of Particles.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesQueryParameters from '../GasPropertiesQueryParameters.js';
import IdealGasLawContainer from './IdealGasLawContainer.js';
import Particle from './Particle.js';

const ParticleUtils = {

  /**
   * Steps a collection of particles.
   * @param particles
   * @param dt - time step in ps
   */
  stepParticles( particles: Particle[], dt: number ): void {
    assert && assert( dt > 0, `invalid dt: ${dt}` );

    for ( let i = particles.length - 1; i >= 0; i-- ) {
      particles[ i ].step( dt );
    }
  },

  /**
   * Removes a particle from an array and disposes it.
   */
  removeParticle: function( particle: Particle, particles: Particle[] ): void {

    const index = particles.indexOf( particle );
    assert && assert( index !== -1, 'particle not found' );

    particles.splice( index, 1 );
    particle.dispose();
  },

  /**
   * Removes the last n particles from an array and disposes them.
   */
  removeLastParticles: function( n: number, particles: Particle[] ): void {
    assert && assert( n <= particles.length,
      `attempted to remove ${n} particles, but we only have ${particles.length} particles` );

    for ( let i = 0; i < n; i++ ) {
      ParticleUtils.removeParticle( particles[ particles.length - 1 ], particles );
    }
  },

  /**
   * Removes and disposes an entire collection of particles.
   */
  removeAllParticles: function( particles: Particle[] ): void {
    ParticleUtils.removeLastParticles( particles.length, particles );
  },

  /**
   * Removes particles that are out of bounds and disposes them.
   */
  removeParticlesOutOfBounds: function( particles: Particle[], bounds: Bounds2 ): void {

    // Iterate backwards, since we're modifying the array, so we don't skip any particles.
    for ( let i = particles.length - 1; i >= 0; i-- ) {
      if ( !particles[ i ].intersectsBounds( bounds ) ) {
        ParticleUtils.removeParticle( particles[ i ], particles );
      }
    }
  },

  /**
   * Redistributes particles in the horizontal dimension.
   * @param particles
   * @param scaleX - amount to scale the position's x component
   */
  redistributeParticles: function( particles: Particle[], scaleX: number ): void {
    assert && assert( scaleX > 0, `invalid scaleX: ${scaleX}` );

    for ( let i = particles.length - 1; i >= 0; i-- ) {
      particles[ i ].position.setX( scaleX * particles[ i ].position.x );
    }
  },

  /**
   * Heats or cools a collection of particles.
   * @param particles
   * @param heatCoolFactor - (-1,1), heat=[0,1), cool=(-1,0]
   */
  heatCoolParticles: function( particles: Particle[], heatCoolFactor: number ): void {
    assert && assert( heatCoolFactor >= -1 && heatCoolFactor <= 1, `invalid heatCoolFactor: ${heatCoolFactor}` );

    const velocityScale = 1 + heatCoolFactor / GasPropertiesQueryParameters.heatCool;
    for ( let i = particles.length - 1; i >= 0; i-- ) {
      particles[ i ].scaleVelocity( velocityScale );
    }
  },

  /**
   * Identifies particles that have escaped via the opening in the top of the container, and
   * moves them from insideParticles to outsideParticles.
   * @param container
   * @param numberOfParticlesProperty - number of particles inside the container
   * @param insideParticles - particles inside the container
   * @param outsideParticles - particles outside the container
   */
  escapeParticles: function( container: IdealGasLawContainer, numberOfParticlesProperty: Property<number>,
                             insideParticles: Particle[], outsideParticles: Particle[] ): void {

    // Iterate backwards, since we're modifying the array, so we don't skip any particles.
    for ( let i = insideParticles.length - 1; i >= 0; i-- ) {
      const particle = insideParticles[ i ];
      if ( particle.top > container.top &&
           particle.left > container.getOpeningLeft() &&
           particle.right < container.getOpeningRight() ) {
        insideParticles.splice( insideParticles.indexOf( particle ), 1 );
        numberOfParticlesProperty.value--;
        outsideParticles.push( particle );
      }
    }
  },

  /**
   * Gets the total kinetic energy of a collection of particles, in AMU * pm^2 / ps^2
   */
  getTotalKineticEnergy: function( particles: Particle[] ): number {

    let totalKineticEnergy = 0;
    for ( let i = particles.length - 1; i >= 0; i-- ) {
      totalKineticEnergy += particles[ i ].getKineticEnergy();
    }
    return totalKineticEnergy;
  },

  /**
   * Gets the centerX of mass for a collection of particles.
   * null if there are no particles and therefore no center of mass
   */
  getCenterXOfMass: function( particles: Particle[] ): number | null {

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