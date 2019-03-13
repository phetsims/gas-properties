// Copyright 2019, University of Colorado Boulder

//TODO port of Java class, integrate bits into HTML5, then delete
/**
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const CollisionManager = require( 'GAS_PROPERTIES/common/model/CollisionManager' );
  const Container = require( 'GAS_PROPERTIES/common/model/Container' );
  const Emitter = require( 'AXON/Emitter' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Range = require( 'DOT/Range' );

  class IdealGasModel {

    constructor() {

      this.container = new Container();

      this.heaterScaleProperty = new NumberProperty( 0, {
        range: new Range( -1, 1 )
      } );

      this.collisionManager = new CollisionManager( this );

      this.heavyParticles = []; // {HeavyParticle[]}
      this.lightParticles = []; // {LightParticle[]}

      // @public emit() when step method has completed
      this.steppedEmitter = new Emitter();
    }

    /**
     * Moves the model forward one time step.
     * @param {number} dt - time delta, in seconds
     */
    step( dt ) {

      // Put all particles in one array.
      const particles = this.heavyParticles.concat( this.lightParticles );

      // Get the kinetic energy in the system before anything happens.
      const preKE = getKineticEnergy( particles );

      // Determine how heat/cold contributes to kinetic energy.
      const heaterKE = getKineticEnergyDueToHeater( particles, this.heaterScaleProperty.value );

      // Step all particles.
      stepParticles( particles, dt );

      // Do collision detection.
      this.collisionManager.step( dt );

      //TODO what is going on here?
      const postKE = getKineticEnergy( particles );
      if ( postKE !== 0 ) {

        const deltaKE = postKE - ( preKE + heaterKE );
        const r0 = deltaKE / postKE;
        const ratio = Math.sqrt( 1 - r0 );

        // Adjust the energy of all particles
        if ( preKE !== 0 && ratio !== 1 && !isNaN( ratio ) ) {
          for ( let i = 0; i < particles.length; i++ ) {
            particles[ i ].velocity.times( ratio );
          }
        }
      }

      // Remove any molecules from the system that have escaped from the box
      this.removeEscapedMolecules();

      // Compute some useful statistics
      this.computeStatistics();

      // Update either pressure or volume
      this.updateFreeParameter();

      // Notify observers
      this.steppedEmitter.emit();
    }

    /**
     * Removes any molecules from the system that have escaped the container.
     * @private
     */
    removeEscapedMolecules() {
      //TODO implement removeEscapedMolecules
    }

    /**
     * Computes some useful statistics.
     * @private
     */
    computeStatistics() {
      //TODO implement computeStatistics
    }

    /**
     * Updates either pressure or volume.
     */
    updateFreeParameter() {
      //TODO implement updateFreeParameter
    }
  }

  /**
   * Steps a collection of particles.
   * @param {Particle} particles
   * @param {number} dt - time in seconds
   */
  function stepParticles( particles, dt ) {
    for ( let i = 0; i < particles.length; i++ ) {
      particles[ i ].step( dt );
    }
  }

  /**
   * Gets the kinetic total energy for a collection of particles.
   * @param {Particle[]} particles
   * @returns {number}
   */
  function getKineticEnergy( particles ) {
    let total = 0;
    for ( let i = 0; i < particles.length; i++ ) {
      total += particles[ i ].getKineticEnergy();
    }
    return total;
  }

  /**
   * Gets the change in kinetic energy that is due to applying heat or cold to the system.
   * @param {Particle[]} particles
   * @param {number} heatScale [-1,1]
   * @returns {number}
   */
  function getKineticEnergyDueToHeater( particles, heatScale ) {
    let kineticEnergy = 0;
    if ( heatScale !== 0 ) {
      for ( let i = 0; i < particles.length; i++ ) {
        const particle = particles[ i ];
        const preKE = particle.getKineticEnergy();
        particle.velocity.times( 1.1 * heatScale ); //TODO magic number, probably not appropriate for HTML5
        kineticEnergy += particle.getKineticEnergy() - preKE;
      }
    }
    return kineticEnergy;
  }

  return gasProperties.register( 'IdealGasModel', IdealGasModel );
} );