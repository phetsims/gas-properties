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
  const Container = require( 'GAS_PROPERTIES/common/model/Container' );
  const Emitter = require( 'AXON/Emitter' );
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

      this.container = new Container();

      this.heaterCoolerProperty = new NumberProperty( 0, {
        range: new Range( -1, 1 )
      } );

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

      //TODO doc
      this.deltaKineticEnergy = 0;

      // @public emit() when step method has completed
      this.steppedEmitter = new Emitter();
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

      // Get the total energy in the system before anything happens.
      const totalEnergyBefore = this.getTotalEnergy();

      const particles = this.heavyParticles.concat( this.lightParticles );

      this.applyExternalForces( particles );
      this.applyHeaterCooler( particles );
      this.stepParticles( dt, particles );

      this.collisionManager.step( dt );

      // Get the total energy in the system, and adjust it if necessary.
      const totalEnergyAfter = this.getTotalEnergy( particles );
      const totalKineticEnergyAfter = this.getTotalKineticEnergy( particles );
      const dE = totalEnergyAfter - ( totalEnergyBefore + this.deltaKineticEnergy );
      const r0 = dE / totalKineticEnergyAfter;
      const ratio = Math.sqrt( 1 - r0 );

      // Clear the added-energy accumulator
      this.deltaKineticEnergy = 0;

      // Adjust the energy of all particles
      if ( totalEnergyBefore !== 0 && ratio !== 1 && !isNaN( ratio ) ) {
        for ( let i = 0; i < particles.length; i++ ) {
          const particle = particles[ i ];
          if ( particle.getKineticEnergy() > 0 ) {
            particle.velocity = particle.velocity.times( ratio );
          }
        }
      }

      // Remove any molecules from the system that have escaped the box
      this.removeEscapedMolecules();

      // Compute some useful statistics
      this.computeStatistics();

      // Update either pressure or volume
      this.updateFreeParameter();

      this.stepping = false;

      // Notify observers
      this.steppedEmitter.emit();
    }

    /**
     * Applies external forces (e.g. gravity) to a collection of particles.
     * @param {Particle[]} particles
     * @private
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
     * Heats or cools a collection of particles, adding kinetic energy to the system.
     * @param {Particle[]} particles
     * @private
     */
    applyHeaterCooler( particles ) {
      assert && assert( this.stepping, 'should only be called from step' );
      const heaterCoolerValue = this.heaterCoolerProperty.value;
      if ( heaterCoolerValue !== 0 ) {
        for ( let i = 0; i < particles.length; i++ ) {
          const particle = particles[ i ];
          const preKE = particle.getKineticEnergy();
          particle.velocity.times( 1.1 * heaterCoolerValue ); //TODO magic number
          this.deltaKineticEnergy += particle.getKineticEnergy() - preKE;
        }
      }
    }

    /**
     * Moves a collection of particles forward one time step.
     * @param {number} dt - time delta in seconds
     * @param {Particle[]} particles
     * @private
     */
    stepParticles( dt, particles ) {
      for ( let i = 0; i < particles.length; i++ ) {
        particles[ i ].step( dt );
      }
    }

    /**
     * Gets the total energy in the system.
     * @param {Particle[]} particles
     * @returns {number}
     * @private
     */
    getTotalEnergy( particles ) {
      let total = 0;
      for ( let i = 0; i < particles.length; i++ ) {
        total += this.getParticleTotalEnergy( particles[ i ] );
      }
      return total;
    }

    /**
     * Gets the total energy of one particle.
     * @param {Particle} particle
     * @returns {number}
     * @private
     */
    getParticleTotalEnergy( particle ) {
      return particle.getKineticEnergy() + this.getParticlePotentialEnergy( particle );
    }

    /**
     * Gets the potential energy of one particle.
     * @param particle
     * @returns {number}
     * @private
     */
    getParticlePotentialEnergy( particle ) {
      let potentialEnergy = 0;
      if ( this.accelerationDueToGravityProperty.value !== 0 ) {
        const distanceFromBottomOfContainer = particle.locationProperty.value.y - this.container.locationProperty.value.y;
        potentialEnergy = distanceFromBottomOfContainer * this.accelerationDueToGravityProperty.value * particle.mass;
      }
      return potentialEnergy;
    }

    /**
     * Gets the total kinetic energy for a collection of particles.
     * @param {Particle[]} particles
     * @returns {number}
     * @private
     */
    getTotalKineticEnergy( particles ) {
      let total = 0;
      for ( let i = 0; i < particles.length; i++ ) {
        total += particles[ i ].getKineticEnergy();
      }
      return total;
    }

    /**
     * Removes any molecules from the system that have escaped the container.
     * @private
     */
    removeEscapedMolecules() {
      //TODO
    }

    /**
     * Computes some useful statistics.
     * @private
     */
    computeStatistics() {
      //TODO
    }

    /**
     * Updates either pressure or volume.
     */
    updateFreeParameter() {
      //TODO
    }
  }

  return gasProperties.register( 'IdealGasModel', IdealGasModel );
} );