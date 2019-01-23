// Copyright 2018, University of Colorado Boulder

/**
 * TODO Port of Java class
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const CollisionManager = require( 'GAS_PROPERTIES/port/model/CollisionManager' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const HeavyParticle = require( 'GAS_PROPERTIES/common/model/HeavyParticle' );
  const LightParticle = require( 'GAS_PROPERTIES/common/model/LightParticle' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Range = require( 'DOT/Range' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const BOUNDS = new Bounds2( 0, 0, 600, 600 ); //TODO JAVA what is this? are values appropriate for HTML5 ?

  class IdealGasModel {

    /**
     * @param {CollisionExpert[]} collisionExperts
     */
    constructor( collisionExperts ) {

      //TODO this is not used in Gas Properties, but is desirable to include in the model for future
      // @public acceleration due to gravity, m/s
      this.accelerationDueToGravityProperty = new NumberProperty( 0, {
        range: new Range( 0, 40 ),
        validValue: value => ( value.x === 0 )
      } );
      this.accelerationDueToGravityProperty.link( accelerationDueToGravity => {
        //TODO set acceleration of all particles
      } );

      this.collisionManager = new CollisionManager( this, collisionExperts, BOUNDS );

      // {boolean} true if we're in the step method
      this.stepping = false;

      this.heavyParticles = []; // {HeavyParticle[]}
      this.lightParticles = []; // {LightParticle[]}
    }

    /**
     * Adds a particle.
     * @param {Particle} particle
     */
    addParticle( particle ) {
      if ( particle instanceof HeavyParticle ) {
        assert && assert( this.heavyParticles.indexOf( particle ) === -1, 'particle already exists' );
        this.heavyParticles.push( particle );
      }
      else if ( particle instanceof LightParticle ) {
        assert && assert( this.lightParticles.indexOf( particle ) === -1, 'particle already exists' );
        this.lightParticles.push( particle );
      }
      else {
        throw new Error( 'unsupported particle type: ' + particle );
      }
    }

    /**
     * Removes a particle.
     * @param {Particle} particle
     */
    removeParticle( particle ) {
      if ( particle instanceof HeavyParticle ) {
        assert && assert( this.heavyParticles.indexOf( particle ) !== -1, 'particle not found' );
        this.heavyParticles.splice( this.heavyParticles.indexOf( particle ), 1 );
      }
      else if ( particle instanceof LightParticle ) {
        assert && assert( this.lightParticles.indexOf( particle ) !== -1, 'particle not found' );
        this.lightParticles.splice( this.lightParticles.indexOf( particle ), 1 );
      }
      else {
        throw new Error( 'unsupported particle type: ' + particle );
      }
    }

    /**
     * Moves the model forward one time step.
     * @param {number} dt - time delta in seconds
     */
    step( dt ) {
      this.stepping = true;

      //TODO uncomment me when more of step is fleshed out
      // const totalEnergyBefore = this.getTotalEnergy();

      const particles = this.heavyParticles.concat( this.lightParticles );

      this.applyExternalForces( particles );
      this.applyHeaterCooler( particles );
      this.stepParticles( dt, particles );

      this.collisionManager.step( dt );

      //TODO JAVA port more of IdealGasModel.stepInTime

      this.stepping = false;
    }

    /**
     * Gets the total energy in the system.
     * @returns {number} TODO units
     */
    getTotalEnergy() {
      return 0; //TODO
    }

    /**
     * Moves a collection of particles forward one time step.
     * @param {number} dt - time delta in seconds
     * @param {Particle[]} particles
     */
    stepParticles( dt, particles ) {
      for ( let i = 0; i < particles.length; i++ ) {
        particles[ i ].step( dt );
      }
    }

    /**
     * Applies external forces (e.g. gravity) to a collection of particles.
     * @param {Particle[]} particles
     */
    applyExternalForces( particles ) {

      // Clear the acceleration for all particles
      for ( let i = 0; i < particles.length; i++ ) {
        particles[ i ].acceleration = Vector2.ZERO;
      }

      // Apply external forces to all particles, which currently includes only gravity.
      for ( let i = 0; i < particles.length; i++ ) {
        particles[ i ].acceleration.add( this.accelerationDueToGravityProperty.value );
      }
    }

    /**
     * Heats or cools a collection of particles.
     * @param {Particle[]} particles
     */
    applyHeaterCooler( particles ) {
      return; //TODO
    }
  }

  return gasProperties.register( 'IdealGasModel', IdealGasModel );
} );