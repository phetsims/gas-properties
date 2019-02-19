// Copyright 2019, University of Colorado Boulder

/**
 * Model for all types of particles.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const Property = require( 'AXON/Property' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const INITIAL_TEMPERATURE = 300; // K

  class Particle {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = _.extend( {
        mass: 1, // AMU
        radius: 1, // nm
        colorProperty: null, // {null|Property.<Color|string>}
        location: Vector2.ZERO,
        velocityAngle: 0 // initial velocity angle, in radians
      }, options );

      // @public (read-only)
      this.mass = options.mass;
      this.radius = options.radius;
      this.colorProperty = options.colorProperty || new Property( 'white' );

      // The initial velocity magnitude corresponds to INITIAL_TEMPERATURE.
      // KE = (3/2)kT = (1/2) * m * v^2, so v = sqrt( 3kT / m )
      const velocityMagnitude = Math.sqrt( 3 * GasPropertiesConstants.BOLTZMANN * INITIAL_TEMPERATURE / this.mass );

      // @public Vector2 fields will be mutated!
      this.location = options.location.copy();
      this.velocity = Vector2.createPolar( velocityMagnitude, options.velocityAngle );
      this.acceleration = new Vector2( 0, 0 );
      this.momentum = this.velocity.times( this.mass );

      // @public (read-only)
      this.isDisposed = false;
    }

    //TODO can we get rid of this?
    dispose() {
      assert && assert( !this.isDisposed, 'attempted to dispose again' );
      this.isDisposed = true;
    }

    /**
     * Gets the particle's speed.
     * @returns {number}
     */
    getSpeed() { this.velocity.magnitude; }

    get speed() { return this.getSpeed(); }

    /**
     * Gets the particle's kinetic energy. This is due to translation only, there is no rotation.
     * @returns {number} AMU * nm^2 / ps^2
     */
    getKineticEnergy() {
      return 0.5 * this.mass * this.velocity.magnitudeSquared();
    }

    get kineticEnergy() { return this.getKineticEnergy(); }

    /**
     * Moves the particle by one time step.
     * @param {number} dt - time delta, in ps
     */
    step( dt ) {

      this.location.setXY(
        this.location.x + dt * this.velocity.x + dt * dt * this.acceleration.x / 2,
        this.location.y + dt * this.velocity.y + dt * dt * this.acceleration.y / 2
      );

      this.velocity.setXY(
        this.velocity.x + dt * this.acceleration.x,
        this.velocity.y + dt * this.acceleration.y
      );

      // P = m * v
      this.momentum.setXY( this.velocity.x * this.mass, this.velocity.y * this.mass );
    }

    /**
     * Gets the center of mass of a collection of particles.
     * @param {Particle[]} particles
     * @returns {Vector2|null} null if there are no particles and therefore no center of mass
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