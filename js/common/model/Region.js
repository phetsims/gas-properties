// Copyright 2019, University of Colorado Boulder

/**
 * Spatial partitioning is a technique for improving the performance of collision detection.
 * The collision detection bounds are partitioning into a grid of overlapping Regions. Objects (particles and
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

    //TODO if we consider particle radius (bounding box?), then do we need regionOverlap?
    /**
     * Does this region and a particle intersect?
     * @param {Particle} particle
     * @returns {boolean}
     * @public
     */
    intersectsParticle( particle ) {
      return this.bounds.containsPoint( particle.location );
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