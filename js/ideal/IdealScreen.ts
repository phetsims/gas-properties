// Copyright 2018-2024, University of Colorado Boulder

/**
 * IdealScreen is the 'Ideal' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import { optionize4 } from '../../../phet-core/js/optionize.js';
import PickOptional from '../../../phet-core/js/types/PickOptional.js';
import Tandem from '../../../tandem/js/Tandem.js';
import GasPropertiesConstants from '../common/GasPropertiesConstants.js';
import GasPropertiesIconFactory from '../common/view/GasPropertiesIconFactory.js';
import IdealKeyboardHelpContent from '../common/view/IdealKeyboardHelpContent.js';
import gasProperties from '../gasProperties.js';
import GasPropertiesStrings from '../GasPropertiesStrings.js';
import IdealModel from './model/IdealModel.js';
import IdealScreenView from './view/IdealScreenView.js';

type SelfOptions = {

  // Whether the sim has the 'Hold Constant' feature.
  hasHoldConstantFeature?: boolean;
};

type IdealScreenOptions = SelfOptions & PickOptional<ScreenOptions, 'name' | 'homeScreenIcon' | 'createKeyboardHelpNode'>;

export default class IdealScreen extends Screen<IdealModel, IdealScreenView> {

  public constructor( tandem: Tandem, providedOptions?: IdealScreenOptions ) {

    const options = optionize4<IdealScreenOptions, SelfOptions, ScreenOptions>()(
      {}, GasPropertiesConstants.SCREEN_OPTIONS, {

        // SelfOptions
        hasHoldConstantFeature: true,

        // ScreenOptions
        name: GasPropertiesStrings.screen.idealStringProperty,
        homeScreenIcon: GasPropertiesIconFactory.createIdealScreenIcon(),
        createKeyboardHelpNode: () => new IdealKeyboardHelpContent(),
        tandem: tandem
      }, providedOptions );

    const createModel = () => new IdealModel( {
      hasHoldConstantFeature: options.hasHoldConstantFeature,
      tandem: tandem.createTandem( 'model' )
    } );

    const createView = ( model: IdealModel ) => new IdealScreenView( model, {
      hasHoldConstantFeature: options.hasHoldConstantFeature,
      tandem: tandem.createTandem( 'view' )
    } );

    super( createModel, createView, options );
  }
}

gasProperties.register( 'IdealScreen', IdealScreen );