// Copyright 2018, University of Colorado Boulder

/**
 * The 'Work' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const DiffusionModel = require( 'GAS_PROPERTIES/diffusion/model/DiffusionModel' );
  const DiffusionScreenView = require( 'GAS_PROPERTIES/diffusion/view/DiffusionScreenView' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesScreen = require( 'GAS_PROPERTIES/common/GasPropertiesScreen' );

  // strings
  const screenDiffusionString = require( 'string!GAS_PROPERTIES/screen.diffusion' );

  class DiffusionScreen extends GasPropertiesScreen {

    constructor() {
      super( () => new DiffusionModel(), model => new DiffusionScreenView( model ), {
        name: screenDiffusionString,
        showUnselectedHomeScreenIconFrame: true
      } );
    }
  }

  return gasProperties.register( 'DiffusionScreen', DiffusionScreen );
} );