// Copyright 2018-2020, University of Colorado Boulder

/**
 * ExploreScreen is the 'Explore' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../tandem/js/Tandem.js';
import GasPropertiesScreen from '../common/GasPropertiesScreen.js';
import GasPropertiesIconFactory from '../common/view/GasPropertiesIconFactory.js';
import gasPropertiesStrings from '../gasPropertiesStrings.js';
import gasProperties from '../gasProperties.js';
import ExploreModel from './model/ExploreModel.js';
import ExploreScreenView from './view/ExploreScreenView.js';

const screenExploreString = gasPropertiesStrings.screen.explore;

class ExploreScreen extends GasPropertiesScreen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

    const createModel = () => new ExploreModel( tandem.createTandem( 'model' ) );
    const createView = model => new ExploreScreenView( model, tandem.createTandem( 'view' ) );

    super( createModel, createView, tandem, {
      name: screenExploreString,
      homeScreenIcon: GasPropertiesIconFactory.createExploreScreenIcon()
    } );
  }
}

gasProperties.register( 'ExploreScreen', ExploreScreen );
export default ExploreScreen;