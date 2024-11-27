// Copyright 2018-2024, University of Colorado Boulder

/**
 * ExploreScreen is the 'Explore' screen.
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
import ExploreModel from './model/ExploreModel.js';
import ExploreScreenView from './view/ExploreScreenView.js';

export default class ExploreScreen extends Screen<ExploreModel, ExploreScreenView> {

  public constructor( tandem: Tandem ) {

    const createModel = () => new ExploreModel( tandem.createTandem( 'model' ) );

    const createView = ( model: ExploreModel ) => new ExploreScreenView( model, tandem.createTandem( 'view' ) );

    const options = combineOptions<ScreenOptions>( {}, GasPropertiesConstants.SCREEN_OPTIONS, {
      name: GasPropertiesStrings.screen.exploreStringProperty,
      homeScreenIcon: GasPropertiesIconFactory.createExploreScreenIcon(),
      createKeyboardHelpNode: () => new IdealKeyboardHelpContent(),
      tandem: tandem
    } );

    super( createModel, createView, options );
  }
}

gasProperties.register( 'ExploreScreen', ExploreScreen );