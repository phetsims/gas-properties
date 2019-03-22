// Copyright 2019, University of Colorado Boulder

/**
 * Spatial partitioning is a technique for improving the performance of collision detection.
 * The collision detection bounds are partitioning into a 2D grid of Regions. Objects (particles and
 * containers) are members of one or more regions based on whether they intersect the bounds of the region.
 * Rather than having to consider collisions between an object and every other object, only objects within the
 * same region need be considered.
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

      // @public (read-only) {Bounds2}
      this.bounds = bounds;

      // @public (read-only) {Particle[]}
      this.particles = [];
    }

    /**
     * Determines whether this region and a particle's bounding box have any points of intersection,
     * including touching boundaries. Adapted from Bounds2.intersectsBounds, removed Math.max and Math.min
     * calls because this will be called thousands of times in step.
     * @param {Particle} particle
     * @returns {boolean}
     * @public
     */
    intersectsParticle( particle ) {

      //TODO adapted from Bounds2.intersectsBounds, see https://github.com/phetsims/dot/issues/92
      const minX = ( particle.left > this.bounds.minX ) ? particle.left : this.bounds.minX;
      const minY = ( particle.bottom > this.bounds.minY ) ? particle.bottom : this.bounds.minY;
      const maxX = ( particle.right < this.bounds.maxX ) ? particle.right : this.bounds.maxX;
      const maxY = ( particle.top < this.bounds.maxY ) ? particle.top : this.bounds.maxY;
      return ( maxX - minX ) >= 0 && ( maxY - minY >= 0 );
    }

    /**
     * Adds a particle to this Region.
     * @param {Particle} particle
     * @public
     */
    addParticle( particle ) {
      assert && assert( this.particles.indexOf( particle ) === -1, 'particle is already in this Region' );
      this.particles.push( particle );
    }

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