// Copyright 2018, University of Colorado Boulder

/**
 * Model for the 'Intro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Container = require( 'GAS_PROPERTIES/common/model/Container' );
  var gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  var GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var StringProperty = require( 'AXON/StringProperty' );

  // constants
  var HOLD_CONSTANT_VALUES = [
    'nothing',
    'volume',
    'temperature',
    'pressureT', // change temperature (T) to maintain constant pressure
    'pressureV' // change volume (V) to maintain constant pressure
  ];

  /**
   * @constructor
   */
  function IntroModel() {

    // @public is the model running?
    this.runningProperty = new BooleanProperty( true );

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

    // @public width of the container, in nm
    this.container = new Container();
  }

  gasProperties.register( 'IntroModel', IntroModel );

  return inherit( Object, IntroModel, {

    // @public resets the model
    reset: function() {
      this.holdConstantProperty.reset();
      this.numberOfHeavyParticlesProperty.reset();
      this.numberOfLightParticlesProperty.reset();
    },

    // @public
    step: function( dt ) {
      if ( this.runningProperty.value ) {
        //TODO
      }
    }
  } );
} );