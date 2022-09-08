// Copyright 2018-2022, University of Colorado Boulder

/**
 * EnergyScreen is the 'Energy' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../tandem/js/Tandem.js';
import GasPropertiesScreen from '../common/GasPropertiesScreen.js';
import GasPropertiesIconFactory from '../common/view/GasPropertiesIconFactory.js';
import gasProperties from '../gasProperties.js';
import GasPropertiesStrings from '../GasPropertiesStrings.js';
import EnergyModel from './model/EnergyModel.js';
import EnergyScreenView from './view/EnergyScreenView.js';

class EnergyScreen extends GasPropertiesScreen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

    const createModel = () => new EnergyModel( tandem.createTandem( 'model' ) );
    const createView = model => new EnergyScreenView( model, tandem.createTandem( 'view' ) );

    super( createModel, createView, tandem, {
      name: GasPropertiesStrings.screen.energy,
      homeScreenIcon: GasPropertiesIconFactory.createEnergyScreenIcon()
    } );
  }
}

gasProperties.register( 'EnergyScreen', EnergyScreen );
export default EnergyScreen;