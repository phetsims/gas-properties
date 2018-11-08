// Copyright 2018, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var IdealScreen = require( 'GAS_PROPERTIES/ideal/IdealScreen' );
  var KMTScreen = require( 'GAS_PROPERTIES/kmt/KMTScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var WorkScreen = require( 'GAS_PROPERTIES/work/WorkScreen' );

  // strings
  var gasPropertiesTitleString = require( 'string!GAS_PROPERTIES/gas-properties.title' );

  var simOptions = {
    credits: {
      //TODO #28 complete the credits
      leadDesign: 'Amy Rouinfar',
      softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
      team: 'Jack Barbera, John Blanco, Michael Dubson, Amy Hanson, Linda Koch, Ron LeMaster, Trish Loeblein, Emily Moore, Ariel Paul, Kathy Perkins, Carl Wieman',
      qualityAssurance: '',
      graphicArts: '',
      thanks: ''
    }
  };

  SimLauncher.launch( function() {
    var screens = [ new IdealScreen(), new WorkScreen(), new KMTScreen() ];
    var sim = new Sim( gasPropertiesTitleString, screens, simOptions );
    sim.start();
  } );
} );