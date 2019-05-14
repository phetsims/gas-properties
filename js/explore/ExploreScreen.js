// Copyright 2018-2019, University of Colorado Boulder

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

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      const createModel = () => new ExploreModel( tandem.createTandem( 'model' ) );
      const createView = ( model ) => new ExploreScreenView( model, tandem.createTandem( 'view' ) );

      super( createModel, createView, tandem, {
        name: screenExploreString
      } );
    }
  }

  return gasProperties.register( 'ExploreScreen', ExploreScreen );
} );