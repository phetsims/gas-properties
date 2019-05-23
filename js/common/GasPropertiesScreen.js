// Copyright 2018-2019, University of Colorado Boulder

/**
 * Base class for all Screens in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const Screen = require( 'JOIST/Screen' );
  const Tandem = require( 'TANDEM/Tandem' );

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

      options = _.extend( {
        backgroundColorProperty: GasPropertiesColorProfile.screenBackgroundColorProperty,

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

  return gasProperties.register( 'GasPropertiesScreen', GasPropertiesScreen );
} );