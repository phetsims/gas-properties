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
  const IdealModel = require( 'GAS_PROPERTIES/ideal/model/IdealModel' );
  const IdealScreenView = require( 'GAS_PROPERTIES/ideal/view/IdealScreenView' );

  // strings
  const screenIdealString = require( 'string!GAS_PROPERTIES/screen.ideal' );

  class IdealScreen extends GasPropertiesScreen {

    constructor() {
      super(
        // createModel
        () => new IdealModel(),

        // createView
        model => new IdealScreenView( model ), {
          name: screenIdealString
        } );
    }
  }

  return gasProperties.register( 'IdealScreen', IdealScreen );
} );