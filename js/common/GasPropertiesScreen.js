// Copyright 2018-2021, University of Colorado Boulder

/**
 * GasPropertiesScreen is the base class for all Screens in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen from '../../../joist/js/Screen.js';
import merge from '../../../phet-core/js/merge.js';
import Tandem from '../../../tandem/js/Tandem.js';
import gasProperties from '../gasProperties.js';
import GasPropertiesColors from './GasPropertiesColors.js';

class GasPropertiesScreen extends Screen {

  /**
   * @param {function: Object} createModel
   * @param {function( model:Object ): ScreenView } createView
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( createModel, createView, tandem, options ) {
    assert && assert( typeof createModel === 'function', `invalid createModel: ${createModel}` );
    assert && assert( typeof createView === 'function', `invalid createView: ${createView}` );
    assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

    options = merge( {

      // superclass options
      backgroundColorProperty: GasPropertiesColors.screenBackgroundColorProperty,

      // put a gray border around unselected icons on the home screen
      showUnselectedHomeScreenIconFrame: true,

      // put a gray border around screen icons when the navigation bar is black
      showScreenIconFrameForNavigationBarFill: 'black'
    }, options );

    assert && assert( !options.tandem, 'GasPropertiesScreen sets tandem' );
    options.tandem = tandem;

    super( createModel, createView, options );
  }
}

gasProperties.register( 'GasPropertiesScreen', GasPropertiesScreen );
export default GasPropertiesScreen;