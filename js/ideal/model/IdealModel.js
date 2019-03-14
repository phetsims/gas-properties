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
  const CollisionDetector = require( 'GAS_PROPERTIES/common/model/CollisionDetector' );
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
  const Particle = require( 'GAS_PROPERTIES/common/model/Particle' );
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

      // @public bounds of the entire space that the model knows about.
      // This doesn't have a valid value until the view is created.
      this.worldBoundsProperty = new Property( new Bounds2( 0, 0, 1, 1 ) );
      phet.log && this.worldBoundsProperty.link( worldBounds => {
        phet.log( `worldBounds: ${worldBounds.toString()} nm` );
      } );

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
      // This doesn't have a valid value until the view is created.
      this.particleBoundsProperty = new DerivedProperty( [ this.worldBoundsProperty ], ( worldBounds ) => {
        return new Bounds2( worldBounds.minX, this.container.location.y, this.container.location.x, worldBounds.maxY );
      } );
      phet.log && this.particleBoundsProperty.link( particleBounds => {
        phet.log( `particleBounds: ${particleBounds.toString()} nm` );
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
            removeParticles( -delta, this.heavyParticles );
          }
          assert( this.heavyParticles.length === newValue,
            'heavyParticles and numberOfHeavyParticlesProperty are out of sync' );
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
            removeParticles( -delta, this.lightParticles );
          }
          assert( this.lightParticles.length === newValue,
            'lightParticles and numberOfLightParticlesProperty are out of sync' );
        }
      } );

      // @public (read-only)
      this.collisionDetector = new CollisionDetector( this );
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

        // Create a particle, just inside the container where the bicycle pump hose attaches.
        const particle = new Constructor();
        particle.setLocation(
          this.container.hoseLocation.x - this.container.wallThickness / 2 - particle.radius,
          this.container.hoseLocation.y
        );

        // Set the particle's velocity.
        // We can't do this in the constructor because initial velocity is a function of the particle's mass.
        particle.setVelocityPolar(

          //TODO or should this be the same as the current contents of the container, and 300K for empty container?
          // Velocity magnitude corresponds to INITIAL_TEMPERATURE.
          // KE = (3/2)kT = (1/2) * m * |v|^2, so v = sqrt( 3kT / m )
          Math.sqrt( 3 * GasPropertiesConstants.BOLTZMANN * INITIAL_TEMPERATURE / particle.mass ),

          // Velocity angle is randomly chosen from pump's dispersion angle, perpendicular to right wall of container.
          Math.PI - PUMP_DISPERSION_ANGLE / 2 + phet.joist.random.nextDouble() * PUMP_DISPERSION_ANGLE
        );

        particles.push( particle );
      }
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
      this.numberOfHeavyParticlesProperty.reset(); // clears this.heavyParticles
      this.numberOfLightParticlesProperty.reset(); // clears this.lightParticles
      this.heatCoolAmountProperty.reset();

      assert && assert( this.heavyParticles.length === 0, 'there should be no heavyParticles' );
      assert && assert( this.lightParticles.length === 0, 'there should be no lightParticles' );
    }

    /**
     * Steps the model using real time units.
     * @param {number} dt - time delta in seconds
     * @public
     */
    step( dt ) {
      this.stepModelTime( this.timeTransform( dt ) );
    }

    /**
     * Steps the model using model time units.
     * @param {number} dt - time delta in ps
     * @public
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
        this.collisionDetector.step( dt );

        // remove particles that are out of bounds
        removeParticlesOutOfBounds( this.heavyParticles, this.numberOfHeavyParticlesProperty, this.particleBoundsProperty.value );
        removeParticlesOutOfBounds( this.lightParticles, this.numberOfLightParticlesProperty, this.particleBoundsProperty.value );

        // verify that all particles are fully enclosed in the container
        assert && assertContainerEnclosesParticles( this.container, this.heavyParticles );
        assert && assertContainerEnclosesParticles( this.container, this.lightParticles );
      }
    }
  }

  /**
   * Removes a particle from an array.
   * @param {Particle} particle
   * @param {Particle[]} particles
   */
  function removeParticle( particle, particles ) {
    assert && assert( particle instanceof Particle, 'not a Particle: ' + particle );
    const index = particles.indexOf( particle );
    assert && assert( index !== -1, 'particle not found' );
    particles.splice( index, 1 );
    particle.dispose();
  }

  /**
   * Removes the last n particles from an array.
   * @param {number} n
   * @param {Particle[]} particles
   */
  function removeParticles( n, particles ) {
    assert && assert( n <= particles.length,
      `attempted to remove ${n} particles, but we only have ${particles.length} particles` );
    const particlesToRemove = particles.slice( particles.length - n, particles.length );
    for ( let i = 0; i < particlesToRemove.length; i++ ) {
      removeParticle( particlesToRemove[ i ], particles );
    }
  }

  /**
   * Removes particles that are out of bounds.
   * @param {Particle[]} particles
   * @param {NumberProperty} numberOfParticlesProperty
   * @param {Bounds2} bounds
   */
  function removeParticlesOutOfBounds( particles, numberOfParticlesProperty, bounds ) {
    for ( let i = 0; i < particles.length; i++ ) {
      if ( !bounds.containsPoint( particles[ i ].location ) ) {
        removeParticle( particles[ i ], particles );
        numberOfParticlesProperty.value--;
      }
    }
  }

  /**
   * Verifies that the container encloses all particles, surrounding them on all sides.
   * @param {Particle[]} particles
   * @param {Container} container
   */
  function assertContainerEnclosesParticles( container, particles ) {
    for ( let i = 0; i < particles.length; i++ ) {
      assert && assert( container.enclosesParticle( particles[ i ] ),
        `container does not enclose particle: ${particles[ i ].toString()}` );
    }
  }

  return gasProperties.register( 'IdealModel', IdealModel );
} );