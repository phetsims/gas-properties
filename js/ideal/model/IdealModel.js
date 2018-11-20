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
  const CollisionCounter = require( 'GAS_PROPERTIES/common/model/CollisionCounter' );
  const Container = require( 'GAS_PROPERTIES/common/model/Container' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const HoldConstantEnum = require( 'GAS_PROPERTIES/common/model/HoldConstantEnum' );
  const LinearFunction = require( 'DOT/LinearFunction' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Stopwatch = require( 'GAS_PROPERTIES/common/model/Stopwatch' );
  const Thermometer = require( 'GAS_PROPERTIES/common/model/Thermometer' );
  const Vector2 = require( 'DOT/Vector2' );

  class IdealModel {

    constructor() {

      // @public transform between real time and sim time.
      // 1 second of real time is 2.5 picoseconds of sim time.
      this.timeTransform = new LinearFunction( 0, 1, 0, 2.5 );

      // @public width of the container, in nm
      this.container = new Container();

      // @public collision counter
      this.collisionCounter = new CollisionCounter( {
        //TODO use model coordinates
        location: new Vector2( 20, 20 ) // determined empirically
      } );

      // @public stopwatch
      this.stopwatch = new Stopwatch( this.timeTransform, {
        //TODO use model coordinates
        location: new Vector2( 200, 20 ) // determined empirically
      } );

      // @public thermometer
      this.thermometer = new Thermometer();

      // @public is the sim playing?
      this.isPlayingProperty = new BooleanProperty( true );

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
    }

    // @public resets the model
    reset() {

      // model elements
      this.container.reset();
      this.collisionCounter.reset();
      this.stopwatch.reset();
      this.thermometer.reset();

      // Properties
      this.isPlayingProperty.reset();
      this.holdConstantProperty.reset();
      this.numberOfHeavyParticlesProperty.reset();
      this.numberOfLightParticlesProperty.reset();
      this.heatCoolAmountProperty.reset();
    }

    // @public
    step( dt ) {
      if ( this.isPlayingProperty.value ) {
        this.stopwatch.step( dt );
      }
    }
  }

  return gasProperties.register( 'IdealModel', IdealModel );
} );