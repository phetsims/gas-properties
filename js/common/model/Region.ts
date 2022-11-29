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
 * Run with ?regions to display the regions.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import gasProperties from '../../gasProperties.js';
import Particle from './Particle.js';

export default class Region {

  // bounds of the region, in pm
  public readonly bounds: Bounds2;

  // the particles in this region
  public readonly particles: Particle[];

  public constructor( bounds: Bounds2 ) {
    this.bounds = bounds;
    this.particles = [];
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  /**
   * Adds a particle to this region.
   */
  public addParticle( particle: Particle ): void {
    assert && assert( !this.particles.includes( particle ), 'particle is already in this Region' );
    this.particles.push( particle );
  }

  /**
   * Removes all particles from this Region. Does not affect existence of particles in the model.
   */
  public clear(): void {
    this.particles.length = 0;
  }
}

gasProperties.register( 'Region', Region );