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
  const GasPropertiesUtils = require( 'GAS_PROPERTIES/common/GasPropertiesUtils' );

  class Region {

    /**
     * @param {Bounds2} bounds
     */
    constructor( bounds ) {

      // @public (read-only)
      this.bounds = bounds;

      // @public (read-only)
      this.particles = []; // {Particle[]}
      this.container = null; // {Container}
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
     * Does a wall of the container intersect this region?
     * @param {Container} container
     * @returns {boolean}
     * @public
     */
    intersectsContainer( container ) {
      return GasPropertiesUtils.lineSegmentIntersectsBounds( container.left, container.top, container.left, container.bottom, this.bounds ) || // left wall
             GasPropertiesUtils.lineSegmentIntersectsBounds( container.right, container.top, container.right, container.bottom, this.bounds ) || // right wall
             GasPropertiesUtils.lineSegmentIntersectsBounds( container.left, container.top, container.right, container.top, this.bounds ) || // top wall
             GasPropertiesUtils.lineSegmentIntersectsBounds( container.left, container.bottom, container.right, container.bottom, this.bounds ); // bottom wall
    }

    /**
     * Assigns a container to this Region.
     * @param {Container} container
     * @public
     */
    setContainer( container ) {
      assert && assert( !this.container, 'Region already has a container' );
      this.container = container;
    }

    /**
     * Removes all objects from this Region. Does not affect existence of objects in the model.
     * @public
     */
    clear() {
      this.particles.length = 0;
      this.container = null;
    }
  }

  return gasProperties.register( 'Region', Region );
} );