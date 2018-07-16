// Copyright 2018, University of Colorado Boulder

/**
 * The 'Intro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IntroModel = require( 'GAS_PROPERTIES/intro/model/IntroModel' );
  var IntroScreenView = require( 'GAS_PROPERTIES/intro/view/IntroScreenView' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenIntroString = require( 'string!GAS_PROPERTIES/screen.intro' );

  /**
   * @constructor
   */
  function IntroScreen() {

    var options = {
      name: screenIntroString,
      backgroundColorProperty: new Property( 'black' )
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