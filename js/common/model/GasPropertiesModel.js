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
  const HoldConstantEnum = require( 'GAS_PROPERTIES/common/model/HoldConstantEnum' );
  const LightParticle = require( 'GAS_PROPERTIES/common/model/LightParticle' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const ParticleUtils = require( 'GAS_PROPERTIES/common/model/ParticleUtils' );
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
  // multiplier for converting pressure to kPa
  const PRESSURE_CONVERSION_SCALE = 1.66E6; //TODO handle this in view?

  class GasPropertiesModel extends BaseModel {

    /**
     * @param {Tandem} tandem
     * @param {Object} [options]
     */
    constructor( tandem, options ) {

      options = _.extend( {
        holdConstant: HoldConstantEnum.NOTHING,
        hasCollisionCounter: true,
        leftWallDoesWork: false
      }, options );

      super();

      // @public the quantity to hold constant
      this.holdConstantProperty = new EnumerationProperty( HoldConstantEnum, options.holdConstant );

      // @public (read-only) together these arrays make up the 'particle system'
      this.heavyParticles = []; // {HeavyParticle[]} inside the container
      this.lightParticles = []; // {LightParticle[]} inside the container
      this.heavyParticlesOutside = []; // {HeavyParticle[]} outside the container
      this.lightParticlesOutside = []; // {LightParticle[]} outside the container

      // @public emit is called when any of the above Particle arrays are modified
      this.numberOfParticlesChangedEmitter = new Emitter();

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
        this.updateNumberOfParticles( newValue, oldValue, this.heavyParticles, HeavyParticle );
      } );
      this.numberOfLightParticlesProperty.link( ( newValue, oldValue ) => {
        this.updateNumberOfParticles( newValue, oldValue, this.lightParticles, LightParticle );
      } );

      // @private
      this.totalNumberOfParticlesProperty = new DerivedProperty(
        [ this.numberOfHeavyParticlesProperty, this.numberOfLightParticlesProperty ],
        ( numberOfHeavyParticles, numberOfLightParticles ) => numberOfHeavyParticles + numberOfLightParticles, {
          valueType: 'number',
          isValidValue: value => value >= 0
        }
      );

      // @public whether initial temperature is controlled by the user or determined by what's in the container
      this.controlTemperatureEnabledProperty = new BooleanProperty( false );

      // @public initial temperature of particles added to the container, in K.
      // Ignored if !controlTemperatureEnabledProperty.value
      this.initialTemperatureProperty = new NumberProperty( INITIAL_TEMPERATURE_RANGE.defaultValue, {
        range: INITIAL_TEMPERATURE_RANGE,
        units: 'K'
      } );

      // @public (read-only)
      this.container = new GasPropertiesContainer( {
        leftWallDoesWork: options.leftWallDoesWork
      } );

      // @public (read-only)
      this.collisionDetector = new CollisionDetector( this.container, [ this.heavyParticles, this.lightParticles ] );

      // @public the factor to heat or cool the contents of the container. 1 is max heat, -1 is max cool, 0 is no change.
      this.heatCoolFactorProperty = new NumberProperty( 0, {
        range: new Range( -1, 1 )
      } );

      // @public {Property.<number|null>} temperature in the container, in K. Value is null when the container is empty.
      this.temperatureProperty = new Property( null, {
        isValidValue: value => ( value === null || ( typeof value === 'number' && value >= 0 ) ),
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
      this.pressureGauge = new PressureGauge( this.pressureProperty, this.temperatureProperty );

      // @private whether to call stepPressure
      this.stepPressureEnabled = false;

      // When adding particles to an empty container, don't update pressure until 1 particle has collided with the container.
      this.totalNumberOfParticlesProperty.link( totalNumberOfParticles => {
        if ( totalNumberOfParticles === 0 ) {
          this.stepPressureEnabled = false;
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

      //TODO better names and doc for these Emitters
      // @public (read-only) Emitters related to OopsDialogs
      this.oops1Emitter = new Emitter();
      this.oops2Emitter = new Emitter();
      this.oops3Emitter = new Emitter();
      this.oops4Emitter = new Emitter();

      this.totalNumberOfParticlesProperty.link( totalNumberOfParticles => {
        if ( totalNumberOfParticles === 0 && this.holdConstantProperty.value === HoldConstantEnum.TEMPERATURE ) {

          // Temperature can't be held constant when the container is empty.
          this.oops1Emitter.emit();
          this.holdConstantProperty.value = HoldConstantEnum.NOTHING;
        }
        else if ( totalNumberOfParticles === 0 &&
                  ( this.holdConstantProperty.value === HoldConstantEnum.PRESSURE_T ||
                    this.holdConstantProperty.value === HoldConstantEnum.PRESSURE_V ) ) {

          // Pressure can't be held constant when the container is empty.
          this.oops2Emitter.emit();
          this.holdConstantProperty.value = HoldConstantEnum.NOTHING;
        }
      } );

      this.holdConstantProperty.link( holdConstant => {
        //TODO assert !( holdConstant === HoldConstantEnum.TEMPERATURE && totalNumberOfParticles === 0 )
        //TODO assert !( holdConstant === HoldConstantEnum.PRESSURE_V && pressure === 0 )
        //TODO assert !( holdConstant === HoldConstantEnum.PRESSURE_T && pressure === 0 )
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

      super.stepModelTime( dt );

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
        ParticleUtils.escapeParticles( this.container, this.numberOfLightParticlesProperty,
          this.lightParticles, this.lightParticlesOutside );
      }

      // Container, to compute velocity of movable left wall.
      this.container.step( dt );

      // Collision detection and response
      this.collisionDetector.step( dt );

      // Remove particles that have left the model bounds
      ParticleUtils.removeParticlesOutOfBounds( this.heavyParticlesOutside, this.modelBoundsProperty.value );
      ParticleUtils.removeParticlesOutOfBounds( this.lightParticlesOutside, this.modelBoundsProperty.value );

      // Do this after collision detection, so that the number of collisions detected has been recorded.
      this.collisionCounter && this.collisionCounter.step( dt );

      // Compute temperature. Do this before pressure, because pressure depends on temperature.
      this.temperatureProperty.value = this.computeTemperature();

      // When adding particles to an empty container, don't update pressure until 1 particle has collided with the container.
      if ( !this.stepPressureEnabled && this.collisionDetector.numberOfParticleContainerCollisions > 0 ) {
        this.stepPressureEnabled = true;
      }

      // Step pressure
      this.stepPressureEnabled && this.stepPressure( dt );
    }

    /**
     * Adjusts an array of particles to have the desired number of elements.
     * @param {number} newValue - new number of particles
     * @param {number} oldValue - old number of particles
     * @param {Particle[]} particles - array of particles that corresponds to newValue and oldValue
     * @param particleConstructor - constructor for elements in particles array
     * @private
     */
    updateNumberOfParticles( newValue, oldValue, particles, particleConstructor ) {
      if ( particles.length !== newValue ) {
        const delta = newValue - oldValue;
        if ( delta > 0 ) {
          this.addParticles( delta, particles, particleConstructor );
        }
        else if ( delta < 0 ) {
          ParticleUtils.removeParticles( -delta, particles );
        }
        assert && assert( particles.length === newValue, 'particles array is out of sync' );
        this.numberOfParticlesChangedEmitter.emit();
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
      else if ( this.temperatureProperty.value !== null ) {

        // Current temperature in the non-empty container
        meanTemperature = this.temperatureProperty.value;
      }
      assert && assert( typeof meanTemperature === 'number' && meanTemperature > 0,
        `bad meanTemperature: ${meanTemperature}` );

      // Create a set of temperature values that will be used to compute initial speed.
      let temperatures = null;
      if ( n !== 1 && this.collisionDetector.particleParticleCollisionsEnabledProperty.value ) {

        // For groups of particles with particle-particle collisions enabled, create some deviation in the
        // temperature used to compute speed, but maintain the desired mean.  This makes the motion of a group
        // of particles look less wave-like. We do this for temperature instead of speed because temperature
        // in the container is T = (2/3)KE/k, and KE is a function of speed^2, so deviation in speed would
        // change the desired temperature.
        temperatures = GasPropertiesUtils.getGaussianValues( n, meanTemperature, 0.2 * meanTemperature, 1E-3 );
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
     * Gets the temperature in the container.
     * @returns {number|null} in K, null if the container is empty
     * @private
     */
    computeTemperature() {
      let temperature = null;
      const n = this.totalNumberOfParticlesProperty.value;
      if ( n > 0 ) {

        // Compute the average kinetic energy, AMU * pm^2 / ps^2
        let totalKineticEnergy = 0;
        for ( let i = 0; i < this.heavyParticles.length; i++ ) {
          totalKineticEnergy += this.heavyParticles[ i ].getKineticEnergy();
        }
        for ( let i = 0; i < this.lightParticles.length; i++ ) {
          totalKineticEnergy += this.lightParticles[ i ].getKineticEnergy();
        }

        const averageKineticEnergy = totalKineticEnergy / n;

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

      const N = this.totalNumberOfParticlesProperty.value; // N, number of particles
      const k = GasPropertiesConstants.BOLTZMANN; // k, in (pm^2 * AMU)/(ps^2 * K)
      const T = this.temperatureProperty.value; // T, in K
      assert && assert( typeof T === 'number' && T > 0, `invalid temperature: ${T}` );
      const V = this.container.getVolume(); // V, in pm^3

      // P = NkT/V, converted to kPa
      return ( N * k * T / V ) * PRESSURE_CONVERSION_SCALE;
    }

    /**
     * Steps pressure. This either updates pressure, or updates related quantities if pressure is being held constant.
     * @private
     */
    stepPressure( dt ) {
      assert && assert( this.stepPressureEnabled, 'stepPressureEnabled must be enabled' );

      const holdPressureConstant = ( this.holdConstantProperty.value === HoldConstantEnum.PRESSURE_T ||
                                     this.holdConstantProperty.value === HoldConstantEnum.PRESSURE_V );

      if ( this.pressureProperty.value === 0 || !holdPressureConstant ) {

        // update pressure
        this.pressureProperty.value = this.computePressure();

        // If pressure exceeds the maximum, blow the lid off of the container.
        if ( this.pressureProperty.value > GasPropertiesQueryParameters.maxPressure ) {
          this.container.lidIsOnProperty.value = false;
        }
      }
      else if ( this.holdConstantProperty.value === HoldConstantEnum.PRESSURE_T ) {

        //TODO #88 scale the velocity of all particles in the container
        // hold pressure constant by changing temperature, T = PV/Nk
        const P = this.pressureProperty.value / PRESSURE_CONVERSION_SCALE;
        assert && assert( P !== 0, `unexpected pressure: ${P}` );
        const N = this.totalNumberOfParticlesProperty.value;
        const V = this.container.getVolume();
        const k = GasPropertiesConstants.BOLTZMANN;
        this.temperatureProperty.value = ( P * V ) / ( N * k );
      }
      else if ( this.holdConstantProperty.value === HoldConstantEnum.PRESSURE_V ) {

        // hold pressure constant by changing volume, V = NkT/P
        const N = this.totalNumberOfParticlesProperty.value;
        const k = GasPropertiesConstants.BOLTZMANN;
        const T = this.temperatureProperty.value;
        const P = this.pressureProperty.value / PRESSURE_CONVERSION_SCALE;
        assert && assert( P !== 0, `unexpected pressure: ${P}` );
        const V = ( N * k * T ) / P;
        let containerWidth = V / ( this.container.height * this.container.depth );

        if ( !this.container.widthRange.contains( containerWidth ) ) {

          // This results in an OopsDialog being displayed
          if ( containerWidth > this.container.widthRange.max ) {
            this.oops3Emitter.emit();
          }
          else {
            this.oops4Emitter.emit();
          }

          // Switch to the 'Nothing' mode
          this.holdConstantProperty.value = HoldConstantEnum.NOTHING;

          // Set the container width to its min or max.
          containerWidth = this.container.widthRange.constrainValue( containerWidth );
        }

        this.container.resize( containerWidth );
      }
      else {
        throw new Error( 'programming error, some case is not handled' );
      }

      // Step the gauge regardless of whether we've changed pressure, since the gauge updates on a sample period.
      this.pressureGauge.step( dt, !holdPressureConstant /* jitterEnabled */ );
    }

    /**
     * Redistributes the particles in the container, called in response to changing the container width.
     * @param {number} ratio
     * @public
     */
    redistributeParticles( ratio ) {
      ParticleUtils.redistributeParticles( this.heavyParticles, ratio );
      ParticleUtils.redistributeParticles( this.lightParticles, ratio );
    }
  }

  return gasProperties.register( 'GasPropertiesModel', GasPropertiesModel );
} );