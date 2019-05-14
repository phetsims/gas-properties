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

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      const createModel = () => new EnergyModel( tandem.createTandem( 'model' ) );
      const createView = ( model ) => new EnergyScreenView( model, tandem.createTandem( 'view' ) );

      super( createModel, createView, tandem, {
        name: screenEnergyString
      } );
    }
  }

  return gasProperties.register( 'EnergyScreen', EnergyScreen );
} );