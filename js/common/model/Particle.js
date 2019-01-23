// Copyright 2019, University of Colorado Boulder

//TODO #37 JAVA hierarchy is SimpleObservable, ModelElement > Particle > Body > CollidableBody > SphericalBody > SolidSphere > GasMolecule > HeavySpecies, LightSpecies
//TODO JAVA delete stuff that isn't used in Gas Properties
/**
 * Model for all types of particles.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
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
        mass: 1, // u, atomic mass unit
        radius: 1
      }, options );

      //JAVA from java.Particle
      this.location = options.location;
      this.velocity = options.velocity;
      this.acceleration = options.acceleration;
      this.previousAcceleration = this.acceleration;

      //JAVA from java.Body
      this.momentum = Vector2.ZERO;
      this.mass = options.mass;
      this.lastCollidedBody = null;  //TODO what is this? Body? Particle?

      //JAVA from java.CollidableBody
      this.collidable = true;
      this.containedBodies = []; //TODO what is this? Body[]? Particle[]?
      this.constraints = []; // {Constraint[]} constraints applied to the particle's state at the end of each step
      this.previousLocation = null;
      this.previousVelocity = null;

      //JAVA from java.SphericalBody
      this.radius = options.radius;
      this.momentOfInertia = this.mass * this.radius * this.radius * 2 / 5;
    }

    /**
     * Sets the particle's speed.
     * @returns {number}
     */
    getSpeed() { this.velocity.magnitude(); }

    /**
     * Determines the new state of the particle using the Verlet method
     *
     * @param {number} dt - time delta in seconds
     */
    step( dt ) {

      // java.CollidableBody
      {
        // Save the location and velocity before they are updated. This information is used in collision calculations.
        this.previousLocation = new Vector2( this.locationProperty.x, this.locationProperty.y );
        this.previousVelocity = new Vector2( this.velocityProperty.x, this.velocityProperty.y );
      }

      // java.Particle
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

        this.previousAcceleration = new Vector2( this.acceleration.x, this.acceleration.y );
      }

      // java.Body
      {
        this.momentum = this.velocityProperty.value.times( this.mass );
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