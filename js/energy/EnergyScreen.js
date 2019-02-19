// Copyright 2018-2019, University of Colorado Boulder

/**
 * The 'Energy' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const EnergyModel = require( 'GAS_PROPERTIES/energy/model/EnergyModel' );
  const EnergyScreenView = require( 'GAS_PROPERTIES/energy/view/EnergyScreenView' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesScreen = require( 'GAS_PROPERTIES/common/GasPropertiesScreen' );

  // strings
  const screenEnergyString = require( 'string!GAS_PROPERTIES/screen.energy' );

  class EnergyScreen extends GasPropertiesScreen {

    constructor() {
      super(
        //createModel
        () => new EnergyModel(),

        // createView
        model => new EnergyScreenView( model ), {
          name: screenEnergyString
        } );
    }
  }

  return gasProperties.register( 'EnergyScreen', EnergyScreen );
} );