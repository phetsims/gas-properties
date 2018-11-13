// Copyright 2018, University of Colorado Boulder

/**
 * Model for the 'Ideal' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Container = require( 'GAS_PROPERTIES/common/model/Container' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const LinearFunction = require( 'DOT/LinearFunction' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Range = require( 'DOT/Range' );
  const StringProperty = require( 'AXON/StringProperty' );

  // constants
  //TODO use Enumeration when https://github.com/phetsims/phet-core/issues/42 is resolved
  const HOLD_CONSTANT_VALUES = [
    'nothing',
    'volume',
    'temperature',
    'pressureT', // change temperature (T) to maintain constant pressure
    'pressureV' // change volume (V) to maintain constant pressure
  ];

  class IdealModel {

    constructor() {

      // @public transform between real time and sim time.
      // 1 second of real time is 2.5 picoseconds of sim time.
      this.timeTransform = new LinearFunction( 0, 1, 0, 2.5 );

      // @public width of the container, in nm
      this.container = new Container();

      // @public is the sim playing?
      this.isPlayingProperty = new BooleanProperty( true );

      // @public the quantity to hold constant
      this.holdConstantProperty = new StringProperty( 'nothing', {
        validValues: HOLD_CONSTANT_VALUES
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

      // @public whether the stopwatch is running
      this.stopwatchIsRunningProperty = new BooleanProperty( false );

      // @public time displayed on the stopwatch, in ps
      this.stopwatchTimeProperty = new NumberProperty( 0, {
        isValidValue: value => ( value >= 0 )
      } );

      // @public whether the collision counter is running
      this.collisionCounterIsRunningProperty = new BooleanProperty( false );

      // @public the number of collisions between the particles and the container walls
      this.numberOfCollisionsProperty = new NumberProperty( 0, {
        isValidValue: value => ( value >= 0 )
      } );

      // @public the temperature in the container, in K
      this.temperatureProperty = new NumberProperty( 0, {
        isValidValue: value => ( value >= 0 )
      } );

      // @public range of thermometer, in K. temperatureProperty is expected to exceed this.
      this.thermometerRange = new Range( 0, 1000 );
    }

    // @public resets the model
    reset() {
      this.container.reset();
      this.isPlayingProperty.reset();
      this.holdConstantProperty.reset();
      this.numberOfHeavyParticlesProperty.reset();
      this.numberOfLightParticlesProperty.reset();
      this.heatCoolAmountProperty.reset();
      this.stopwatchIsRunningProperty.reset();
      this.stopwatchTimeProperty.reset();
      this.collisionCounterIsRunningProperty.reset();
      this.numberOfCollisionsProperty.reset();
      this.temperatureProperty.reset();
    }

    // @public
    step( dt ) {
      if ( this.isPlayingProperty.value ) {

        // Update the stopwatch. 1 second of real time is displayed as 2.5 picoseconds
        if ( this.stopwatchIsRunningProperty.value ) {
          this.stopwatchTimeProperty.value += this.timeTransform( dt );
        }
      }
    }
  }

  return gasProperties.register( 'IdealModel', IdealModel );
} );