// Copyright 2019, University of Colorado Boulder

/**
 * Model for all types of particles.
 * NOTE: Since there can be a large number of Particles, all Vector2 fields herein are mutated for performance reasons.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const Property = require( 'AXON/Property' );
  const Vector2 = require( 'DOT/Vector2' );

  class Particle {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = _.extend( {
        location: null, // {Vector2|null} initial location in nm, null defaults to (0,0)
        mass: 1, // AMU
        radius: 1, // nm
        colorProperty: null // {Property.<Color|string>|null}
      }, options );

      options.location = options.location || new Vector2( 0, 0 );

      // @public
      this.location = options.location.copy(); // make a copy because we'll be mutating this.location

      // @public (read-only)
      this.previousLocation = this.location.copy(); // location on previous time step
      this.mass = options.mass; // AMU
      this.radius = options.radius; // radians
      this.colorProperty = options.colorProperty || new Property( 'white' );

      // @public (read-only) the particle is initially at rest
      this.velocity = new Vector2( 0, 0 ); // nm / ps
      this.momentum = new Vector2( 0, 0 ); // AMU * nm / ps
      this.kineticEnergy = 0; // AMU * nm^2 / ps^2

      // @public (read-only)
      this.isDisposed = false;
    }

    /**
     * String representation of a Particle.
     * For debugging only, do not rely on format.
     * @returns {string}
     * @public
     */
    toString() {
      return `Particle[location:(${this.location.x},${this.location.y}) mass:${this.mass} radius:${this.radius}]`;
    }

    //TODO can we get rid of this?
    dispose() {
      assert && assert( !this.isDisposed, 'attempted to dispose again' );
      this.isDisposed = true;
    }

    /**
     * Moves the particle by one time step.
     * @param {number} dt - time delta, in ps
     * @public
     */
    step( dt ) {
      this.previousLocation.setXY( this.location.x, this.location.y );
      this.location.setXY( this.location.x + dt * this.velocity.x, this.location.y + dt * this.velocity.y );
    }

    /**
     * Sets the velocity in polar coordinates.
     * As a side effect, updates everything that is a function of velocity.
     *
     * @param {number} magnitude - nm / ps
     * @param {number} angle - in radians
     * @public
     */
    setVelocity( magnitude, angle ) {
      this.velocity.setPolar( magnitude, angle );

      // P = m * v
      this.momentum.setXY( this.velocity.x * this.mass, this.velocity.y * this.mass );

      // KE = (1/2) * m * |v|^2
      this.kineticEnergy = 0.5 * this.mass * this.velocity.magnitudeSquared;
    }

    /**
     * Does this particle contact another particle now?
     * @param {Particle} particle
     * @returns {boolean}
     */
    contacts( particle ) {
      return this.location.distance( particle.location ) <= ( this.radius + particle.radius );
    }

    //TODO does this do what Java implementation claims?
    /**
     * Did this particle contact another particle on the previous time step?
     * According to the Java implementation, using this check to prevent a collision in such cases makes
     * the behavior of collisions much more natural looking.
     * @param {Particle} particle
     * @returns {boolean}
     */
    contacted( particle ) {
      return this.previousLocation.distance( particle.previousLocation ) <= ( this.radius + particle.radius );
    }

    /**
     * Gets the center of mass of a collection of particles.
     * @param {Particle[]} particles
     * @returns {Vector2|null} null if there are no particles and therefore no center of mass
     * @public
     */
    static getCenterOfMass( particles ) {
      let centerOfMass = null;
      if ( particles.length > 0 ) {
        centerOfMass = new Vector2( 0, 0 ); // this vector is mutated!
        for ( let i = 0; i < particles.length; i++ ) {
          centerOfMass.add( particles[ i ].locationProperty.value );
        }
        centerOfMass.divideScalar( particles.length );
      }
      return centerOfMass;
    }
  }

  return gasProperties.register( 'Particle', Particle );
} );