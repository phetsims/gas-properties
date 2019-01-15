// Copyright 2018, University of Colorado Boulder

/**
 * The 'Work' screen.
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
      super( () => new EnergyModel(), model => new EnergyScreenView( model ), {
        name: screenEnergyString,
        showUnselectedHomeScreenIconFrame: true
      } );
    }
  }

  return gasProperties.register( 'EnergyScreen', EnergyScreen );
} );