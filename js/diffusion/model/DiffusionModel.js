// Copyright 2018-2019, University of Colorado Boulder

/**
 * Model for the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const DiffusionContainer = require( 'GAS_PROPERTIES/diffusion/model/DiffusionContainer' );
  const DiffusionExperiment = require( 'GAS_PROPERTIES/diffusion/model/DiffusionExperiment' );
  const DiffusionParticle1 = require( 'GAS_PROPERTIES/diffusion/model/DiffusionParticle1' );
  const DiffusionParticle2 = require( 'GAS_PROPERTIES/diffusion/model/DiffusionParticle2' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesModel = require( 'GAS_PROPERTIES/common/model/GasPropertiesModel' );
  const NormalTimeTransform = require( 'GAS_PROPERTIES/common/model/NormalTimeTransform' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
  const SlowTimeTransform = require( 'GAS_PROPERTIES/common/model/SlowTimeTransform' );
  const Timescale = require( 'GAS_PROPERTIES/diffusion/model/Timescale' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const CENTER_OF_MASS_OPTIONS = {
    isValidValue: value => ( value === null || typeof value === 'number' )
  };
  const AVERAGE_TEMPERATURE_OPTIONS = {
    isValidValue: value => ( value === null || typeof value === 'number' )
  };

  class DiffusionModel extends GasPropertiesModel {

    constructor() {

      super( {
        stopwatchLocation: new Vector2( 35, 15 ) // in view coordinates! determined empirically
      } );

      // @public
      this.timescaleProperty = new EnumerationProperty( Timescale, Timescale.NORMAL );

      // Change the time transform to match the timescale.
      this.timescaleProperty.link( timescale => {
        if ( timescale === Timescale.NORMAL ) {
          this.timeTransform = new NormalTimeTransform();
        }
        else {
          this.timeTransform = new SlowTimeTransform();
        }
      } );

      // @public
      this.container = new DiffusionContainer( {
        location: new Vector2( 0, -1.5 ) //TODO better to shift the MVT?
      } );

      // @public parameters that control the experiment
      this.experiment = new DiffusionExperiment();

      // @public (read-only)
      this.particles1 = []; // {DiffusionParticle1[]}
      this.particles2 = []; // {DiffusionParticle2[]}

      // @public (read-only) center of mass for particles of type DiffusionParticle1
      this.centerOfMass1Property = new Property( null, CENTER_OF_MASS_OPTIONS );

      // @public (read-only) center of mass for particles of type DiffusionParticle2
      this.centerOfMass2Property = new Property( null, CENTER_OF_MASS_OPTIONS );

      // @public (read-only) Data for the left half of the container
      this.leftNumberOfParticles1Property = new NumberProperty( 0 );
      this.leftNumberOfParticles2Property = new NumberProperty( 0 );
      this.leftAverageTemperatureProperty = new Property( null, AVERAGE_TEMPERATURE_OPTIONS );

      // @public (read-only) Data for the right half of the container
      this.rightNumberOfParticles1Property = new NumberProperty( 0 );
      this.rightNumberOfParticles2Property = new NumberProperty( 0 );
      this.rightAverageTemperatureProperty = new Property( null, AVERAGE_TEMPERATURE_OPTIONS );

      // Add or remove particles
      this.experiment.initialNumber1Property.link( initialNumber => {
        this.numberOfParticlesListener( initialNumber,
          this.experiment.mass1Property.value,
          this.experiment.initialTemperature1Property.value,
          this.particles1,
          DiffusionParticle1 );
      } );
      this.experiment.initialNumber2Property.link( initialNumber => {
        this.numberOfParticlesListener( initialNumber,
          this.experiment.mass2Property.value,
          this.experiment.initialTemperature2Property.value,
          this.particles2,
          DiffusionParticle2 );
      } );

      // Update mass of existing particles
      this.experiment.mass1Property.link( mass => {
        for ( let i = 0; i < this.particles1.length; i++ ) {
          this.particles1[ i ].mass = mass;
          //TODO adjust velocity?
        }
      } );
      this.experiment.mass2Property.link( mass => {
        for ( let i = 0; i < this.particles2.length; i++ ) {
          this.particles2[ i ].mass = mass;
          //TODO adjust velocity?
        }
      } );

      // Update initial temperature of existing particles
      this.experiment.initialTemperature1Property.link( initialTemperature => {
        //TODO adjust velocities of all particles1
      } );
      this.experiment.initialTemperature2Property.link( initialTemperature => {
        //TODO adjust velocities of all particles2
      } );
    }

    /**
     * Resets the model.
     * @public
     * @override
     */
    reset() {
      super.reset();

      // components
      this.container.reset();

      // Properties
      this.timescaleProperty.reset();
      this.experiment.reset();
      // other Properties will be updated when experiment.reset

      assert && assert( this.particles1.length === 0, 'there should be no DiffusionParticle1 particles' );
      assert && assert( this.particles2.length === 0, 'there should be no DiffusionParticle2 particles' );
    }

    /**
     * Steps the model using model time units.
     * @param {number} dt - time delta, in ps
     * @protected
     * @override
     */
    stepModelTime( dt ) {
      super.stepModelTime( dt );
      stepParticles( this.particles1, dt );
      stepParticles( this.particles2, dt );
      this.update();
    }

    /**
     * Adjusts an array of particles to have the desired number of elements.
     * @param {number} numberOfParticles - desired number of particles
     * @param {number} mass
     * @param {number} initialTemperature
     * @param {Particle[]} particles - array of particles that corresponds to newValue and oldValue
     * @param particleConstructor - constructor for elements in particles array
     * @private
     */
    numberOfParticlesListener( numberOfParticles, mass, initialTemperature, particles, particleConstructor ) {
      const delta = numberOfParticles - particles.length;
      if ( delta !== 0 ) {
        if ( delta > 0 ) {
          this.addParticles( delta, mass, initialTemperature, particles, particleConstructor );
        }
        else {
          removeParticles( -delta, particles );
        }
      }
    }

    /**
     * Adds n particles to the end of the specified array.
     * @param {number} n
     * @param {number} mass
     * @param {number} initialTemperature
     * @param {Particle[]} particles
     * @param {constructor} Constructor - a Particle subclass constructor
     * @private
     */
    addParticles( n, mass, initialTemperature, particles, Constructor ) {

      // Create n particles
      for ( let i = 0; i < n; i++ ) {

        const particle = new Constructor( {
          mass: mass
        } );

        // Position the particle at a random location.
        particle.setLocationXY( -1, -1 ); //TODO

        // Set the initial velocity, based on initial temperature and mass.
        particle.setVelocityPolar(

          // |v| = sqrt( 3kT / m )
          Math.sqrt( 3 * GasPropertiesConstants.BOLTZMANN * initialTemperature / particle.mass ),

          // Random angle
          phet.joist.random.nextDouble() * 2 * Math.PI
        );

        particles.push( particle );
      }

      // If paused, update things that would normally be handled by step.
      if ( !this.isPlayingProperty.value ) {
        this.update();
      }
    }

    /**
     * Updates Properties that are based on the current state of the particle system.
     * @private
     */
    update() {

      // center of mass
      this.centerOfMass1Property.value = getCenterOfMassY( this.particles1 );
      this.centerOfMass2Property.value = getCenterOfMassY( this.particles2 );

      // particle counts for the left and right halves of the container
      //TODO update leftNumberOfParticles1Property, leftNumberOfParticles2Property
      //TODO update rightNumberOfParticles1Property, rightNumberOfParticles2Property


      // average temperature for the left and right halves of the container
      //TODO update leftAverageTemperatureProperty, rightAverageTemperatureProperty
    }
  }

  //TODO copied from IdealModel
  /**
   * Steps a collection of particles.
   * @param {Particle[]} particles
   * @param {number} dt - time step in ps
   */
  function stepParticles( particles, dt ) {
    for ( let i = 0; i < particles.length; i++ ) {
      particles[ i ].step( dt );
    }
  }

  //TODO copied from IdealModel and modified
  /**
   * Removes the last n particles from an array.
   * @param {number} n
   * @param {Particle[]} particles
   */
  function removeParticles( n, particles ) {
    assert && assert( n <= particles.length,
      `attempted to remove ${n} particles, but we only have ${particles.length} particles` );
    const particlesRemoved = particles.splice( particles.length - n, particles.length );
    for ( let i = 0; i < particlesRemoved.length; i++ ) {
      particlesRemoved[ i ].dispose();
    }
  }

  /**
   * Gets the y-axis center of mass of a collection of particles.
   * @param {Particle[]} particles
   * @returns {number|null} null if there are no particles and therefore no center of mass
   * @public
   */
  function getCenterOfMassY( particles ) {
    if ( particles.length > 0 ) {
      let numerator = 0;
      let totalMass = 0;
      for ( let i = 0; i < particles.length; i++ ) {
        const particle = particles[ i ];
        numerator += ( particle.mass * particle.location.y );
        totalMass += particle.mass;
      }
      return numerator / totalMass;
    }
    else {
      return null;
    }
  }

  return gasProperties.register( 'DiffusionModel', DiffusionModel );
} );