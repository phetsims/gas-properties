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

  // strings
  var gasPropertiesTitleString = require( 'string!GAS_PROPERTIES/gas-properties.title' );

  var simOptions = {
    credits: {
      //TODO fill in proper credits, all of these fields are optional, see joist.AboutDialog
      leadDesign: '',
      softwareDevelopment: '',
      team: '',
      qualityAssurance: '',
      graphicArts: '',
      thanks: ''
    }
  };

  SimLauncher.launch( function() {
    var sim = new Sim( gasPropertiesTitleString, [ new IntroScreen() ], simOptions );
    sim.start();
  } );
} );