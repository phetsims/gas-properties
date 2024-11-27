// Copyright 2018-2024, University of Colorado Boulder

/**
 * DiffusionScreen is the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import { combineOptions } from '../../../phet-core/js/optionize.js';
import Tandem from '../../../tandem/js/Tandem.js';
import GasPropertiesConstants from '../common/GasPropertiesConstants.js';
import GasPropertiesIconFactory from '../common/view/GasPropertiesIconFactory.js';
import gasProperties from '../gasProperties.js';
import GasPropertiesStrings from '../GasPropertiesStrings.js';
import DiffusionModel from './model/DiffusionModel.js';
import DiffusionKeyboardHelpContent from './view/DiffusionKeyboardHelpContent.js';
import DiffusionScreenView from './view/DiffusionScreenView.js';

export default class DiffusionScreen extends Screen<DiffusionModel, DiffusionScreenView> {

  public constructor( tandem: Tandem ) {

    const createModel = () => new DiffusionModel( tandem.createTandem( 'model' ) );

    const createView = ( model: DiffusionModel ) => new DiffusionScreenView( model, tandem.createTandem( 'view' ) );

    const options = combineOptions<ScreenOptions>( {}, GasPropertiesConstants.SCREEN_OPTIONS, {
      name: GasPropertiesStrings.screen.diffusionStringProperty,
      homeScreenIcon: GasPropertiesIconFactory.createDiffusionScreenIcon(),
      createKeyboardHelpNode: () => new DiffusionKeyboardHelpContent(),
      tandem: tandem
    } );

    super( createModel, createView, options );
  }
}

gasProperties.register( 'DiffusionScreen', DiffusionScreen );