// Copyright 2018-2020, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Sim from '../../joist/js/Sim.js';
import SimLauncher from '../../joist/js/SimLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import GasPropertiesConstants from './common/GasPropertiesConstants.js';
import GasPropertiesGlobalOptionsNode from './common/view/GasPropertiesGlobalOptionsNode.js';
import DiffusionScreen from './diffusion/DiffusionScreen.js';
import EnergyScreen from './energy/EnergyScreen.js';
import ExploreScreen from './explore/ExploreScreen.js';
import gasPropertiesStrings from './gasPropertiesStrings.js';
import IdealScreen from './ideal/IdealScreen.js';

const gasPropertiesTitleString = gasPropertiesStrings[ 'gas-properties' ].title;

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