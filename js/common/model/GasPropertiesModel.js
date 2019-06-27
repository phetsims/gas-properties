// Copyright 2019, University of Colorado Boulder

/**
 * Base class for models in the Intro, Explore, and Energy screens.  It adds functionality related to the
 * Ideal Gas Law.
 *
 * This model has subcomponents that handle the quantities involved in the Ideal Gas Law, PV = NkT.  They are:
 *
 * P (pressure) - see PressureModel pressureProperty
 * V (volume) - see BaseContainer volumeProperty
 * N (number of particles) - see ParticleSystem numberOfParticlesProperty
 * T (temperature) - see TemperatureModel temperatureProperty
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
  const Emitter = require( 'AXON/Emitter' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesContainer = require( 'GAS_PROPERTIES/common/model/GasPropertiesContainer' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const HoldConstant = require( 'GAS_PROPERTIES/common/model/HoldConstant' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const ParticleSystem = require( 'GAS_PROPERTIES/common/model/ParticleSystem' );
  const PressureGauge = require( 'GAS_PROPERTIES/common/model/PressureGauge' );
  const PressureModel = require( 'GAS_PROPERTIES/common/model/PressureModel' );
  const Range = require( 'DOT/Range' );
  const Tandem = require( 'TANDEM/Tandem' );
  const TemperatureModel = require( 'GAS_PROPERTIES/common/model/TemperatureModel' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );

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

      // @public the quantity to hold constant
      this.holdConstantProperty = new EnumerationProperty( HoldConstant, options.holdConstant );

      // @public the factor to heat or cool the contents of the container.
      // See HeaterCoolerNode: 1 is max heat, -1 is max cool, 0 is no change.
      this.heatCoolFactorProperty = new NumberProperty( 0, {
        range: new Range( -1, 1 )
      } );

      // @public whether particle-particle collisions are enabled
      this.particleParticleCollisionsEnabledProperty = new BooleanProperty( true );

      // @public (read-only)
      this.container = new GasPropertiesContainer( {
        leftWallDoesWork: options.leftWallDoesWork
      } );

      // @public (read-only)
      this.particleSystem = new ParticleSystem(
        () => this.temperatureModel.getInitialTemperature(),
        this.particleParticleCollisionsEnabledProperty,
        this.container.particleEntryLocation
      );

      // @public (read-only)
      this.collisionDetector = new CollisionDetector(
        this.container,
        this.particleSystem.insideParticleArrays,
        this.particleParticleCollisionsEnabledProperty
      );

      // @public (read-only) sub-model responsible for temperature T
      this.temperatureModel = new TemperatureModel(
        this.particleSystem.numberOfParticlesProperty, // N
        () => this.particleSystem.getAverageKineticEnergy() // KE
      );

      // @public (read-only) sub-model responsible for pressure P
      this.pressureModel = new PressureModel(
        this.holdConstantProperty,
        this.particleSystem.numberOfParticlesProperty, // N
        this.container.volumeProperty, // V
        this.temperatureModel.temperatureProperty, // T
        () => { this.container.blowLidOff(); }
      );

      // @public (read-only)
      this.collisionCounter = null;
      if ( options.hasCollisionCounter ) {
        this.collisionCounter = new CollisionCounter( this.collisionDetector, {
          location: new Vector2( 40, 15 ) // view coordinates! determined empirically
        } );
      }

      // If the container's width changes while the sim is paused, update immediately.
      this.container.widthProperty.lazyLink( width => {
        if ( !this.isPlayingProperty.value ) {
          this.updateWhenPaused();
        }
      } );

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
        pressureSmallEmitter: new Emitter(),

        // Oops! Maximum temperature reached
        maximumTemperatureEmitter: new Emitter()
      };

      // When the number of particles in the container changes ...
      this.particleSystem.numberOfParticlesProperty.link( numberOfParticles => {

        // If the container is empty, check for 'Hold Constant' conditions that can't be satisfied.
        if ( numberOfParticles === 0 ) {
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

        // If the number of particles changes while the sim is paused, update immediately.
        // Do this after checking holdConstantProperty, in case it gets switched to HoldConstant.NOTHING.
        if ( !this.isPlayingProperty.value ) {
          this.updateWhenPaused();
        }
      } );

      // Verify that we're not in a bad 'Hold Constant' state.
      assert && this.holdConstantProperty.link( holdConstant => {

        // values that are incompatible with an empty container
        assert && assert( !( this.particleSystem.numberOfParticlesProperty.value === 0 &&
        ( holdConstant === HoldConstant.TEMPERATURE ||
          holdConstant === HoldConstant.PRESSURE_T ||
          holdConstant === HoldConstant.PRESSURE_V ) ),
          `bad holdConstant state: ${holdConstant} with numberOfParticles=${this.particleSystem.numberOfParticlesProperty.value}` );

        // values that are incompatible with zero pressure
        assert && assert( !( this.pressureModel.pressureProperty.value === 0 &&
        ( holdConstant === HoldConstant.PRESSURE_V ||
          holdConstant === HoldConstant.PRESSURE_T ) ),
          `bad holdConstant state: ${holdConstant} with pressure=${this.pressureModel.pressureProperty.value}` );
      } );
    }

    /**
     * Resets the model.
     * @public
     * @override
     */
    reset() {
      super.reset();

      // Properties
      this.holdConstantProperty.reset();
      this.heatCoolFactorProperty.reset();
      this.particleParticleCollisionsEnabledProperty.reset();

      // model elements
      this.container.reset();
      this.particleSystem.reset();
      this.temperatureModel.reset();
      this.pressureModel.reset();
      this.collisionCounter && this.collisionCounter.reset();
    }

    /**
     * Steps the model using model time units. Order is very important here!
     * @param {number} dt - time delta, in ps
     * @protected
     * @override
     */
    stepModelTime( dt ) {
      assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );

      super.stepModelTime( dt );

      // step the system
      this.stepSystem( dt );

      // update things that are dependent on the state of the system
      this.updateModel( dt, this.collisionDetector.numberOfParticleContainerCollisions );
    }

    /**
     * Steps the things that affect the container and particle system, including heating/cooling
     * and collision detection/response. Order is very important here!
     * @param {number} dt - time delta, in ps
     * @private
     */
    stepSystem( dt ) {
      assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );

      // Apply heat/cool
      this.particleSystem.heatCool( this.heatCoolFactorProperty.value );

      // Step particles
      this.particleSystem.step( dt );

      // Allow particles to escape from the opening in the top of the container
      this.particleSystem.escapeParticles( this.container );

      // Step container, to animate resizing of left wall and compute velocity of left wall.
      this.container.step( dt );

      // Collision detection and response
      this.collisionDetector.update();

      // Remove particles that have left the model bounds
      this.particleSystem.removeParticlesOutOfBounds( this.modelBoundsProperty.value );

      // Do this after collision detection, so that the number of collisions detected has been recorded.
      this.collisionCounter && this.collisionCounter.step( dt );
    }

    /**
     * Updates parts of the model that are dependent on the state of the particle system.  This is separated from
     * stepSystem so that we can update if the number of particles changes while the simulation is paused.
     * Order is very important here!
     * @param {number} dtPressureGauge - time delta used to step the pressure gauge, in ps
     * @param {number} numberOfCollisions - number of collisions on the most recent time step
     * @private
     */
    updateModel( dtPressureGauge, numberOfCollisions ) {
      assert && assert( typeof dtPressureGauge === 'number' && dtPressureGauge > 0,
        `invalid dtPressureGauge: ${dtPressureGauge}` );
      assert && assert( typeof numberOfCollisions === 'number' && numberOfCollisions >= 0,
        `invalid numberOfCollisions: ${numberOfCollisions}` );

      // Adjust quantities to compensate for 'Hold Constant' mode. Do this before computing temperature or pressure.
      this.compensateForHoldConstant();

      // Update temperature. Do this before pressure, because pressure depends on temperature.
      this.temperatureModel.update();

      // Update pressure.
      this.pressureModel.update( dtPressureGauge, numberOfCollisions );

      // Do this last.
      this.verifyState();
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
     * Adjusts quantities to compensate for the quantity that is being held constant.
     * @private
     */
    compensateForHoldConstant() {

      if ( this.holdConstantProperty.value === HoldConstant.PRESSURE_V ) {

        // hold pressure constant by changing volume
        const previousContainerWidth = this.container.widthProperty.value;

        let containerWidth = this.computeIdealVolume() / ( this.container.height * this.container.depth );

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

        // Redistribute particles in the new width
        this.particleSystem.redistributeParticles( containerWidth / previousContainerWidth );
      }
      else if ( this.holdConstantProperty.value === HoldConstant.PRESSURE_T ) {

        // Hold pressure constant by adjusting particle velocities to result in a desired temperature.
        const desiredTemperature = this.computeIdealTemperature();

        this.particleSystem.setTemperature( desiredTemperature );
        assert && assert( Math.abs( desiredTemperature - this.computeIdealTemperature() < 1E-3 ),
          'actual temperature does not match desired temperature' );

        this.temperatureModel.temperatureProperty.value = desiredTemperature;
      }
    }

    /**
     * Verify that the model is in a good state after having been updated. If it's not, adjust accordingly.
     * @private
     */
    verifyState() {

      // If we exceed the maximum temperature, reset the state of the container.
      // See https://github.com/phetsims/gas-properties/issues/128
      if ( this.temperatureModel.temperatureProperty.value >= GasPropertiesQueryParameters.maxTemperature ) {

        // Remove all particles
        this.particleSystem.removeAllParticles();

        // Switch to a 'Hold Constant' setting that supports an empty container
        if ( this.holdConstantProperty.value !== HoldConstant.NOTHING &&
             this.holdConstantProperty.value !== HoldConstant.VOLUME ) {
          this.holdConstantProperty.value = HoldConstant.NOTHING;
        }

        // Put the lid on the container
        this.container.lidIsOnProperty.value = true;

        phet.log && phet.log( `Oops! Maximum temperature reached: ${this.temperatureModel.temperatureProperty.value}` );
        this.oopsEmitters.maximumTemperatureEmitter.emit();
      }
    }

    /**
     * Computes volume using the Ideal Gas Law, V = NkT/P
     * This is used to compute the volume needed to hold pressure constant in HoldConstant.PRESSURE_V mode.
     * @returns {number} in pm^3
     * @private
     */
    computeIdealVolume() {

      const N = this.particleSystem.numberOfParticlesProperty.value;
      const k = GasPropertiesConstants.BOLTZMANN; // (pm^2 * AMU)/(ps^2 * K)
      const T = this.temperatureModel.computeTemperature(); // temperature has not been updated, so compute it
      const P = this.pressureModel.pressureProperty.value / GasPropertiesConstants.PRESSURE_CONVERSION_SCALE;
      assert && assert( P !== 0, 'zero pressure not supported' );

      return ( N * k * T ) / P;
    }

    /**
     * Computes the temperature using the Ideal Gas Law, T = (PV)/(Nk)
     * This is used to compute the temperature needed to hold pressure constant in HoldConstant.PRESSURE_T mode.
     * @returns {number} in K
     * @public
     */
    computeIdealTemperature() {

      const P = this.pressureModel.pressureProperty.value / GasPropertiesConstants.PRESSURE_CONVERSION_SCALE;
      assert && assert( P !== 0, 'zero pressure not supported' );

      const N = this.particleSystem.numberOfParticlesProperty.value;
      assert && assert( N !== 0, 'empty container not supported' );

      const V = this.container.volumeProperty.value; // pm^3
      const k = GasPropertiesConstants.BOLTZMANN; // (pm^2 * AMU)/(ps^2 * K)

      return ( P * V ) / ( N * k );
    }
  }

  return gasProperties.register( 'GasPropertiesModel', GasPropertiesModel );
} );