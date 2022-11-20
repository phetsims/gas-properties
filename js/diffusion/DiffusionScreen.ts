// Copyright 2018-2022, University of Colorado Boulder

/**
 * DiffusionScreen is the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../tandem/js/Tandem.js';
import GasPropertiesScreen from '../common/GasPropertiesScreen.js';
import GasPropertiesIconFactory from '../common/view/GasPropertiesIconFactory.js';
import gasProperties from '../gasProperties.js';
import GasPropertiesStrings from '../GasPropertiesStrings.js';
import DiffusionModel from './model/DiffusionModel.js';
import DiffusionScreenView from './view/DiffusionScreenView.js';

export default class DiffusionScreen extends GasPropertiesScreen<DiffusionModel, DiffusionScreenView> {

  public constructor( tandem: Tandem ) {

    const createModel = () => new DiffusionModel( tandem.createTandem( 'model' ) );
    const createView = ( model: DiffusionModel ) => new DiffusionScreenView( model, tandem.createTandem( 'view' ) );

    super( createModel, createView, {
      name: GasPropertiesStrings.screen.diffusionStringProperty,
      homeScreenIcon: GasPropertiesIconFactory.createDiffusionScreenIcon(),
      tandem: tandem
    } );
  }
}

gasProperties.register( 'DiffusionScreen', DiffusionScreen );