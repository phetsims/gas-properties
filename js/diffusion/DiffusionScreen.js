// Copyright 2018-2020, University of Colorado Boulder

/**
 * DiffusionScreen is the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../tandem/js/Tandem.js';
import GasPropertiesScreen from '../common/GasPropertiesScreen.js';
import GasPropertiesIconFactory from '../common/view/GasPropertiesIconFactory.js';
import gasPropertiesStrings from '../gas-properties-strings.js';
import gasProperties from '../gasProperties.js';
import DiffusionModel from './model/DiffusionModel.js';
import DiffusionScreenView from './view/DiffusionScreenView.js';

const screenDiffusionString = gasPropertiesStrings.screen.diffusion;

class DiffusionScreen extends GasPropertiesScreen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

    const createModel = () => new DiffusionModel( tandem.createTandem( 'model' ) );
    const createView = model => new DiffusionScreenView( model, tandem.createTandem( 'view' ) );

    super( createModel, createView, tandem, {
      name: screenDiffusionString,
      homeScreenIcon: GasPropertiesIconFactory.createDiffusionScreenIcon()
    } );
  }
}

gasProperties.register( 'DiffusionScreen', DiffusionScreen );
export default DiffusionScreen;