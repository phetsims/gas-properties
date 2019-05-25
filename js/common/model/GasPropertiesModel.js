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
  const Tandem = require( 'TANDEM/Tandem' );
  const Thermometer = require( 'GAS_PROPERTIES/common/model/Thermometer' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  // radians, used to compute initial velocity angle for particles
  const PUMP_DISPERSION_ANGLE = Math.PI / 2;
  // K, temperature used to compute initial speed of particles
  const INITIAL_TEMPERATURE_RANGE = new RangeWithValue( 50, 1000, 300 );
  // multiplier for converting pressure from AMU/(pm * ps^2) to kPa
  const PRESSURE_CONVERSION_SCALE = 1.66E6;

  class GasPropertiesModel extends BaseModel {

    /**
     * @param {Tandem} tandem
     * @param {Object} [options]
     */
    constructor( tandem, options ) {
      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      options = _.extend( {
        holdConstant: HoldConstantEnum.NOTHING,
        hasCollisionCounter: true,
        leftWallDoesWork: false
      }, options );

      super( tandem );

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

      // @public total number of particles in the container
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

      //TODO better names for these Emitters
      // @public (read-only) Emitters related to OopsDialogs
      this.oops1Emitter = new Emitter(); // Oops! Temperature cannot be held constant when the container is empty.
      this.oops2Emitter = new Emitter(); // Oops! Pressure cannot be held constant when the container is empty.
      this.oops3Emitter = new Emitter(); // Oops! Pressure cannot be held constant. Volume would be too large.
      this.oops4Emitter = new Emitter(); // Oops! Pressure cannot be held constant. Volume would be too small.

      this.totalNumberOfParticlesProperty.link( totalNumberOfParticles => {
        if ( totalNumberOfParticles === 0 && this.holdConstantProperty.value === HoldConstantEnum.TEMPERATURE ) {

          // Temperature can't be held constant when the container is empty.
          phet.log && phet.log( 'Oops! T cannot be held constant when N=0' );
          this.oops1Emitter.emit();
          this.holdConstantProperty.value = HoldConstantEnum.NOTHING;
        }
        else if ( totalNumberOfParticles === 0 &&
                  ( this.holdConstantProperty.value === HoldConstantEnum.PRESSURE_T ||
                    this.holdConstantProperty.value === HoldConstantEnum.PRESSURE_V ) ) {

          // Pressure can't be held constant when the container is empty.
          phet.log && phet.log( 'Oops! P cannot be held constant when N=0' );
          this.oops2Emitter.emit();
          this.holdConstantProperty.value = HoldConstantEnum.NOTHING;
        }
      } );

      // Verify that we're not in a bad state.
      this.holdConstantProperty.link( holdConstant => {

        // values that are incompatible with an empty container
        assert && assert( !( this.totalNumberOfParticlesProperty.value === 0 &&
        ( holdConstant === HoldConstantEnum.TEMPERATURE ||
          holdConstant === HoldConstantEnum.PRESSURE_T ||
          holdConstant === HoldConstantEnum.PRESSURE_V ) ),
          `bad state: holdConstant=${holdConstant} with empty container` );

        // values that are incompatible with zero pressure
        assert && assert( !( this.pressureProperty.value === 0 &&
        ( holdConstant === HoldConstantEnum.PRESSURE_V ||
          holdConstant === HoldConstantEnum.PRESSURE_T ) ),
          `bad state: holdConstant=${holdConstant} with zero pressure` );
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
     * Removes all particles from the container.
     * @public
     */
    removeAllParticles() {
      this.numberOfHeavyParticlesProperty.value = 0;
      this.numberOfLightParticlesProperty.value = 0;
    }

    /**
     * Steps the model using model time units.
     * @param {number} dt - time delta, in ps
     * @protected
     * @override
     */
    stepModelTime( dt ) {
      assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );

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

      // Adjust quantities to compensate for holdConstant mode. Do this before computing temperature or pressure.
      this.compensateForHoldConstant();

      // Compute temperature. Do this before pressure, because pressure depends on temperature.
      this.temperatureProperty.value = this.computeActualTemperature();

      // When adding particles to an empty container, don't compute pressure until 1 particle has collided with the container.
      if ( !this.stepPressureEnabled && this.collisionDetector.numberOfParticleContainerCollisions > 0 ) {
        this.stepPressureEnabled = true;
      }

      // Compute pressure
      if ( this.stepPressureEnabled ) {
        this.pressureProperty.value = this.computePressure();

        // Disable jitter when we're holding pressure constant.
        const jitterEnabled = !( this.holdConstantProperty.value === HoldConstantEnum.PRESSURE_T ||
                                 this.holdConstantProperty.value === HoldConstantEnum.PRESSURE_V );

        // Step the gauge regardless of whether we've changed pressure, since the gauge updates on a sample period.
        this.pressureGauge.step( dt, jitterEnabled );

        // If pressure exceeds the maximum, blow the lid off of the container.
        if ( this.pressureProperty.value > GasPropertiesQueryParameters.maxPressure ) {
          this.container.lidIsOnProperty.value = false;
        }
      }
    }

    /**
     * Adjusts an array of particles to have the desired number of elements.
     * @param {number} newValue - new number of particles
     * @param {number} oldValue - old number of particles
     * @param {Particle[]} particles - array of particles that corresponds to newValue and oldValue
     * @param Constructor - constructor for elements in particles array
     * @private
     */
    updateNumberOfParticles( newValue, oldValue, particles, Constructor ) {
      assert && assert( typeof newValue === 'number', `invalid newValue: ${newValue}` );
      assert && assert( oldValue === null || typeof oldValue === 'number', `invalid oldValue: ${oldValue}` );
      assert && assert( Array.isArray( particles ), `invalid particles: ${particles}` );
      //TODO validate Constructor

      if ( particles.length !== newValue ) {
        const delta = newValue - oldValue;
        if ( delta > 0 ) {
          this.addParticles( delta, particles, Constructor );
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
      assert && assert( typeof n === 'number' && n > 0, `invalid n: ${n}` );
      assert && assert( Array.isArray( particles ), `invalid particles: ${particles}` );
      //TODO validate Constructor

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
     * Adjust quantities to compensate for what is being held constant.
     * @private
     */
    compensateForHoldConstant() {

      if ( this.holdConstantProperty.value === HoldConstantEnum.PRESSURE_V ) {

        // hold pressure constant by changing volume
        let containerWidth = this.computeVolume() / ( this.container.height * this.container.depth );

        // Address floating-point error, see https://github.com/phetsims/gas-properties/issues/89
        containerWidth = Util.toFixedNumber( containerWidth, 5 );

        if ( !this.container.widthRange.contains( containerWidth ) ) {

          // This results in an OopsDialog being displayed
          phet.log && phet.log( 'Oops! P cannot be held constant when V exceeds range, ' +
                                `containerWidth=${containerWidth} widthRange=${this.container.widthRange}` );
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
      else if ( this.holdConstantProperty.value === HoldConstantEnum.PRESSURE_T ) {

        // hold pressure constant by changing temperature
        // adjust particle velocities
        const desiredTemperature = this.computeDesiredTemperature();
        this.adjustParticleVelocitiesForTemperature( desiredTemperature );
        this.temperatureProperty.value = desiredTemperature;

        //TODO #88 animate heat/cool
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
     */
    getAverageKineticEnergy() {
      return this.getTotalKineticEnergy() / this.totalNumberOfParticlesProperty.value;
    }

    /**
     * Gets the total kinetic energy of the particles in the container.
     * @returns {number} in AMU * pm^2 / ps^2
     */
    getTotalKineticEnergy() {
      return ParticleUtils.getTotalKineticEnergy( this.heavyParticles ) +
             ParticleUtils.getTotalKineticEnergy( this.lightParticles );
    }

    /**
     * Adjusts velocities of particle in the container so that the resulting temperature matches a specified temperature.
     * @param {number} temperature
     */
    adjustParticleVelocitiesForTemperature( temperature ) {
      assert && assert( typeof temperature === 'number', `invalid temperature: ${temperature}` );

      const desiredAverageKE = ( 3 / 2 ) * temperature * GasPropertiesConstants.BOLTZMANN; // KE = (3/2)Tk
      const actualAverageKE = this.getAverageKineticEnergy();
      const ratio = desiredAverageKE / actualAverageKE;

      //TODO is this iterator OK? or should model have {Particle[][]} particleArrays?
      [ this.heavyParticles, this.lightParticles ].forEach( particles => {
        for ( let i = 0; i < particles.length; i++ ) {
          const particle = particles[ i ];
          const actualParticleKE = particle.getKineticEnergy();
          const desiredParticleKE = ratio * actualParticleKE;
          const desiredSpeed = Math.sqrt( 2 * desiredParticleKE / particle.mass ); // |v| = Math.sqrt( 2 * KE / m )
          particle.setVelocityMagnitude( desiredSpeed );
        }
      } );

      assert && assert( Math.abs( temperature - this.computeActualTemperature() < 1E-3 ),
        'actual temperature does not match desired temperature' );
    }
  }

  return gasProperties.register( 'GasPropertiesModel', GasPropertiesModel );
} );