// Copyright 2018-2019, University of Colorado Boulder

/**
 * Base class for models in the Intro, Explore, and Energy screens.
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
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
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
  const RangeWithValue = require( 'DOT/RangeWithValue' );
  const Stopwatch = require( 'GAS_PROPERTIES/common/model/Stopwatch' );
  const Thermometer = require( 'GAS_PROPERTIES/common/model/Thermometer' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  // radians, used to compute initial velocity angle for particles
  const PUMP_DISPERSION_ANGLE = Math.PI / 2;
  // K, temperature used to compute initial velocity of particles
  const INITIAL_TEMPERATURE_RANGE = new RangeWithValue( 50, 1000, 300 );

  class GasPropertiesModel {

    constructor( options ) {

      options = _.extend( {
        holdConstant: HoldConstantEnum.NOTHING
      }, options );

      // @public (read-only) bounds of the entire space that the model knows about.
      // This corresponds to the browser window, and doesn't have a valid value until the view is created.
      this.modelBoundsProperty = new Property( new Bounds2( 0, 0, 1, 1 ) );
      phet.log && this.modelBoundsProperty.link( modelBounds => {
        phet.log( `modelBounds: ${modelBounds.toString()} nm` );
      } );

      // @public (read-only) transform between real time and sim time
      // 1 second of real time is 2.5 picoseconds of sim time.
      this.timeTransform = new LinearFunction( 0, 1, 0, 2.5 );

      // @public (read-only) transform between model and view coordinate frames
      const modelViewScale = 40; // number of pixels per nm
      this.modelViewTransform = ModelViewTransform2.createOffsetXYScaleMapping(
        new Vector2( 645, 475  ), // offset of the model's origin, in view coordinates
        modelViewScale,
        -modelViewScale // y is inverted
      );

      // @public is the sim playing?
      this.isPlayingProperty = new BooleanProperty( true );

      // @public are the time controls (play, pause, step) enabled?
      this.isTimeControlsEnabledProperty = new BooleanProperty( true );

      //TODO holdConstantProperty is exposed only in the Intro screen. How to handle for other screen?
      // @public the quantity to hold constant
      this.holdConstantProperty = new EnumerationProperty( HoldConstantEnum, options.holdConstant );

      // @public (read-only)
      this.heavyParticles = []; // {HeavyParticle[]} inside the container
      this.lightParticles = []; // {LightParticle[]} inside the container
      this.heavyParticlesOutside = []; // {HeavyParticle[]} outside the container
      this.lightParticlesOutside = []; // {LightParticle[]} outside the container

      // @public the number of heavy particles inside the container
      this.numberOfHeavyParticlesProperty = new NumberProperty( GasPropertiesConstants.HEAVY_PARTICLES_RANGE.defaultValue, {
        numberType: 'Integer',
        range: GasPropertiesConstants.HEAVY_PARTICLES_RANGE
      } );

      // @public the number of light particles inside the container
      this.numberOfLightParticlesProperty = new NumberProperty( GasPropertiesConstants.LIGHT_PARTICLES_RANGE.defaultValue, {
        numberType: 'Integer',
        range: GasPropertiesConstants.LIGHT_PARTICLES_RANGE
      } );

      // Synchronize particle counts and arrays
      this.numberOfHeavyParticlesProperty.link( ( newValue, oldValue ) => {
        this.numberOfParticlesListener( newValue, oldValue, this.heavyParticles, HeavyParticle );
      } );
      this.numberOfLightParticlesProperty.link( ( newValue, oldValue ) => {
        this.numberOfParticlesListener( newValue, oldValue, this.lightParticles, LightParticle );
      } );

      // @public whether initial temperature is controlled by the user or determined by what's in the container
      this.controlTemperatureEnabledProperty = new BooleanProperty( GasPropertiesQueryParameters.checked );

      // @public initial temperature of particles added to the container, in K.
      // Ignored if !controlTemperatureEnabledProperty.value
      this.initialTemperatureProperty = new NumberProperty( INITIAL_TEMPERATURE_RANGE.defaultValue, {
        range: INITIAL_TEMPERATURE_RANGE
      } );

      const averageSpeedPropertyOptions = {
        isValidValue: value => ( value === null || typeof value === 'number' )
      };

      // @public (read-only) average speed of heavy particles in the container, null when container is empty, m/s
      this.heavyAverageSpeedProperty = new Property( null, averageSpeedPropertyOptions );
      this.lightAverageSpeedProperty = new Property( null, averageSpeedPropertyOptions );

      // @public (read-only)
      this.container = new Container();
      
      // @public (read-only)
      this.collisionDetector = new CollisionDetector( this );

      // @public the factor to heat (positive value) or cool (negative value) the contents of the container
      this.heatCoolFactorProperty = new NumberProperty( 0, {
        range: new Range( -1, 1 )
      } );

      // @public (read-only)
      this.thermometer = new Thermometer();

      // @public (read-only)
      this.pressureGauge = new PressureGauge();

      // @public (read-only)
      this.collisionCounter = new CollisionCounter( this.collisionDetector, {
        location: new Vector2( 20, 20 ) // view coordinates! determined empirically
      } );

      // @public (read-only)
      this.stopwatch = new Stopwatch( {
        location: new Vector2( 200, 20 ) // view coordinates! determined empirically
      } );

      // Redistribute particles as the container width changes.
      if ( GasPropertiesQueryParameters.redistribute === 'drag' ) {
        this.container.widthProperty.link( ( newWidth, oldWidth ) => {
          this.redistributeParticles( newWidth / oldWidth );
        } );
      }
    }

    /**
     * Adjusts an array of particles to have the desired number of elements.
     * @param {number} newValue - new number of particles
     * @param {number} oldValue - old number of particles
     * @param {Particle[]} particles - array of particles that corresponds to newValue and oldValue
     * @param particleConstructor - constructor for elements in particles array
     * @private
     */
    numberOfParticlesListener( newValue, oldValue, particles, particleConstructor ) {
      if ( particles.length !== newValue ) {
        const delta = newValue - oldValue;
        if ( delta > 0 ) {
          this.addParticles( delta, particles, particleConstructor );
        }
        else if ( delta < 0 ) {
          removeParticles( -delta, particles );
        }
        assert && assert( particles.length === newValue, 'particles array is out of sync' );
      }
    }

    /**
     * Adds n particles to the end of the specified array.
     * @param {number} n
     * @param {Particle[]} particles
     * @param {constructor} Constructor - a Particle subclass constructor
     * @private
     */
    addParticles( n, particles, Constructor ) {

      // Get the temperature that will be used to compute initial velocity magnitude.
      let temperature = INITIAL_TEMPERATURE_RANGE.defaultValue;
      if ( this.controlTemperatureEnabledProperty.value ) {

        // User's setting
        temperature = this.initialTemperatureProperty.value;
      }
      else if ( this.heavyParticles.length + this.lightParticles.length > 0 ) {

        // Current temperature in the non-empty container
        temperature = this.thermometer.temperatureKelvinProperty.value;
      }

      for ( let i = 0; i < n; i++ ) {

        // Create a particle, just inside the container where the bicycle pump hose attaches.
        const particle = new Constructor();
        particle.setLocationXY(
          this.container.hoseLocation.x - this.container.wallThickness - particle.radius,
          this.container.hoseLocation.y
        );

        // Set the particle's velocity.
        particle.setVelocityPolar(

          // KE = (3/2)kT = (1/2) * m * |v|^2, so v = sqrt( 3kT / m )
          Math.sqrt( 3 * GasPropertiesConstants.BOLTZMANN * temperature / particle.mass ),

          // Velocity angle is randomly chosen from pump's dispersion angle, perpendicular to right wall of container.
          Math.PI - PUMP_DISPERSION_ANGLE / 2 + phet.joist.random.nextDouble() * PUMP_DISPERSION_ANGLE
        );

        particles.push( particle );
      }
    }

    /**
     * Redistributes the particles in the container, called in response to changing the container width.
     * @param {number} ratio
     * @public
     */
    redistributeParticles( ratio ) {
      redistributeParticles( this.heavyParticles, ratio );
      redistributeParticles( this.lightParticles, ratio );
    }

    // @public resets the model
    reset() {

      // model elements
      this.container.reset();
      this.collisionCounter.reset();
      this.stopwatch.reset();
      this.thermometer.reset();
      this.pressureGauge.reset();
      this.collisionDetector.reset();

      // Properties
      this.isPlayingProperty.reset();
      this.isTimeControlsEnabledProperty.reset();
      this.holdConstantProperty.reset();
      this.numberOfHeavyParticlesProperty.reset(); // clears this.heavyParticles
      this.numberOfLightParticlesProperty.reset(); // clears this.lightParticles
      this.heatCoolFactorProperty.reset();

      assert && assert( this.heavyParticles.length === 0, 'there should be no heavyParticles' );
      assert && assert( this.lightParticles.length === 0, 'there should be no lightParticles' );

      // Dispose of particles that are outside the container
      removeParticles( this.heavyParticlesOutside.length, this.heavyParticlesOutside );
      removeParticles( this.lightParticlesOutside.length, this.lightParticlesOutside );
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

        // Advance the stopwatch
        this.stopwatch.step( dt );

        // Apply heat/cool
        if ( this.heatCoolFactorProperty.value !== 0 ) {
          heatCoolParticles( this.heavyParticles, this.heatCoolFactorProperty.value );
          heatCoolParticles( this.lightParticles, this.heatCoolFactorProperty.value );
        }

        // Step particles
        stepParticles( this.heavyParticles, dt );
        stepParticles( this.lightParticles, dt );
        stepParticles( this.heavyParticlesOutside, dt );
        stepParticles( this.lightParticlesOutside, dt );

        // Collision detection and response
        this.collisionDetector.step( dt );

        // Remove particles that have left the model bounds
        removeParticlesOutOfBounds( this.heavyParticlesOutside, this.modelBoundsProperty.value );
        removeParticlesOutOfBounds( this.lightParticlesOutside, this.modelBoundsProperty.value );

        // Verify that these particles are fully enclosed in the container
        assert && assertContainerEnclosesParticles( this.container, this.heavyParticles );
        assert && assertContainerEnclosesParticles( this.container, this.lightParticles );

        // Compute temperature. Do this before pressure, because pressure depends on temperature.
        this.thermometer.temperatureKelvinProperty.value = this.computeTemperature();

        // Compute pressure
        this.pressureGauge.pressureKilopascalsProperty.value = this.computePressure();

        // compute the average speed for each particle type
        this.heavyAverageSpeedProperty.value = getAverageSpeed( this.heavyParticles );
        this.lightAverageSpeedProperty.value = getAverageSpeed( this.lightParticles );

        // Do this after collision detection, so that the number of collisions detected is recorded.
        this.collisionCounter.step( dt );
      }
    }

    /**
     * Gets the temperature in the container.
     * @returns {number|null} in K, null if the container is empty
     * @private
     */
    computeTemperature() {
      let temperature = null;
      const numberOfParticles = this.heavyParticles.length + this.lightParticles.length;
      if ( numberOfParticles > 0 ) {

        // Compute the average kinetic energy, AMU * nm^2 / ps^2
        let averageKineticEnergy = 0;
        for ( let i = 0; i < this.heavyParticles.length; i++ ) {
          averageKineticEnergy += this.heavyParticles[ i ].kineticEnergy;
        }
        for ( let i = 0; i < this.lightParticles.length; i++ ) {
          averageKineticEnergy += this.lightParticles[ i ].kineticEnergy;
        }
        averageKineticEnergy /= numberOfParticles;

        const k = GasPropertiesConstants.BOLTZMANN; // (nm^2 * AMU)/(ps^2 * K)

        // T = (2/3)KE/k
        temperature = (2/3) * averageKineticEnergy / k; // K
      }
      return temperature;
    }

    /**
     * Gets the pressure in the container.
     * @returns {number} in kPa
     * @private
     */
    computePressure() {
      const numberOfParticles = this.heavyParticles.length + this.lightParticles.length;
      const temperature = this.thermometer.temperatureKelvinProperty.value; // K
      const volume = this.container.volume; // nm^3
      const k = GasPropertiesConstants.BOLTZMANN; // (nm^2 * AMU)/(ps^2 * K)

      // P = NkT/V
      return numberOfParticles * k * temperature / volume; //TODO convert to kPa, 1 Pa = 1 kg/(m * s^2)
    }
  }

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

  /**
   * Heats or cools a collection of particles.
   * @param {Particle[]} particles
   * @param {number} heatCoolFactor - (-1,1), heat=[0,1), cool=(-1,0]
   */
  function heatCoolParticles( particles, heatCoolFactor ) {
    assert && assert( heatCoolFactor >= -1 && heatCoolFactor <= 1, 'invalid heatCoolFactor: ' + heatCoolFactor );
    const velocityScale = 1 + heatCoolFactor / GasPropertiesQueryParameters.heatCool;
    for ( let i = 0; i < particles.length; i++ ) {
      particles[i].scaleVelocity( velocityScale );
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
   * @param {Bounds2} bounds
   */
  function removeParticlesOutOfBounds( particles, bounds ) {
    for ( let i = 0; i < particles.length; i++ ) {
      if ( !particles[ i ].intersectsBounds( bounds ) ) {
        removeParticle( particles[ i ], particles );
      }
    }
  }

  /**
   * Redistributes particles in the horizontal dimension
   * @param {Particle[]} particles
   * @param {number} ratio
   */
  function redistributeParticles( particles, ratio ) {
    assert && assert( ratio > 0, 'invalid ration: ' + ratio );
    for ( let i = 0; i < particles.length; i++ ) {
      particles[ i ].location.setX( ratio * particles[ i ].location.x );
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

  /**
   * Gets the average speed of a set of particles, in nm/ps.
   * @param {Particle[]} particles
   * @returns {number|null} null if there are no particles
   */
  function getAverageSpeed( particles ) {
    let averageSpeed = null;
    if ( particles.length > 0 ) {
      let totalSpeed = 0;
      for ( let i = 0; i < particles.length; i++ ) {
        totalSpeed += particles[ i ].velocity.magnitude;
      }
      averageSpeed = totalSpeed / particles.length;
    }
    return averageSpeed;
  }

  return gasProperties.register( 'GasPropertiesModel', GasPropertiesModel );
} );