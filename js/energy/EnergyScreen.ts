// Copyright 2018-2024, University of Colorado Boulder

/**
 * EnergyScreen is the 'Energy' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import { combineOptions } from '../../../phet-core/js/optionize.js';
import Tandem from '../../../tandem/js/Tandem.js';
import GasPropertiesConstants from '../common/GasPropertiesConstants.js';
import GasPropertiesIconFactory from '../common/view/GasPropertiesIconFactory.js';
import IdealKeyboardHelpContent from '../common/view/IdealKeyboardHelpContent.js';
import gasProperties from '../gasProperties.js';
import GasPropertiesStrings from '../GasPropertiesStrings.js';
import EnergyModel from './model/EnergyModel.js';
import EnergyScreenView from './view/EnergyScreenView.js';

export default class EnergyScreen extends Screen<EnergyModel, EnergyScreenView> {

  public constructor( tandem: Tandem ) {

    const createModel = () => new EnergyModel( tandem.createTandem( 'model' ) );

    const createView = ( model: EnergyModel ) => new EnergyScreenView( model, tandem.createTandem( 'view' ) );

    const options = combineOptions<ScreenOptions>( {}, GasPropertiesConstants.SCREEN_OPTIONS, {
      name: GasPropertiesStrings.screen.energyStringProperty,
      homeScreenIcon: GasPropertiesIconFactory.createEnergyScreenIcon(),
      createKeyboardHelpNode: () => new IdealKeyboardHelpContent(),
      tandem: tandem
    } );

    super( createModel, createView, options );
  }
}

gasProperties.register( 'EnergyScreen', EnergyScreen );