// Copyright 2018-2022, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PreferencesModel from '../../joist/js/preferences/PreferencesModel.js';
import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import { Utils } from '../../scenery/js/imports.js';
import Tandem from '../../tandem/js/Tandem.js';
import GasPropertiesConstants from './common/GasPropertiesConstants.js';
import GasPropertiesPreferencesNode from './common/view/GasPropertiesPreferencesNode.js';
import DiffusionScreen from './diffusion/DiffusionScreen.js';
import EnergyScreen from './energy/EnergyScreen.js';
import ExploreScreen from './explore/ExploreScreen.js';
import GasPropertiesStrings from './GasPropertiesStrings.js';
import IdealScreen from './ideal/IdealScreen.js';

simLauncher.launch( () => {

  const screens = [
    new IdealScreen( Tandem.ROOT.createTandem( 'idealScreen' ) ),
    new ExploreScreen( Tandem.ROOT.createTandem( 'exploreScreen' ) ),
    new EnergyScreen( Tandem.ROOT.createTandem( 'energyScreen' ) ),
    new DiffusionScreen( Tandem.ROOT.createTandem( 'diffusionScreen' ) )
  ];

  const sim = new Sim( GasPropertiesStrings[ 'gas-properties' ].titleStringProperty, screens, {
    webgl: true, // Enabled for high-performance Sprites
    credits: GasPropertiesConstants.CREDITS,
    preferencesModel: new PreferencesModel( {
      visualOptions: {
        supportsProjectorMode: true
      },
      simulationOptions: {
        customPreferences: [ {
          createContent: tandem => new GasPropertiesPreferencesNode( {
            tandem: tandem.createTandem( 'simPreferences' )
          } )
        } ]
      }
    } )
  } );

  // Log whether we're using WebGL, which is the preferred rendering option for Sprites
  phet.log && phet.log( `using WebGL = ${phet.chipper.queryParameters.webgl && Utils.isWebGLSupported}` );

  sim.start();
} );