// Copyright 2018, University of Colorado Boulder

/**
 * Model for the 'Intro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  var inherit = require( 'PHET_CORE/inherit' );
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

    // @public
    this.holdConstantProperty = new StringProperty( 'nothing', {
      validValues: HOLD_CONSTANT_VALUES
    } );
  }

  gasProperties.register( 'IntroModel', IntroModel );

  return inherit( Object, IntroModel, {

    // @public resets the model
    reset: function() {
      this.holdConstantProperty.reset();
    },

    // @public
    step: function( dt ) {
      //TODO Handle model animation here.
    }
  } );
} );