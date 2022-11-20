// Copyright 2019-2022, University of Colorado Boulder

/**
 * Region is one cell in the collection-detection space.
 *
 * Spatial partitioning is a technique for improving the performance of collision detection. The collision detection
 * space is partitioned into a 2D grid of cells that we refer to as regions (the term used in the Java implementation).
 * Objects (particles and containers) are members of one or more regions based on whether they intersect the bounds
 * of the region. Rather than having to consider collisions between every object in the system, only objects within
 * the same region need to be considered.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import gasProperties from '../../gasProperties.js';
import Particle from './Particle.js';

export default class Region {

  /**
   * @param {Bounds2} bounds - bounds of the region, in pm
   */
  constructor( bounds ) {
    assert && assert( bounds instanceof Bounds2, `invalid bounds: ${bounds}` );

    // @public (read-only) {Bounds2}
    this.bounds = bounds;

    // @public (read-only) {Particle[]} the particles in this region
    this.particles = [];
  }

  /**
   * Adds a particle to this region.
   * @param {Particle} particle
   * @public
   */
  addParticle( particle ) {
    assert && assert( particle instanceof Particle, `invalid particle: ${particle}` );
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

gasProperties.register( 'Region', Region );