// Copyright 2019, University of Colorado Boulder

/**
 * Spatial partitioning is a technique for improving the performance of collision detection.
 * The collision detection bounds are partitioning into a grid of overlapping Regions. Particles are
 * members of one or more Regions based on their location. Rather than having to consider collisions
 * between a particle and every other particle, only particles within the same Region need be considered.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );

  class Region {

    /**
     * @param {Bounds2} bounds
     */
    constructor( bounds ) {

      // @public (read-only)
      this.bounds = bounds;

      // @public (read-only)
      this.particles = [];
    }

    /**
     * Is the specified point in this Region?
     * @param {Vector2} point
     * @returns {boolean}
     * @public
     */
    containsPoint( point ) {
      return this.bounds.containsPoint( point );
    }

    /**
     * Adds a particle to this Region.
     * @param {Particle} particle
     * @public
     */
    addParticle( particle ) {
      assert && assert( !this.containsParticle( particle ), 'particle is already in this Region' );
      this.particles.push( particle );
    }

    /**
     * Is the specified particle in this Region?
     * @param {Particle} particle
     * @returns {boolean}
     * @private
     */
    containsParticle( particle ) {
      return ( this.particles.indexOf( particle ) !== -1 );
    }

    /**
     * Gets the number of particles in this Region.
     * @returns {number}
     * @public
     */
    getNumberOfParticles() {
      return this.particles.length;
    }

    get numberOfParticles() { return this.getNumberOfParticles(); }

    /**
     * Removes all particles from this Region. Does not affect existence of particles in the model.
     * @public
     */
    clear() {
      this.particles.length = 0;
    }
  }

  return gasProperties.register( 'Region', Region );
} );