// Copyright 2018-2019, University of Colorado Boulder

/**
 * EnergyScreen is the 'Energy' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../tandem/js/Tandem.js';
import GasPropertiesScreen from '../common/GasPropertiesScreen.js';
import GasPropertiesIconFactory from '../common/view/GasPropertiesIconFactory.js';
import gasPropertiesStrings from '../gas-properties-strings.js';
import gasProperties from '../gasProperties.js';
import EnergyModel from './model/EnergyModel.js';
import EnergyScreenView from './view/EnergyScreenView.js';

const screenEnergyString = gasPropertiesStrings.screen.energy;

class EnergyScreen extends GasPropertiesScreen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

    const createModel = () => new EnergyModel( tandem.createTandem( 'model' ) );
    const createView = model => new EnergyScreenView( model, tandem.createTandem( 'view' ) );

    super( createModel, createView, tandem, {
      name: screenEnergyString,
      homeScreenIcon: GasPropertiesIconFactory.createEnergyScreenIcon()
    } );
  }
}

gasProperties.register( 'EnergyScreen', EnergyScreen );
export default EnergyScreen;