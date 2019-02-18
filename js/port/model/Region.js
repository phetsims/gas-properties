// Copyright 2019, University of Colorado Boulder

/**
 * TODO port of Java class
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

      // @private
      this.bounds = bounds;
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
     * Is the specified particle in this Region?
     * @param {Particle} particle
     * @public
     */
    containsParticle( particle ) {
      return ( this.particles.indexOf( particle ) !== -1 );
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
     * Removes a particle from this Region.
     * @param {Particle} particle
     * @public
     */
    removeParticle( particle ) {
      assert && assert( this.containsParticle( particle ), 'particle is not in this Region' );
      this.particles.splice( this.particles.indexOf( particle ), 1 );
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
     * Removes all particles from this Region.
     * @public
     */
    clear() {
      this.particles.length = 0;
    }
  }

  return gasProperties.register( 'Region', Region );
} );