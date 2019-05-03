// Copyright 2019, University of Colorado Boulder

/**
 * Base class for models in the Intro, Explore, and Energy screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BaseModel = require( 'GAS_PROPERTIES/common/model/BaseModel' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const CollisionCounter = require( 'GAS_PROPERTIES/common/model/CollisionCounter' );
  const CollisionDetector = require( 'GAS_PROPERTIES/common/model/CollisionDetector' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesContainer = require( 'GAS_PROPERTIES/common/model/GasPropertiesContainer' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const GasPropertiesUtils = require( 'GAS_PROPERTIES/common/GasPropertiesUtils' );
  const HeavyParticle = require( 'GAS_PROPERTIES/common/model/HeavyParticle' );
  const HoldConstantEnum = require( 'GAS_PROPERTIES/common/model/HoldConstantEnum' );
  const LightParticle = require( 'GAS_PROPERTIES/common/model/LightParticle' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Particle = require( 'GAS_PROPERTIES/common/model/Particle' );
  const PressureGauge = require( 'GAS_PROPERTIES/common/model/PressureGauge' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const RangeWithValue = require( 'DOT/RangeWithValue' );
  const Thermometer = require( 'GAS_PROPERTIES/common/model/Thermometer' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  // radians, used to compute initial velocity angle for particles
  const PUMP_DISPERSION_ANGLE = Math.PI / 2;
  // K, temperature used to compute initial speed of particles
  const INITIAL_TEMPERATURE_RANGE = new RangeWithValue( 50, 1000, 300 );

  class GasPropertiesModel extends BaseModel {

    constructor( options ) {

      options = _.extend( {
        holdConstant: HoldConstantEnum.NOTHING,
        hasCollisionCounter: true
      }, options );

      super();

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

      // @private
      this.totalNumberOfParticlesProperty = new DerivedProperty(
        [ this.numberOfHeavyParticlesProperty, this.numberOfLightParticlesProperty ],
        ( numberOfHeavyParticles, numberOfLightParticles ) => numberOfHeavyParticles + numberOfLightParticles
      );

      // @public whether initial temperature is controlled by the user or determined by what's in the container
      this.controlTemperatureEnabledProperty = new BooleanProperty( GasPropertiesQueryParameters.checked );

      // @public initial temperature of particles added to the container, in K.
      // Ignored if !controlTemperatureEnabledProperty.value
      this.initialTemperatureProperty = new NumberProperty( INITIAL_TEMPERATURE_RANGE.defaultValue, {
        range: INITIAL_TEMPERATURE_RANGE,
        units: 'K'
      } );

      // @public (read-only)
      this.container = new GasPropertiesContainer();

      // @public (read-only)
      this.collisionDetector = new CollisionDetector( this.container, [ this.heavyParticles, this.lightParticles ], {
        regionLength: this.container.height / 4
      } );

      // @public the factor to heat (positive value) or cool (negative value) the contents of the container
      this.heatCoolFactorProperty = new NumberProperty( 0, {
        range: new Range( -1, 1 )
      } );

      // @public {Property.<number|null>} temperature in the container, in K. Value is null when the container is empty.
      this.temperatureProperty = new Property( null, {
        isValidValue: value => ( value === null || typeof value === 'number' ),
        units: 'K'
      } );

      // @public (read-only)
      this.thermometer = new Thermometer( this.temperatureProperty );

      // @public pressure in the container, in kPa
      this.pressureProperty = new NumberProperty( 0, {
        isValidValue: value => ( value >= 0 ),
        units: 'kPa'
      } );

      // @public (read-only)
      this.pressureGauge = new PressureGauge( this.pressureProperty );

      // @private whether to update pressure
      this.updatePressure = false;

      // When adding particles to an empty container, don't update pressure until 1 particle has collided with the container.
      this.totalNumberOfParticlesProperty.link( totalNumberOfParticles => {
        if ( totalNumberOfParticles === 0 ) {
          this.updatePressure = false;
          this.pressureProperty.value = 0;
        }
      } );

      // @public (read-only)
      this.collisionCounter = null;
      if ( options.hasCollisionCounter ) {
        this.collisionCounter = new CollisionCounter( this.collisionDetector, {
          location: new Vector2( 40, 15 ) // view coordinates! determined empirically
        } );
      }

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
      let meanTemperature = INITIAL_TEMPERATURE_RANGE.defaultValue;
      if ( this.controlTemperatureEnabledProperty.value ) {

        // User's setting
        meanTemperature = this.initialTemperatureProperty.value;
      }
      else if ( this.heavyParticles.length + this.lightParticles.length > 0 ) {

        // Current temperature in the non-empty container
        meanTemperature = this.temperatureProperty.value;
      }

      // Create a set of temperature values that will be used to compute initial speed.
      let temperatures = null;
      if ( n !== 1 && this.collisionDetector.particleParticleCollisionsEnabledProperty.value ) {

        // For groups of particles with particle-particle collisions enabled, create some deviation in the
        // temperature used to compute speed, but maintain the desired mean.  This makes the motion of a group
        // of particles look less wave-like. We do this for temperature instead of speed because temperature
        // in the container is T = (2/3)KE/k, and KE is a function of speed^2, so deviation in speed would
        // change the desired temperature.
        temperatures = GasPropertiesUtils.getGaussianValues( n, meanTemperature, 0.2 * meanTemperature, 1E-10 );
      }
      else {

        // For single particles, or if particle-particle collisions are disabled, use the mean temperature
        // for all particles. For groups of particles, this yields wave-like motion.
        temperatures = [];
        for ( let i = 0; i < n; i++ ) {
          temperatures[ i ] = meanTemperature;
        }
      }

      // Create n particles
      for ( let i = 0; i < n; i++ ) {
        assert && assert( i < temperatures.length, `index out of range, i: ${i}` );

        const particle = new Constructor();

        // Position the particle just inside the container, where the bicycle pump hose attaches to the right wall.
        particle.setLocationXY(
          this.container.hoseLocation.x - this.container.wallThickness - particle.radius,
          this.container.hoseLocation.y
        );

        // Set the initial velocity
        particle.setVelocityPolar(
          
          // |v| = sqrt( 3kT / m )
          Math.sqrt( 3 * GasPropertiesConstants.BOLTZMANN * temperatures[ i ] / particle.mass ),

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

    /**
     * Resets the model.
     * @public
     * @override
     */
    reset() {

      super.reset();

      // model elements
      this.container.reset();
      this.collisionCounter && this.collisionCounter.reset();
      this.pressureGauge.reset();
      this.collisionDetector.reset();

      // Properties
      this.temperatureProperty.reset();
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
     * Steps the model using model time units.
     * @param {number} dt - time delta, in ps
     * @protected
     * @override
     */
    stepModelTime( dt ) {

      super.stepModelTime( dt );

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

      // Allow particles to escape from the opening in the top of the container
      if ( this.container.openingWidth > 0 ) {
        escapeParticles( this.container, this.numberOfHeavyParticlesProperty, this.heavyParticles, this.heavyParticlesOutside, );
        escapeParticles( this.container, this.numberOfLightParticlesProperty, this.lightParticles, this.lightParticlesOutside );
      }

      // Collision detection and response
      this.collisionDetector.step( dt );

      // Remove particles that have left the model bounds
      removeParticlesOutOfBounds( this.heavyParticlesOutside, this.modelBoundsProperty.value );
      removeParticlesOutOfBounds( this.lightParticlesOutside, this.modelBoundsProperty.value );

      // Verify that these particles are fully enclosed in the container
      assert && assertContainerEnclosesParticles( this.container, this.heavyParticles );
      assert && assertContainerEnclosesParticles( this.container, this.lightParticles );

      // Do this after collision detection, so that the number of collisions detected has been recorded.
      this.collisionCounter && this.collisionCounter.step( dt );

      // Compute temperature. Do this before pressure, because pressure depends on temperature.
      this.temperatureProperty.value = this.computeTemperature();

      // When adding particles to an empty container, don't update pressure until 1 particle has collided with the container.
      if ( !this.updatePressure && this.collisionDetector.numberOfParticleContainerCollisions > 0 ) {
        this.updatePressure = true;
      }

      // Compute pressure
      if ( this.updatePressure ) {
        this.pressureProperty.value = this.computePressure();
        this.pressureGauge.step( dt );
      }

      // If pressure exceeds the maximum, blow the lid off of the container.
      if ( this.pressureProperty.value > GasPropertiesQueryParameters.maxPressure ) {
        this.container.lidIsOnProperty.value = false;
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

        // Compute the average kinetic energy, AMU * pm^2 / ps^2
        let totalKineticEnergy = 0;
        for ( let i = 0; i < this.heavyParticles.length; i++ ) {
          totalKineticEnergy += this.heavyParticles[ i ].kineticEnergy;
        }
        for ( let i = 0; i < this.lightParticles.length; i++ ) {
          totalKineticEnergy += this.lightParticles[ i ].kineticEnergy;
        }

        const averageKineticEnergy = totalKineticEnergy / numberOfParticles;

        const k = GasPropertiesConstants.BOLTZMANN; // (pm^2 * AMU)/(ps^2 * K)

        // T = (2/3)KE/k
        temperature = ( 2 / 3 ) * averageKineticEnergy / k; // K
      }
      return temperature;
    }

    /**
     * Gets the pressure in the container.
     * @returns {number} in kPa
     * @private
     */
    computePressure() {

      const numberOfParticles = this.heavyParticles.length + this.lightParticles.length;  // N
      const k = GasPropertiesConstants.BOLTZMANN; // k, in (pm^2 * AMU)/(ps^2 * K)
      const temperature = this.temperatureProperty.value; // T, in K
      const volume = this.container.volume; // V, in pm^3

      // P = NkT/V, converted to kPa
      return ( numberOfParticles * k * temperature / volume ) * 1.66E6;
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
    assert && assert( heatCoolFactor >= -1 && heatCoolFactor <= 1, `invalid heatCoolFactor: ${heatCoolFactor}` );
    const velocityScale = 1 + heatCoolFactor / GasPropertiesQueryParameters.heatCool;
    for ( let i = 0; i < particles.length; i++ ) {
      particles[ i ].scaleVelocity( velocityScale );
    }
  }

  /**
   * Removes a particle from an array.
   * @param {Particle} particle
   * @param {Particle[]} particles
   */
  function removeParticle( particle, particles ) {
    assert && assert( particle instanceof Particle, `not a Particle: ${particle}` );
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
    assert && assert( ratio > 0, `invalid ratio: ${ratio}` );
    for ( let i = 0; i < particles.length; i++ ) {
      particles[ i ].location.setX( ratio * particles[ i ].location.x );
    }
  }

  /**
   * Verifies that the container encloses all particles, surrounding them on all sides.
   * @param {Particle[]} particles
   * @param {GasPropertiesContainer} container
   */
  function assertContainerEnclosesParticles( container, particles ) {
    for ( let i = 0; i < particles.length; i++ ) {
      assert && assert( container.enclosesParticle( particles[ i ] ),
        `container does not enclose particle: ${particles[ i ].toString()}` );
    }
  }

  /**
   * Identifies particles that have escaped via the opening in the top of the container, and
   * moves them from insideParticles to outsideParticles.
   * @param {GasPropertiesContainer} container
   * @param {NumberProperty} numberOfParticlesProperty - number of particles inside the container
   * @param {Particle[]} insideParticles - particles inside the container
   * @param {Particle[]} outsideParticles - particles outside the container
   */
  function escapeParticles( container, numberOfParticlesProperty, insideParticles, outsideParticles ) {
    for ( let i = 0; i < insideParticles.length; i++ ) {
      const particle = insideParticles[ i ];
      if ( particle.top > container.top &&
           particle.left > container.openingLeft &&
           particle.right < container.openingRight ) {
        insideParticles.splice( insideParticles.indexOf( particle ), 1 );
        numberOfParticlesProperty.value--;
        outsideParticles.push( particle );
      }
    }
  }

  return gasProperties.register( 'GasPropertiesModel', GasPropertiesModel );
} );