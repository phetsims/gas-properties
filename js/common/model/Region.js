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
  const Util = require( 'DOT/Util' );

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
      return this.lineSegmentIntersectsBounds( container.left, container.top, container.left, container.bottom, this.bounds ) || // left wall
             this.lineSegmentIntersectsBounds( container.right, container.top, container.right, container.bottom, this.bounds ) || // right wall
             this.lineSegmentIntersectsBounds( container.left, container.top, container.right, container.top, this.bounds ) || // top wall
             this.lineSegmentIntersectsBounds( container.left, container.bottom, container.right, container.bottom, this.bounds ); // bottom wall
    }

    /**
     * Determines whether a line segment intersects a bounds.
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {Bounds2} bounds
     * @returns {boolean}
     * @private
     */
    lineSegmentIntersectsBounds( x1, y1, x2, y2, bounds ) {
      return bounds.containsCoordinates( x1, y1 ) ||
             bounds.containsCoordinates( x2, y2 ) ||
             Util.lineSegmentIntersection( x1, y1, x2, y2, bounds.left, bounds.top, bounds.left, bounds.bottom ) ||
             Util.lineSegmentIntersection( x1, y1, x2, y2, bounds.right, bounds.top, bounds.right, bounds.bottom ) ||
             Util.lineSegmentIntersection( x1, y1, x2, y2, bounds.left, bounds.top, bounds.right, bounds.top ) ||
             Util.lineSegmentIntersection( x1, y1, x2, y2, bounds.left, bounds.bottom, bounds.right, bounds.bottom );
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