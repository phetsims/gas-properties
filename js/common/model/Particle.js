// Copyright 2019, University of Colorado Boulder

//TODO #37 JAVA hierarchy is HeavySpecies, LightSpecies > GasMolecule > SolidSphere > SphericalBody > CollidableBody > Body > Particle > SimpleObservable, ModelElement
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
  const Property = require( 'AXON/Property' );
  const Vector2 = require( 'DOT/Vector2' );

  class Particle {

    /**
     * @param {NumberProperty} gravityProperty
     * @param {Object} [options]
     */
    constructor( gravityProperty, options ) {

      //TODO units, proper defaults
      options = _.extend( {
        location: Vector2.ZERO,
        velocity: Vector2.ZERO,
        acceleration: Vector2.ZERO,
        mass: 1, // u, atomic mass unit
        radius: 1
      }, options );

      this.gravityProperty = gravityProperty;

      //JAVA java.Particle
      this.locationProperty = new Property( options.location );
      this.velocityProperty = new Property( options.velocity );
      this.accelerationProperty = new Property( options.acceleration );
      this.previousAcceleration = this.accelerationProperty.value;

      //JAVA java.Body
      this.momentum = Vector2.ZERO;
      this.mass = options.mass;
      this.lastCollidedBody = null;  //TODO Body? Particle?

      //JAVA java.CollidableBody
      this.collidable = true;
      this.containedBodies = []; //TODO Body[]? Particle[]? what are these?
      this.constraints = []; // {Constraint[]} constraints applied to the particle's state at the end of each step
      this.previousLocation = null;
      this.previousVelocity = null;

      //JAVA java.SphericalBody
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
        const location = this.locationProperty.value;
        const velocity = this.velocityProperty.value;
        const acceleration = this.accelerationProperty.value;

        this.locationProperty.value = new Vector2(
          location.x + dt * velocity.x + dt * dt * acceleration.x / 2,
          location.y + dt * velocity.y + dt * dt * acceleration.y / 2
        );

        this.velocityProperty.value = new Vector2(
          velocity.x + dt * ( acceleration.x + this.previousAcceleration.x ) / 2,
          velocity.y + dt * ( acceleration.y + this.previousAcceleration.y ) / 2
        );

        this.previousAcceleration = new Vector2( acceleration.x, acceleration.y );
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