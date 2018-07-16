// Copyright 2018, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var IntroScreen = require( 'GAS_PROPERTIES/intro/IntroScreen' );
  var KMTScreen = require( 'GAS_PROPERTIES/kmt/KMTScreen' );
  var WorkScreen = require( 'GAS_PROPERTIES/work/WorkScreen' );

  // strings
  var gasPropertiesTitleString = require( 'string!GAS_PROPERTIES/gas-properties.title' );

  var simOptions = {
    credits: {
      //TODO #28 complete the credits
      leadDesign: '',
      softwareDevelopment: '',
      team: '',
      qualityAssurance: '',
      graphicArts: '',
      thanks: ''
    }
  };

  SimLauncher.launch( function() {
    var screens = [ new IntroScreen(), new WorkScreen(), new KMTScreen() ];
    var sim = new Sim( gasPropertiesTitleString, screens, simOptions );
    sim.start();
  } );
} );