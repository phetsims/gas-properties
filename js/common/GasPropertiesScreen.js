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

  class GasPropertiesScreen extends Screen {

    /**
     * @param {function} createModel
     * @param {function( model:Object ) } createView
     * @param {Object} [options]
     */
    constructor( createModel, createView, options ) {

      options = _.extend( {
        backgroundColorProperty: GasPropertiesColorProfile.screenBackgroundColorProperty,

        // put a gray border around unselected icons on the home screen
        showUnselectedHomeScreenIconFrame: true,

        // put a gray border around screen icons when the navigation bar is black
        showScreenIconFrameForNavigationBarFill: 'black'
      }, options );

      super( createModel, createView, options );
    }
  }

  return gasProperties.register( 'GasPropertiesScreen', GasPropertiesScreen );
} );