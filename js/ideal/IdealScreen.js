// Copyright 2018-2022, University of Colorado Boulder

/**
 * IdealScreen is the 'Ideal' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../phet-core/js/merge.js';
import Tandem from '../../../tandem/js/Tandem.js';
import GasPropertiesScreen from '../common/GasPropertiesScreen.js';
import GasPropertiesIconFactory from '../common/view/GasPropertiesIconFactory.js';
import gasProperties from '../gasProperties.js';
import GasPropertiesStrings from '../GasPropertiesStrings.js';
import IdealModel from './model/IdealModel.js';
import IdealScreenView from './view/IdealScreenView.js';

class IdealScreen extends GasPropertiesScreen {

  /**
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( tandem, options ) {
    assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

    options = merge( {

      hasHoldConstantControls: true,

      // superclass options
      name: GasPropertiesStrings.screen.idealStringProperty,
      homeScreenIcon: GasPropertiesIconFactory.createIdealScreenIcon(),
      tandem: tandem
    }, options );

    const createModel = () => new IdealModel( tandem.createTandem( 'model' ) );
    const createView = model => new IdealScreenView( model, tandem.createTandem( 'view' ), {
      hasHoldConstantControls: options.hasHoldConstantControls
    } );

    super( createModel, createView, options );
  }
}

gasProperties.register( 'IdealScreen', IdealScreen );
export default IdealScreen;