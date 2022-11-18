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

export default class EnergyScreen extends GasPropertiesScreen<EnergyModel, EnergyScreenView> {

  public constructor( tandem: Tandem ) {

    const createModel = () => new EnergyModel( tandem.createTandem( 'model' ) );
    const createView = ( model: EnergyModel ) => new EnergyScreenView( model, tandem.createTandem( 'view' ) );

    super( createModel, createView, {
      name: GasPropertiesStrings.screen.energyStringProperty,
      homeScreenIcon: GasPropertiesIconFactory.createEnergyScreenIcon(),
      tandem: tandem
    } );
  }
}

gasProperties.register( 'EnergyScreen', EnergyScreen );