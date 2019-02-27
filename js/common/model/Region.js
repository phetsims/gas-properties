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

      // @public (read-only)
      this.bounds = bounds;

      // @public (read-only)
      this.particles = []; // {Particle[]}
      this.containers = []; // {Container[]}
    }

    //TODO include particle's radius?
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

    //TODO include container's wall thickness?
    /**
     * Does this region and a container intersect?
     * @param {Container} container
     * @returns {boolean}
     * @public
     */
    intersectsContainer( container ) {
      return true;  //TODO
    }

    /**
     * Adds a container to this Region.
     * @param {Container} container
     * @public
     */
    addContainer( container ) {
      assert && assert( this.containers.indexOf( container ) === -1, 'container is already in this Region' );
      this.containers.push( container );
    }

    /**
     * Removes all objects from this Region. Does not affect existence of objects in the model.
     * @public
     */
    clear() {
      this.particles.length = 0;
      this.containers.length = 0;
    }
  }

  return gasProperties.register( 'Region', Region );
} );