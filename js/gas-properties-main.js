// Copyright 2018, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var DiffusionScreen = require( 'GAS_PROPERTIES/diffusion/DiffusionScreen' );
  var ExploreScreen = require( 'GAS_PROPERTIES/explore/ExploreScreen' );
  var IdealScreen = require( 'GAS_PROPERTIES/ideal/IdealScreen' );
  var EnergyScreen = require( 'GAS_PROPERTIES/energy/EnergyScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

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
    var screens = [ new IdealScreen(), new ExploreScreen(), new EnergyScreen(), new DiffusionScreen() ];
    var sim = new Sim( gasPropertiesTitleString, screens, simOptions );
    sim.start();
  } );
} );