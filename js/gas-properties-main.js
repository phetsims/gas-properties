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
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesGlobalOptionsNode = require( 'GAS_PROPERTIES/common/view/GasPropertiesGlobalOptionsNode' );
  const IdealScreen = require( 'GAS_PROPERTIES/ideal/IdealScreen' );
  const EnergyScreen = require( 'GAS_PROPERTIES/energy/EnergyScreen' );
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );
  const Tandem = require( 'TANDEM/Tandem' );

  // strings
  const gasPropertiesTitleString = require( 'string!GAS_PROPERTIES/gas-properties.title' );

  const simOptions = {

    // Creates content for the Options dialog, accessible via the PhET menu
    createOptionsDialogContent: tandem => new GasPropertiesGlobalOptionsNode( {
      tandem: tandem
    } ),

    // Credits appear in the About dialog, accessible via the PhET menu
    credits: GasPropertiesConstants.CREDITS
  };

  SimLauncher.launch( () => {
    const screens = [
      new IdealScreen( Tandem.ROOT.createTandem( 'idealScreen' ) ),
      new ExploreScreen( Tandem.ROOT.createTandem( 'exploreScreen' ) ),
      new EnergyScreen( Tandem.ROOT.createTandem( 'energyScreen' ) ),
      new DiffusionScreen( Tandem.ROOT.createTandem( 'diffusionScreen' ) )
    ];
    const sim = new Sim( gasPropertiesTitleString, screens, simOptions );
    sim.start();
  } );
} );