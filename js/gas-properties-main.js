// Copyright 2018, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const DiffusionScreen = require( 'GAS_PROPERTIES/diffusion/DiffusionScreen' );
  const ExploreScreen = require( 'GAS_PROPERTIES/explore/ExploreScreen' );
  const IdealScreen = require( 'GAS_PROPERTIES/ideal/IdealScreen' );
  const EnergyScreen = require( 'GAS_PROPERTIES/energy/EnergyScreen' );
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  const gasPropertiesTitleString = require( 'string!GAS_PROPERTIES/gas-properties.title' );

  const simOptions = {
    credits: {
      //TODO #28 complete the credits
      leadDesign: 'Amy Rouinfar',
      softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
      team: 'Jack Barbera, John Blanco, Michael Dubson, Amy Hanson, Linda Koch, Ron LeMaster, Trish Loeblein, ' +
            'Emily Moore, Ariel Paul, Kathy Perkins, Carl Wieman',
      qualityAssurance: '',
      graphicArts: '',
      thanks: ''
    }
  };

  SimLauncher.launch( function() {
    const screens = [ new IdealScreen(), new ExploreScreen(), new EnergyScreen(), new DiffusionScreen() ];
    const sim = new Sim( gasPropertiesTitleString, screens, simOptions );
    sim.start();
  } );
} );