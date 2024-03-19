// Copyright 2018-2024, University of Colorado Boulder

/**
 * ExploreScreen is the 'Explore' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../tandem/js/Tandem.js';
import GasPropertiesScreen from '../common/GasPropertiesScreen.js';
import GasPropertiesIconFactory from '../common/view/GasPropertiesIconFactory.js';
import gasProperties from '../gasProperties.js';
import GasPropertiesStrings from '../GasPropertiesStrings.js';
import ExploreModel from './model/ExploreModel.js';
import ExploreScreenView from './view/ExploreScreenView.js';
import ExploreKeyboardHelpContent from './view/ExploreKeyboardHelpContent.js';

export default class ExploreScreen extends GasPropertiesScreen<ExploreModel, ExploreScreenView> {

  public constructor( tandem: Tandem ) {

    const createModel = () => new ExploreModel( tandem.createTandem( 'model' ) );
    const createView = ( model: ExploreModel ) => new ExploreScreenView( model, tandem.createTandem( 'view' ) );

    super( createModel, createView, {
      name: GasPropertiesStrings.screen.exploreStringProperty,
      homeScreenIcon: GasPropertiesIconFactory.createExploreScreenIcon(),
      createKeyboardHelpNode: () => new ExploreKeyboardHelpContent(),
      tandem: tandem
    } );
  }
}

gasProperties.register( 'ExploreScreen', ExploreScreen );