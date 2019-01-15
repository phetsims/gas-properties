// Copyright 2018, University of Colorado Boulder

/**
 * The 'Explore' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ExploreModel = require( 'GAS_PROPERTIES/explore/model/ExploreModel' );
  const ExploreScreenView = require( 'GAS_PROPERTIES/explore/view/ExploreScreenView' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesScreen = require( 'GAS_PROPERTIES/common/GasPropertiesScreen' );

  // strings
  const screenExploreString = require( 'string!GAS_PROPERTIES/screen.explore' );

  class ExploreScreen extends GasPropertiesScreen {

    constructor() {
      super( () => new ExploreModel(), model => new ExploreScreenView( model ), {
        name: screenExploreString
      } );
    }
  }

  return gasProperties.register( 'ExploreScreen', ExploreScreen );
} );