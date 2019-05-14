// Copyright 2018-2019, University of Colorado Boulder

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
  const GasPropertiesGlobalOptions = require( 'GAS_PROPERTIES/common/GasPropertiesGlobalOptions' );
  const GasPropertiesGlobalOptionsNode = require( 'GAS_PROPERTIES/common/view/GasPropertiesGlobalOptionsNode' );
  const IdealScreen = require( 'GAS_PROPERTIES/ideal/IdealScreen' );
  const EnergyScreen = require( 'GAS_PROPERTIES/energy/EnergyScreen' );
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );
  const Tandem = require( 'TANDEM/Tandem' );

  // strings
  const gasPropertiesTitleString = require( 'string!GAS_PROPERTIES/gas-properties.title' );

  // constants
  const GLOBAL_OPTIONS = new GasPropertiesGlobalOptions();

  const simOptions = {
    optionsNode: new GasPropertiesGlobalOptionsNode( GLOBAL_OPTIONS ),
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

  SimLauncher.launch( () => {
    const screens = [
      new IdealScreen( Tandem.rootTandem.createTandem( 'idealScreen' ) ),
      new ExploreScreen( Tandem.rootTandem.createTandem( 'exploreScreen' ) ),
      new EnergyScreen( Tandem.rootTandem.createTandem( 'energyScreen' ) ),
      new DiffusionScreen( Tandem.rootTandem.createTandem( 'diffusionScreen' ) )
    ];
    const sim = new Sim( gasPropertiesTitleString, screens, simOptions );
    sim.start();
  } );
} );