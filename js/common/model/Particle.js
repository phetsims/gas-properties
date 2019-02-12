// Copyright 2019, University of Colorado Boulder

//TODO #37 JAVA hierarchy is SimpleObservable, ModelElement > Particle > Body > CollidableBody > SphericalBody > SolidSphere > GasMolecule > HeavySpecies, LightSpecies
/**
 * Model for all types of particles.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Emitter = require( 'AXON/Emitter' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const Property = require( 'AXON/Property' );
  const Vector2 = require( 'DOT/Vector2' );

  class Particle {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      //TODO units, proper defaults
      options = _.extend( {
        location: Vector2.ZERO,
        velocity: Vector2.ZERO,
        acceleration: Vector2.ZERO,
        mass: 1, // u, atomic mass unit, 1 u === 1.66 x 10-27 kg
        radius: 1,
        colorProperty: null
      }, options );

      // @public Vector2 fields will be mutated!
      this.location = options.location.copy(); // {Vector2} m
      this.velocity = options.velocity.copy(); // {Vector2} m/s
      this.acceleration = options.acceleration.copy(); // {Vector2} m/s^2
      this.momentum = Vector2.ZERO.copy(); // kg * m/s

      // @public (read-only)
      this.mass = options.mass; // u
      this.radius = options.radius; // m
      this.colorProperty = options.colorProperty || new Property( 'white' );
      this.disposedEmitter = new Emitter(); // emit is called with no args when Particle has been disposed.
      this.isDisposed = false;
    }

    dispose() {
      assert && assert( !this.isDisposed, 'attempted to dispose again' );
      this.isDisposed = true;
      this.disposedEmitter.emit();
    }

    /**
     * Gets the particle's speed.
     * @returns {number}
     */
    getSpeed() { this.velocity.magnitude(); }

    get speed() { return this.getSpeed(); }

    /**
     * Gets the particle's kinetic energy. This is due to translation only, no rotation.
     * @returns {number}
     */
    getKineticEnergy() {
      return 0.5 * this.mass * this.velocity.magnitudeSquared();
    }

    get kineticEnergy() { return this.getKineticEnergy(); }

    /**
     * Moves the particle by one time step.
     * @param {number} dt - time delta in seconds
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