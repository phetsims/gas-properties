// Copyright 2019, University of Colorado Boulder

//TODO #37 JAVA hierarchy is SimpleObservable, ModelElement > Particle > Body > CollidableBody > SphericalBody > SolidSphere > GasMolecule > HeavySpecies, LightSpecies
//TODO optimize by making all Vector2 herein mutable
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

        //TODO should mass be in kg, since other quantities are in kg?
        mass: 1, // u, atomic mass unit, 1 u === 1.66 x 10-27 kg
        radius: 1,
        colorProperty: null
      }, options );

      //JAVA from java.Particle
      this.location = options.location; // {Vector2} m
      this.velocity = options.velocity; // {Vector2} m/s
      this.acceleration = options.acceleration; // {Vector2} m/s^2
      this.previousAcceleration = this.acceleration; // {Vector2} m/s^2

      //JAVA from java.Body
      this.momentum = Vector2.ZERO; // kg * m/s
      this.mass = options.mass; // u
      this.lastCollidedBody = null;  //TODO what is this? Body? Particle?

      //JAVA from java.CollidableBody
      this.collidable = true;
      this.containedBodies = []; //TODO what is this? Body[]? Particle[]?
      this.constraints = []; // {Constraint[]} constraints applied to the particle's state at the end of each step
      this.previousLocation = null;
      this.previousVelocity = null;

      //JAVA from java.SphericalBody
      this.radius = options.radius; // m

      this.colorProperty = options.colorProperty || new Property( 'white' );

      // @public emit is called with no args when Particle has been disposed.
      this.disposedEmitter = new Emitter();
      this.isDisposed = false;
    }

    dispose() {
      assert && assert( !this.isDisposed, 'attempted to dispose again' );
      this.disposedEmitter.emit();
      this.isDisposed = true;
    }

    /**
     * Sets the particle's speed.
     * @returns {number}
     */
    getSpeed() { this.velocity.magnitude(); }

    /**
     * Gets the particle's kinetic energy. This is due to translation only, no rotation.
     * @returns {number}
     */
    getKineticEnergy() {
      return 0.5 * this.mass * this.velocity.magnitudeSquared();
    }

    /**
     * Determines the new state of the particle using the Verlet method
     *
     * @param {number} dt - time delta in seconds
     */
    step( dt ) {

      //TODO JAVA java.CollidableBody
      {
        // Save the location and velocity before they are updated. This information is used in collision calculations.
        this.previousLocation = this.location.copy();
        this.previousVelocity = this.velocity.copy();
      }

      //TODO JAVA java.Particle
      {
        this.location = new Vector2(
          this.location.x + dt * this.velocity.x + dt * dt * this.acceleration.x / 2,
          this.location.y + dt * this.velocity.y + dt * dt * this.acceleration.y / 2
        );

        this.velocity = new Vector2(
          this.velocity.x + dt * ( this.acceleration.x + this.previousAcceleration.x ) / 2,
          this.velocity.y + dt * ( this.acceleration.y + this.previousAcceleration.y ) / 2
        );

        // Acceleration is due to gravity, and will be changed if gravity is changed.

        this.previousAcceleration = this.acceleration.copy();
      }

      //TODO JAVA java.Body
      {
        this.momentum = this.velocity.times( this.mass );
      }
    }

    addContainedBody( body ) {
      assert && assert( !this.containsBody( body ), 'already contains body' );
      this.containedBodies.push( body );
    }

    removeContainedBody( body ) {
      assert && assert( this.containsBody( body ), 'does not contain body' );
      this.containedBodies.splice( this.containedBodies.indexOf( body ), 1 );
    }

    containsBody( body ) {
      return ( this.containedBodies.indexOf( body ) !== -1 );
    }

    getNumberOfContainedBodies() {
      return this.containedBodies.length;
    }

    addConstraint( constraint ) {
      assert && assert( !this.containsConstraint( constraint ), 'already contains constraint' );
      this.constraints.push( constraint );
    }

    removeConstraint( constraint ) {
      assert && assert( this.containsConstraint( constraint ), 'does not contain constraint' );
      this.constraints.splice( this.constraints.indexOf( constraint ), 1 );
    }

    containsConstraint( constraint ) {
      return ( this.constraints.indexOf( constraint ) !== -1 );
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