// Copyright 2018-2022, University of Colorado Boulder

/**
 * IdealScreen is the 'Ideal' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../phet-core/js/optionize.js';
import PickOptional from '../../../phet-core/js/types/PickOptional.js';
import Tandem from '../../../tandem/js/Tandem.js';
import GasPropertiesScreen, { GasPropertiesScreenOptions } from '../common/GasPropertiesScreen.js';
import GasPropertiesIconFactory from '../common/view/GasPropertiesIconFactory.js';
import gasProperties from '../gasProperties.js';
import GasPropertiesStrings from '../GasPropertiesStrings.js';
import IdealModel from './model/IdealModel.js';
import IdealScreenView from './view/IdealScreenView.js';

type SelfOptions = {

  // Whether the control panel has the radio button group titled 'Hold Constant'
  hasHoldConstantControls?: boolean;
};

type IdealScreenOptions = SelfOptions & PickOptional<GasPropertiesScreenOptions, 'name' | 'homeScreenIcon'>;

export default class IdealScreen extends GasPropertiesScreen<IdealModel, IdealScreenView> {

  public constructor( tandem: Tandem, providedOptions?: IdealScreenOptions ) {

    const options = optionize<IdealScreenOptions, SelfOptions, GasPropertiesScreenOptions>()( {

      // SelfOptions
      hasHoldConstantControls: true,

      // GasPropertiesScreenOptions
      name: GasPropertiesStrings.screen.idealStringProperty,
      homeScreenIcon: GasPropertiesIconFactory.createIdealScreenIcon(),
      tandem: tandem
    }, providedOptions );

    const createModel = () => new IdealModel( tandem.createTandem( 'model' ) );
    const createView = ( model: IdealModel ) => new IdealScreenView( model, tandem.createTandem( 'view' ), {
      hasHoldConstantControls: options.hasHoldConstantControls
    } );

    super( createModel, createView, options );
  }
}

gasProperties.register( 'IdealScreen', IdealScreen );