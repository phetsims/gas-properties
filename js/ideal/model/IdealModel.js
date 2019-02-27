// Copyright 2018-2019, University of Colorado Boulder

/**
 * Model for the 'Ideal' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const CollisionCounter = require( 'GAS_PROPERTIES/common/model/CollisionCounter' );
  const CollisionManager = require( 'GAS_PROPERTIES/common/model/CollisionManager' );
  const Container = require( 'GAS_PROPERTIES/common/model/Container' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const HeavyParticle = require( 'GAS_PROPERTIES/common/model/HeavyParticle' );
  const HoldConstantEnum = require( 'GAS_PROPERTIES/common/model/HoldConstantEnum' );
  const LightParticle = require( 'GAS_PROPERTIES/common/model/LightParticle' );
  const LinearFunction = require( 'DOT/LinearFunction' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const PressureGauge = require( 'GAS_PROPERTIES/common/model/PressureGauge' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Stopwatch = require( 'GAS_PROPERTIES/common/model/Stopwatch' );
  const Thermometer = require( 'GAS_PROPERTIES/common/model/Thermometer' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const PUMP_DISPERSION_ANGLE = Math.PI / 2; // radians
  const INITIAL_TEMPERATURE = 300; // K

  class IdealModel {

    constructor() {

      // @public bounds of the entire space that the model knows about
      this.worldBoundsProperty = new Property( new Bounds2( 0, 0, 2, 2 ) );

      // @public transform between real time and sim time
      // 1 second of real time is 2.5 picoseconds of sim time.
      this.timeTransform = new LinearFunction( 0, 1, 0, 2.5 );

      // @public transform between model and view coordinate frames
      const modelViewScale = 40; // number of pixels per nm
      this.modelViewTransform = ModelViewTransform2.createOffsetXYScaleMapping(
        new Vector2( 645, 475  ), // offset of the model's origin, in view coordinates
        modelViewScale,
        -modelViewScale // y is inverted
      );

      // @public model elements
      this.container = new Container();
      this.collisionCounter = new CollisionCounter( {
        location: new Vector2( 20, 20 ) // view coordinate! determined empirically
      } );
      this.stopwatch = new Stopwatch( {
        location: new Vector2( 200, 20 ) // view coordinates! determined empirically
      } );
      this.thermometer = new Thermometer();
      this.pressureGauge = new PressureGauge();

      // @public is the sim playing?
      this.isPlayingProperty = new BooleanProperty( true );

      // @public are the time controls (play, pause, step) enabled?
      this.isTimeControlsEnabledProperty = new BooleanProperty( true );

      // @public the quantity to hold constant
      this.holdConstantProperty = new Property( HoldConstantEnum.NOTHING, {
        isValidValue: value =>  HoldConstantEnum.includes( value )
      } );

      // @public the number of heavy particles in the container
      this.numberOfHeavyParticlesProperty = new NumberProperty( GasPropertiesConstants.HEAVY_PARTICLES_RANGE.defaultValue, {
        numberType: 'Integer',
        range: GasPropertiesConstants.HEAVY_PARTICLES_RANGE
      } );

      // @public the number of light particles in the container
      this.numberOfLightParticlesProperty = new NumberProperty( GasPropertiesConstants.LIGHT_PARTICLES_RANGE.defaultValue, {
        numberType: 'Integer',
        range: GasPropertiesConstants.LIGHT_PARTICLES_RANGE
      } );

      // @public the amount to heat (positive value) or cool (negative value) the contents of the container
      this.heatCoolAmountProperty = new NumberProperty( 0, {
        range: new Range( -1, 1 )
      } );

      // @public {Property.<Bounds2>} bounds in which particles exist. Particles that leave these bounds are deleted.
      // This includes everything in the world that is to the right of and above the container's origin.
      // This is sufficient because there is no gravity, so any particles that leave the box via the opening
      // in its top will continue to move upward.
      this.particleBoundsProperty = new DerivedProperty( [ this.worldBoundsProperty ], ( worldBounds ) => {
        return new Bounds2( worldBounds.minX, this.container.location.y, this.container.location.x, worldBounds.maxY );
      } );
      phet.log && this.particleBoundsProperty.link( particleBounds => {
        phet.log( 'particleBounds=' + particleBounds.toString() );
      } );

      this.heavyParticles = []; // {HeavyParticle[]}
      this.lightParticles = []; // {LightParticle[]}

      this.numberOfHeavyParticlesProperty.link( ( newValue, oldValue ) => {
        if ( this.heavyParticles.length !== newValue ) {
          const delta = newValue - oldValue;
          if ( delta > 0 ) {
            this.addParticles( delta, this.heavyParticles, HeavyParticle );
          }
          else if ( delta < 0 ) {
            this.removeParticles( -delta, this.heavyParticles );
          }
        }
      } );

      //TODO duplication with numberOfHeavyParticlesProperty listener
      this.numberOfLightParticlesProperty.link( ( newValue, oldValue ) => {
        if ( this.lightParticles.length !== newValue ) {
          const delta = newValue - oldValue;
          if ( delta > 0 ) {
            this.addParticles( delta, this.lightParticles, LightParticle );
          }
          else if ( delta < 0 ) {
            this.removeParticles( -delta, this.lightParticles );
          }
        }
      } );

      // @private
      this.collisionManager = new CollisionManager( this );
    }

    /**
     * Gets the 2D grid of Regions that spatially partitions the collision detection space.
     * @returns {Region[][]}
     */
    getRegions() {
      return this.collisionManager.regionsProperty.value;
    }

    /**
     * Gets the bounds of the collision detection space.
     * @returns {Bounds2}
     */
    getCollisionBounds() {
      return this.collisionManager.bounds;
    }

    /**
     * Adds n particles to the end of the specified array.
     * @param {number} n
     * @param {Particle[]} particles
     * @param {constructor} Constructor - a Particle subclass constructor
     * @private
     */
    addParticles( n, particles, Constructor ) {
      for ( let i = 0; i < n; i++ ) {

        // Create a particle
        const particle = new Constructor( {
          location: this.container.hoseLocation
        } );

        // Set the particle's velocity.
        // We can't do this in the constructor because initial velocity is a function of the particle's mass.
        particle.setVelocity(
          // Velocity magnitude corresponds to INITIAL_TEMPERATURE.
          // KE = (3/2)kT = (1/2) * m * |v|^2, so v = sqrt( 3kT / m )
          Math.sqrt( 3 * GasPropertiesConstants.BOLTZMANN * INITIAL_TEMPERATURE / particle.mass ),

          // Velocity angle is randomly chosen, based on the pump's dispersion angle.
          Math.PI - PUMP_DISPERSION_ANGLE / 2 + phet.joist.random.nextDouble() * PUMP_DISPERSION_ANGLE
        );

        particles.push( particle );
      }
    }

    /**
     * Removes the last n particles from an array.
     * @param {number} n
     * @param {Particle[]} particles
     * @private
     */
    removeParticles( n, particles ) {
      assert && assert( n <= particles.length,
        `attempted to remove ${n} particles, but we only have ${particles.length} particles` );
      const particlesToRemove = particles.slice( particles.length - n, particles.length );
      particlesToRemove.forEach( particle => this.removeParticle( particle, particles ) );
    }

    /**
     * Removes a particle from an array.
     * @param {Particle} particle
     * @param {Particle[]} particles
     * @private
     */
    removeParticle( particle, particles ) {
      const index = particles.indexOf( particle );
      assert && assert( index !== -1, 'particle not found' );
      particles.splice( index, 1 );
      particle.dispose && particle.dispose();
    }

    // @public resets the model
    reset() {

      // model elements
      this.container.reset();
      this.collisionCounter.reset();
      this.stopwatch.reset();
      this.thermometer.reset();
      this.pressureGauge.reset();

      // Properties
      this.isPlayingProperty.reset();
      this.isTimeControlsEnabledProperty.reset();
      this.holdConstantProperty.reset();
      this.numberOfHeavyParticlesProperty.reset();
      this.numberOfLightParticlesProperty.reset();
      this.heatCoolAmountProperty.reset();

      // remove all particles
      this.removeParticles( this.heavyParticles.length, this.heavyParticles );
      this.removeParticles( this.lightParticles.length, this.lightParticles );
    }

    /**
     * Steps the model using real time units.
     * @param {number} dt - time delta in seconds
     */
    step( dt ) {
      this.stepModelTime( this.timeTransform( dt ) );
    }

    /**
     * Steps the model using model time units.
     * @param {number} dt - time delta in ps
     */
    stepModelTime( dt ) {
      if ( this.isPlayingProperty.value ) {

        // advance the stopwatch
        this.stopwatch.step( dt );

        // step particles
        for ( let i = 0; i < this.heavyParticles.length; i++ ) {
          this.heavyParticles[ i ].step( dt );
        }
        for ( let i = 0; i < this.lightParticles.length; i++ ) {
          this.lightParticles[ i ].step( dt );
        }

        // collision detection and response
        this.collisionManager.step( dt );

        // remove particles that have left the bounds
        const particleBounds = this.particleBoundsProperty.value;
        for ( let i = 0; i < this.heavyParticles.length; i++ ) {
          if ( !particleBounds.containsPoint( this.heavyParticles[ i ].location ) ) {
            this.removeParticle( this.heavyParticles[ i ], this.heavyParticles );
            this.numberOfHeavyParticlesProperty.value--;
          }
        }
        for ( let i = 0; i < this.lightParticles.length; i++ ) {
          if ( !particleBounds.containsPoint( this.lightParticles[ i ].location ) ) {
            this.removeParticle( this.lightParticles[ i ], this.lightParticles );
            this.numberOfLightParticlesProperty.value--;
          }
        }
      }
    }
  }

  return gasProperties.register( 'IdealModel', IdealModel );
} );