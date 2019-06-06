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
  const Emitter = require( 'AXON/Emitter' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesContainer = require( 'GAS_PROPERTIES/common/model/GasPropertiesContainer' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const GasPropertiesUtils = require( 'GAS_PROPERTIES/common/GasPropertiesUtils' );
  const HeavyParticle = require( 'GAS_PROPERTIES/common/model/HeavyParticle' );
  const HoldConstant = require( 'GAS_PROPERTIES/common/model/HoldConstant' );
  const LightParticle = require( 'GAS_PROPERTIES/common/model/LightParticle' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const ParticleUtils = require( 'GAS_PROPERTIES/common/model/ParticleUtils' );
  const PressureGauge = require( 'GAS_PROPERTIES/common/model/PressureGauge' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const RangeWithValue = require( 'DOT/RangeWithValue' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Thermometer = require( 'GAS_PROPERTIES/common/model/Thermometer' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants

  // used to compute the initial velocity angle for particles, in radians
  const PUMP_DISPERSION_ANGLE = Math.PI / 2;

  // temperature used to compute initial speed of particles, in K
  const INITIAL_TEMPERATURE_RANGE = new RangeWithValue( 50, 1000, 300 );

  // maximum pressure in kPa, when exceeded the lid blows off of the container
  const MAX_PRESSURE = GasPropertiesQueryParameters.maxPressure;

  // multiplier for converting pressure from AMU/(pm * ps^2) to kPa, provided by @arouinfar
  const PRESSURE_CONVERSION_SCALE = 1.66E6;

  class GasPropertiesModel extends BaseModel {

    /**
     * @param {Tandem} tandem
     * @param {Object} [options]
     */
    constructor( tandem, options ) {
      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      options = _.extend( {

        // superclass options
        holdConstant: HoldConstant.NOTHING,
        hasCollisionCounter: true,
        leftWallDoesWork: false
      }, options );

      super( tandem );

      // @public (read-only) together these arrays make up the 'particle system'
      this.heavyParticles = []; // {HeavyParticle[]} heavy particles inside the container
      this.lightParticles = []; // {LightParticle[]} light particles inside the container
      this.heavyParticlesOutside = []; // {HeavyParticle[]} heavy particles outside the container
      this.lightParticlesOutside = []; // {LightParticle[]} light particles outside the container

      // @public for iterating over all particles inside the container
      this.insideParticleArrays = [ this.heavyParticles, this.lightParticles ];

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
      const createHeavyParticle = ( options ) => new HeavyParticle( options );
      this.numberOfHeavyParticlesProperty.link( ( newValue, oldValue ) => {
        this.updateNumberOfParticles( newValue, oldValue, this.heavyParticles, createHeavyParticle );
        assert && assert( GasPropertiesUtils.isArrayOf( this.heavyParticles, HeavyParticle ),
          'heavyParticles should contain only HeavyParticle' );
      } );
      const createLightParticle = ( options ) => new LightParticle( options );
      this.numberOfLightParticlesProperty.link( ( newValue, oldValue ) => {
        this.updateNumberOfParticles( newValue, oldValue, this.lightParticles, createLightParticle );
        assert && assert( GasPropertiesUtils.isArrayOf( this.lightParticles, LightParticle ),
          'lightParticles should contain only LightParticle' );
      } );

      // @public total number of particles in the container
      this.totalNumberOfParticlesProperty = new DerivedProperty(
        [ this.numberOfHeavyParticlesProperty, this.numberOfLightParticlesProperty ],
        ( numberOfHeavyParticles, numberOfLightParticles ) => numberOfHeavyParticles + numberOfLightParticles, {
          numberType: 'Integer',
          valueType: 'number',
          isValidValue: value => value >= 0
        }
      );

      // @public (read-only)
      this.container = new GasPropertiesContainer( {
        leftWallDoesWork: options.leftWallDoesWork
      } );

      // @public (read-only)
      this.collisionDetector = new CollisionDetector( this.container, [ this.heavyParticles, this.lightParticles ] );

      // @public the quantity to hold constant
      this.holdConstantProperty = new EnumerationProperty( HoldConstant, options.holdConstant );

      // @public whether initial temperature is controlled by the user or determined by what's in the container
      this.controlTemperatureEnabledProperty = new BooleanProperty( false );

      // @public initial temperature of particles added to the container, in K.
      // Ignored if !controlTemperatureEnabledProperty.value
      this.initialTemperatureProperty = new NumberProperty( INITIAL_TEMPERATURE_RANGE.defaultValue, {
        range: INITIAL_TEMPERATURE_RANGE,
        units: 'K'
      } );

      // @public the factor to heat or cool the contents of the container. 1 is max heat, -1 is max cool, 0 is no change.
      this.heatCoolFactorProperty = new NumberProperty( 0, {
        range: new Range( -1, 1 )
      } );

      // @public {Property.<number|null>} temperature in the container, in K. Value is null when the container is empty.
      this.temperatureProperty = new Property( null, {
        isValidValue: value => ( value === null || ( typeof value === 'number' && value >= 0 ) ),
        units: 'K'
      } );

      // @public (read-only) thermometer that display temperatureProperty with a choice of units
      this.thermometer = new Thermometer( this.temperatureProperty );

      // @public pressure in the container, in kPa
      this.pressureProperty = new NumberProperty( 0, {
        isValidValue: value => ( value >= 0 ),
        units: 'kPa'
      } );

      // @public (read-only) gauge that display pressureProperty with a choice of units
      this.pressureGauge = new PressureGauge( this.pressureProperty, this.temperatureProperty );

      // @private whether to update pressure
      this.updatePressureEnabled = false;

      // @public (read-only)
      this.collisionCounter = null;
      if ( options.hasCollisionCounter ) {
        this.collisionCounter = new CollisionCounter( this.collisionDetector, {
          location: new Vector2( 40, 15 ) // view coordinates! determined empirically
        } );
      }

      // @public (read-only) Emitters for conditions related to the 'Hold Constant' feature.
      // When holding a quantity constant would break the model, the model switches to 'Nothing' mode, the model
      // notifies the view via an Emitter, and the view notifies the user via a dialog. This is called oopsEmitters
      // because the end result is that the user sees an OopsDialog, with a message of the form 'Oops! blah blah'.
      // It was difficult to find names for these Emitters that weren't overly verbose, so the names are
      // highly-abbreviated versions of the messages that the user will see, and they are grouped in an object
      // named oopsEmitters.
      this.oopsEmitters = {

        // Oops! Temperature cannot be held constant when the container is empty.
        temperatureEmptyEmitter: new Emitter(),

        // Oops! Pressure cannot be held constant when the container is empty.
        pressureEmptyEmitter: new Emitter(),

        // Oops! Pressure cannot be held constant. Volume would be too large.
        pressureLargeEmitter: new Emitter(),

        // Oops! Pressure cannot be held constant. Volume would be too small.
        pressureSmallEmitter: new Emitter()
      };

      // When the number of particles in the container changes ...
      this.totalNumberOfParticlesProperty.link( totalNumberOfParticles => {

        // If the container is empty, check for 'hold constant' conditions that can't be satisfied.
        if ( totalNumberOfParticles === 0 ) {
          if ( this.holdConstantProperty.value === HoldConstant.TEMPERATURE ) {

            // Temperature can't be held constant when the container is empty.
            phet.log && phet.log( 'Oops! T cannot be held constant when N=0' );
            this.holdConstantProperty.value = HoldConstant.NOTHING;
            this.oopsEmitters.temperatureEmptyEmitter.emit();
          }
          else if ( this.holdConstantProperty.value === HoldConstant.PRESSURE_T ||
                    this.holdConstantProperty.value === HoldConstant.PRESSURE_V ) {

            // Pressure can't be held constant when the container is empty.
            phet.log && phet.log( 'Oops! P cannot be held constant when N=0' );
            this.holdConstantProperty.value = HoldConstant.NOTHING;
            this.oopsEmitters.pressureEmptyEmitter.emit();
          }
        }

        // If the container is empty, set pressure to zero and disable pressure updates.
        // Updates will be enabled when 1 particle has collided with the container.
        if ( totalNumberOfParticles === 0 ) {
          this.pressureProperty.value = 0;
          this.updatePressureEnabled = false;
        }

        // If the number of particles changes while the sim is paused, update immediately.
        if ( !this.isPlayingProperty.value ) {
          this.updateWhenPaused();
        }
      } );

      // If the container's width changes while the sim is paused, update immediately.
      this.container.widthProperty.link( width => {
        if ( !this.isPlayingProperty.value ) {
          this.updateWhenPaused();
        }
      } );

      // Verify that we're not in a bad state.
      assert && this.holdConstantProperty.link( holdConstant => {

        // values that are incompatible with an empty container
        assert && assert( !( this.totalNumberOfParticlesProperty.value === 0 &&
        ( holdConstant === HoldConstant.TEMPERATURE ||
          holdConstant === HoldConstant.PRESSURE_T ||
          holdConstant === HoldConstant.PRESSURE_V ) ),
          `bad holdConstant state: ${holdConstant} with totalNumberOfParticles=${this.totalNumberOfParticlesProperty.value}` );

        // values that are incompatible with zero pressure
        assert && assert( !( this.pressureProperty.value === 0 &&
        ( holdConstant === HoldConstant.PRESSURE_V ||
          holdConstant === HoldConstant.PRESSURE_T ) ),
          `bad holdConstant state: ${holdConstant} with pressure=${this.pressureProperty.value}` );
      } );
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
      this.heatCoolFactorProperty.reset();

      // Remove and dispose of particles
      this.numberOfHeavyParticlesProperty.reset();
      assert && assert( this.heavyParticles.length === 0, 'there should be no heavyParticles' );
      this.numberOfLightParticlesProperty.reset();
      assert && assert( this.lightParticles.length === 0, 'there should be no lightParticles' );
      ParticleUtils.removeAllParticles( this.heavyParticlesOutside );
      assert && assert( this.heavyParticlesOutside.length === 0, 'there should be no heavyParticlesOutside' );
      ParticleUtils.removeAllParticles( this.lightParticlesOutside );
      assert && assert( this.lightParticlesOutside.length === 0, 'there should be no lightParticlesOutside' );
    }

    /**
     * Steps the model using model time units.
     * @param {number} dt - time delta, in ps
     * @protected
     * @override
     */
    stepModelTime( dt ) {
      assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );

      // Animate the container's width with a speed limit. Do this before super.step because it affects
      // the subsequent computation of wall velocity. See #90.
      this.container.stepWidth( this.timeTransform( dt ) );

      super.stepModelTime( dt );

      // step the particle system
      this.stepParticleSystem( dt );

      // update things that are dependent on the state of the particle system
      this.updateModel( dt, this.collisionDetector.numberOfParticleContainerCollisions );
    }

    /**
     * Steps the things that affect the location and velocity of particles, including heating/cooling
     * and collision detection/response.
     * @param {number} dt - time delta, in ps
     * @private
     */
    stepParticleSystem( dt ) {
      assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );

      // Apply heat/cool
      if ( this.heatCoolFactorProperty.value !== 0 ) {
        ParticleUtils.heatCoolParticles( this.heavyParticles, this.heatCoolFactorProperty.value );
        ParticleUtils.heatCoolParticles( this.lightParticles, this.heatCoolFactorProperty.value );
      }

      // Step particles
      ParticleUtils.stepParticles( this.heavyParticles, dt );
      ParticleUtils.stepParticles( this.lightParticles, dt );
      ParticleUtils.stepParticles( this.heavyParticlesOutside, dt );
      ParticleUtils.stepParticles( this.lightParticlesOutside, dt );

      // Allow particles to escape from the opening in the top of the container
      if ( this.container.isLidOpen() ) {

        ParticleUtils.escapeParticles( this.container, this.numberOfHeavyParticlesProperty,
          this.heavyParticles, this.heavyParticlesOutside, );
        assert && assert( GasPropertiesUtils.isArrayOf( this.heavyParticlesOutside, HeavyParticle ),
          'heavyParticlesOutside should contain only HeavyParticle' );

        ParticleUtils.escapeParticles( this.container, this.numberOfLightParticlesProperty,
          this.lightParticles, this.lightParticlesOutside );
        assert && assert( GasPropertiesUtils.isArrayOf( this.lightParticlesOutside, LightParticle ),
          'lightParticlesOutside should contain only LightParticle' );
      }

      // Step container, to compute velocity of movable left wall.
      this.container.step( dt );

      // Collision detection and response
      this.collisionDetector.update();

      // Remove particles that have left the model bounds
      ParticleUtils.removeParticlesOutOfBounds( this.heavyParticlesOutside, this.modelBoundsProperty.value );
      ParticleUtils.removeParticlesOutOfBounds( this.lightParticlesOutside, this.modelBoundsProperty.value );

      // Do this after collision detection, so that the number of collisions detected has been recorded.
      this.collisionCounter && this.collisionCounter.step( dt );
    }

    /**
     * Updates parts of the model that are dependent on the state of the particle system.  This is separated from
     * stepParticleSystem so that we can update if the number of particles changes while the simulation is paused.
     * @param {number} dtPressureGauge - time delta used to step the pressure gauge, in ps
     * @param {number} numberOfCollisions - number of collisions on the most recent time step
     * @private
     */
    updateModel( dtPressureGauge, numberOfCollisions ) {
      assert && assert( typeof dtPressureGauge === 'number' && dtPressureGauge > 0,
        `invalid dtPressureGauge: ${dtPressureGauge}` );
      assert && assert( typeof numberOfCollisions === 'number' && numberOfCollisions >= 0,
        `invalid numberOfCollisions: ${numberOfCollisions}` );

      // Adjust quantities to compensate for holdConstant mode. Do this before computing temperature or pressure.
      this.compensateForHoldConstant();

      // Compute temperature. Do this before pressure, because pressure depends on temperature.
      this.temperatureProperty.value = this.computeActualTemperature();

      // When adding particles to an empty container, don't compute pressure until 1 particle has collided with the container.
      if ( !this.updatePressureEnabled && numberOfCollisions > 0 ) {
        this.updatePressureEnabled = true;
      }

      // Compute pressure
      if ( this.updatePressureEnabled ) {

        // Compute the actual pressure, based on the state of the particle system
        this.pressureProperty.value = this.computePressure();

        // Disable jitter when we're holding pressure constant.
        const jitterEnabled = !( this.holdConstantProperty.value === HoldConstant.PRESSURE_T ||
                                 this.holdConstantProperty.value === HoldConstant.PRESSURE_V );

        // Step the gauge regardless of whether pressure has changed, since the gauge updates on a sample period.
        this.pressureGauge.step( dtPressureGauge, jitterEnabled );

        // If pressure exceeds the maximum, blow the lid off of the container.
        if ( this.pressureProperty.value > MAX_PRESSURE ) {
          this.container.lidIsOnProperty.value = false;
        }
      }
    }

    /**
     * Updates when the sim is paused.
     * @private
     */
    updateWhenPaused() {
      assert && assert( !this.isPlayingProperty.value, 'call this method only when paused' );

      // Using the pressure gauge's refresh period causes it to update immediately.
      this.updateModel( PressureGauge.REFRESH_PERIOD, 0 /* numberOfCollisions */ );
    }

    /**
     * Adjusts an array of particles to have the desired number of elements.
     * @param {number} newValue - new number of particles
     * @param {number} oldValue - old number of particles
     * @param {Particle[]} particles - array of particles that corresponds to newValue and oldValue
     * @param {function(options:*):Particle} createParticle - creates a Particle instance
     * @private
     */
    updateNumberOfParticles( newValue, oldValue, particles, createParticle ) {
      assert && assert( typeof newValue === 'number', `invalid newValue: ${newValue}` );
      assert && assert( oldValue === null || typeof oldValue === 'number', `invalid oldValue: ${oldValue}` );
      assert && assert( Array.isArray( particles ), `invalid particles: ${particles}` );
      assert && assert( typeof createParticle === 'function', `invalid createParticle: ${createParticle}` );

      if ( particles.length !== newValue ) {
        const delta = newValue - oldValue;
        if ( delta > 0 ) {
          this.addParticles( delta, particles, createParticle );
        }
        else if ( delta < 0 ) {
          ParticleUtils.removeParticles( -delta, particles );
        }
        assert && assert( particles.length === newValue, 'particles array is out of sync' );
      }
    }

    /**
     * Adds n particles to the end of the specified array.
     * @param {number} n
     * @param {Particle[]} particles
     * @param {function(options:*):Particle} createParticle - creates a Particle instance
     * @private
     */
    addParticles( n, particles, createParticle ) {
      assert && assert( typeof n === 'number' && n > 0, `invalid n: ${n}` );
      assert && assert( Array.isArray( particles ), `invalid particles: ${particles}` );
      assert && assert( typeof createParticle === 'function', `invalid createParticle: ${createParticle}` );

      // Get the temperature that will be used to compute initial velocity magnitude.
      const initialTemperature = this.getInitialTemperature();

      // Create a set of temperature values that will be used to compute initial speed.
      let temperatures = null;
      if ( n !== 1 && this.collisionDetector.particleParticleCollisionsEnabledProperty.value ) {

        // For groups of particles with particle-particle collisions enabled, create some deviation in the
        // temperature used to compute speed, but maintain the desired mean.  This makes the motion of a group
        // of particles look less wave-like. We do this for temperature instead of speed because temperature
        // in the container is T = (2/3)KE/k, and KE is a function of speed^2, so deviation in speed would
        // change the desired temperature.
        temperatures = GasPropertiesUtils.getGaussianValues( n, initialTemperature, 0.2 * initialTemperature, 1E-3 );
      }
      else {

        // For single particles, or if particle-particle collisions are disabled, use the same temperature
        // for all particles. For groups of particles, this yields wave-like motion.
        temperatures = [];
        for ( let i = 0; i < n; i++ ) {
          temperatures[ i ] = initialTemperature;
        }
      }

      // Create n particles
      for ( let i = 0; i < n; i++ ) {
        assert && assert( i < temperatures.length, `index out of range, i: ${i}` );

        const particle = createParticle();

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
     * Gets the temperature that will be used to compute initial velocity magnitude.
     * @returns {number} in K
     * @private
     */
    getInitialTemperature() {

      let initialTemperature = null;

      if ( this.controlTemperatureEnabledProperty.value ) {

        // User's setting
        initialTemperature = this.initialTemperatureProperty.value;
      }
      else if ( this.temperatureProperty.value !== null ) {

        // Current temperature in a non-empty container
        initialTemperature = this.temperatureProperty.value;
      }
      else {

        // Default for empty container
        initialTemperature = INITIAL_TEMPERATURE_RANGE.defaultValue;
      }

      assert && assert( typeof initialTemperature === 'number' && initialTemperature > 0,
        `bad initialTemperature: ${initialTemperature}` );
      return initialTemperature;
    }

    /**
     * Adjusts quantities to compensate for the quantity that is being held constant.
     * @private
     */
    compensateForHoldConstant() {

      if ( this.holdConstantProperty.value === HoldConstant.PRESSURE_V ) {

        // hold pressure constant by changing volume
        let containerWidth = this.computeVolume() / ( this.container.height * this.container.depth );

        // Address floating-point error, see https://github.com/phetsims/gas-properties/issues/89
        containerWidth = Util.toFixedNumber( containerWidth, 5 );

        // If the desired container width is out of range ...
        if ( !this.container.widthRange.contains( containerWidth ) ) {

          // Switch to the 'Nothing' mode
          this.holdConstantProperty.value = HoldConstant.NOTHING;

          // This results in an OopsDialog being displayed
          phet.log && phet.log( 'Oops! P cannot be held constant when V exceeds range, ' +
                                `containerWidth=${containerWidth} widthRange=${this.container.widthRange}` );
          if ( containerWidth > this.container.widthRange.max ) {
            this.oopsEmitters.pressureLargeEmitter.emit();
          }
          else {
            this.oopsEmitters.pressureSmallEmitter.emit();
          }

          // Constrain the container width to its min or max.
          containerWidth = this.container.widthRange.constrainValue( containerWidth );
        }

        // Change the container's width immediately, with no animation.
        this.container.resizeImmediately( containerWidth );
      }
      else if ( this.holdConstantProperty.value === HoldConstant.PRESSURE_T ) {

        // Hold pressure constant by adjusting particle velocities to result in a desired temperature.
        const desiredTemperature = this.computeDesiredTemperature();
        this.adjustParticleVelocitiesForTemperature( desiredTemperature );
        this.temperatureProperty.value = desiredTemperature;
      }
    }

    /**
     * Computes pressure using the Ideal Gas Law, P = NkT/V
     * @returns {number} in kPa
     * @private
     */
    computePressure() {

      const N = this.totalNumberOfParticlesProperty.value;
      const k = GasPropertiesConstants.BOLTZMANN; // (pm^2 * AMU)/(ps^2 * K)
      const T = this.temperatureProperty.value; // in K, assumes the this.temperatureProperty has been updated
      assert && assert( typeof T === 'number' && T >= 0, `invalid temperature: ${T}` );
      const V = this.container.getVolume(); // pm^3
      const P = ( N * k * T / V );

      // converted to kPa
      return P * PRESSURE_CONVERSION_SCALE;
    }

    /**
     * Computes volume using the Ideal Gas Law, V = NkT/P
     * @returns {number} in pm^3
     * @private
     */
    computeVolume() {
      const N = this.totalNumberOfParticlesProperty.value;
      const k = GasPropertiesConstants.BOLTZMANN; // (pm^2 * AMU)/(ps^2 * K)
      const T = this.computeActualTemperature(); // in K, this.temperatureProperty has not been updated, so compute T
      const P = this.pressureProperty.value / PRESSURE_CONVERSION_SCALE;
      assert && assert( P !== 0, 'zero pressure not supported' );
      return ( N * k * T ) / P;
    }

    /**
     * Computes a desired temperature using the Ideal Gas Law, T = (PV)/(Nk)
     * @returns {number} in K
     * @private
     */
    computeDesiredTemperature() {
      const P = this.pressureProperty.value / PRESSURE_CONVERSION_SCALE;
      assert && assert( P !== 0, 'zero pressure not supported' );
      const N = this.totalNumberOfParticlesProperty.value;
      assert && assert( N !== 0, 'empty container not supported' );
      const V = this.container.getVolume(); // pm^3
      const k = GasPropertiesConstants.BOLTZMANN; // (pm^2 * AMU)/(ps^2 * K)
      return ( P * V ) / ( N * k );
    }

    /**
     * Computes the actual temperature, which is a measure of the kinetic energy of the particles in the container.
     * @returns {number|null} in K, null if the container is empty
     * @private
     */
    computeActualTemperature() {
      let temperature = null;
      const n = this.totalNumberOfParticlesProperty.value;
      if ( n > 0 ) {
        const averageKineticEnergy = this.getAverageKineticEnergy(); // AMU * pm^2 / ps^2
        const k = GasPropertiesConstants.BOLTZMANN; // (pm^2 * AMU)/(ps^2 * K)

        // T = (2/3)KE/k
        temperature = ( 2 / 3 ) * averageKineticEnergy / k; // K
      }
      return temperature;
    }

    /**
     * Redistributes the particles in the container, called in response to changing the container width.
     * @param {number} ratio
     * @public
     */
    redistributeParticles( ratio ) {
      assert && assert( typeof ratio === 'number', `invalid ratio: ${ratio}` );

      ParticleUtils.redistributeParticles( this.heavyParticles, ratio );
      ParticleUtils.redistributeParticles( this.lightParticles, ratio );
    }

    /**
     * Gets the average kinetic energy of the particles in the container.
     * @returns {number} in AMU * pm^2 / ps^2
     * @private
     */
    getAverageKineticEnergy() {
      return this.getTotalKineticEnergy() / this.totalNumberOfParticlesProperty.value;
    }

    /**
     * Gets the total kinetic energy of the particles in the container.
     * @returns {number} in AMU * pm^2 / ps^2
     * @private
     */
    getTotalKineticEnergy() {
      return ParticleUtils.getTotalKineticEnergy( this.heavyParticles ) +
             ParticleUtils.getTotalKineticEnergy( this.lightParticles );
    }

    /**
     * Adjusts velocities of particle inside the container so that the resulting temperature matches
     * a specified temperature.
     * @param {number} temperature
     * @private
     */
    adjustParticleVelocitiesForTemperature( temperature ) {
      assert && assert( typeof temperature === 'number', `invalid temperature: ${temperature}` );

      const desiredAverageKE = ( 3 / 2 ) * temperature * GasPropertiesConstants.BOLTZMANN; // KE = (3/2)Tk
      const actualAverageKE = this.getAverageKineticEnergy();
      const ratio = desiredAverageKE / actualAverageKE;

      for ( let i = 0; i < this.insideParticleArrays.length; i++ ) {
        const particles = this.insideParticleArrays[ i ];
        for ( let j = 0; j < particles.length; j++ ) {
          const particle = particles[ j ];
          const actualParticleKE = particle.getKineticEnergy();
          const desiredParticleKE = ratio * actualParticleKE;
          const desiredSpeed = Math.sqrt( 2 * desiredParticleKE / particle.mass ); // |v| = Math.sqrt( 2 * KE / m )
          particle.setVelocityMagnitude( desiredSpeed );
        }
      }

      assert && assert( Math.abs( temperature - this.computeActualTemperature() < 1E-3 ),
        'actual temperature does not match desired temperature' );
    }
  }

  return gasProperties.register( 'GasPropertiesModel', GasPropertiesModel );
} );