// Copyright 2018-2019, University of Colorado Boulder

/**
 * The 'Ideal' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesScreen = require( 'GAS_PROPERTIES/common/GasPropertiesScreen' );
  const GasPropertiesModel = require( 'GAS_PROPERTIES/common/model/GasPropertiesModel' );
  const IdealScreenView = require( 'GAS_PROPERTIES/ideal/view/IdealScreenView' );

  // strings
  const screenIdealString = require( 'string!GAS_PROPERTIES/screen.ideal' );

  class IdealScreen extends GasPropertiesScreen {

    constructor() {
      super(
        // createModel
        () => new GasPropertiesModel(),

        // createView
        model => new IdealScreenView( model ), {
          name: screenIdealString
        } );
    }
  }

  return gasProperties.register( 'IdealScreen', IdealScreen );
} );