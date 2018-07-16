// Copyright 2018, University of Colorado Boulder

/**
 * The 'Intro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );
  var gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  var IntroModel = require( 'GAS_PROPERTIES/intro/model/IntroModel' );
  var IntroScreenView = require( 'GAS_PROPERTIES/intro/view/IntroScreenView' );

  /**
   * @constructor
   */
  function IntroScreen() {

    var options = {
      backgroundColorProperty: new Property( 'white' )
    };

    Screen.call( this,
      function() { return new IntroModel(); },
      function( model ) { return new IntroScreenView( model ); },
      options
    );
  }

  gasProperties.register( 'IntroScreen', IntroScreen );

  return inherit( Screen, IntroScreen );
} );