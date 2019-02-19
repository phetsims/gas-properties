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
  const CollisionCounter = require( 'GAS_PROPERTIES/common/model/CollisionCounter' );
  const Container = require( 'GAS_PROPERTIES/common/model/Container' );
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
  const PUMP_DISPERSION_ANGLE = Math.PI / 2;

  class IdealModel {

    constructor() {

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

      this.heavyParticles = []; // {HeavyParticle[]}
      this.lightParticles = []; // {LightParticle[]}

      this.numberOfHeavyParticlesProperty.link( ( newValue, oldValue ) => {
        const delta = newValue - oldValue;
        if ( delta > 0 ) {
          this.addParticles( delta, this.heavyParticles, HeavyParticle );
        }
        else if ( delta < 0 ) {
          this.removeParticles( -delta, this.heavyParticles );
        }
      } );

      //TODO duplication with numberOfHeavyParticlesProperty listener
      this.numberOfLightParticlesProperty.link( ( newValue, oldValue ) => {
        const delta = newValue - oldValue;
        if ( delta > 0 ) {
          this.addParticles( delta, this.lightParticles, LightParticle );
        }
        else if ( delta < 0 ) {
          this.removeParticles( -delta, this.lightParticles );
        }
      } );
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

        // from the place where the pump is connected to the container
        const location = this.container.location.plusXY( 0, this.container.height / 2 );

        // directed towards the right, into the container
        const angle = Math.PI - PUMP_DISPERSION_ANGLE / 2 + phet.joist.random.nextDouble() * PUMP_DISPERSION_ANGLE;

        particles.push( new Constructor( location, angle ) );
      }
    }

    /**
     * Removes and disposes the last n particles from the specified array.
     * @param {number} n
     * @param {Particle[]} particles
     * @private
     */
    removeParticles( n, particles ) {
      assert && assert( n <= particles.length, 'not enough particles in the array' );
      const removedParticles = particles.splice( particles.length - n, n );
      removedParticles.forEach( particle => particle.dispose() );
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
      }
    }
  }

  return gasProperties.register( 'IdealModel', IdealModel );
} );