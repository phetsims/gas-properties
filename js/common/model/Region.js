// Copyright 2019, University of Colorado Boulder

/**
 * Spatial partitioning is a technique for improving the performance of collision detection.
 * The collision detection bounds are partitioning into a 2D grid of Regions. Objects (particles and
 * containers) are members of one or more regions based on whether they intersect the bounds of the region.
 * Rather than having to consider collisions between every object in the system, only objects within the
 * same region need to be considered.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );

  class Region {

    /**
     * @param {Bounds2} bounds - bounds of the region, in pm
     */
    constructor( bounds ) {

      // @public (read-only) {Bounds2}
      this.bounds = bounds;

      // @public (read-only) {Particle[]}
      this.particles = [];
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