// Copyright 2018-2019, University of Colorado Boulder

/**
 * EnergyScreen is the 'Energy' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const EnergyModel = require( 'GAS_PROPERTIES/energy/model/EnergyModel' );
  const EnergyScreenView = require( 'GAS_PROPERTIES/energy/view/EnergyScreenView' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesIconFactory = require( 'GAS_PROPERTIES/common/view/GasPropertiesIconFactory' );
  const GasPropertiesScreen = require( 'GAS_PROPERTIES/common/GasPropertiesScreen' );
  const Tandem = require( 'TANDEM/Tandem' );

  // strings
  const screenEnergyString = require( 'string!GAS_PROPERTIES/screen.energy' );

  class EnergyScreen extends GasPropertiesScreen {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {
      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      const createModel = () => new EnergyModel( tandem.createTandem( 'model' ) );
      const createView = model => new EnergyScreenView( model, tandem.createTandem( 'view' ) );

      super( createModel, createView, tandem, {
        name: screenEnergyString,
        homeScreenIcon: GasPropertiesIconFactory.createEnergyScreenIcon()
      } );
    }
  }

  return gasProperties.register( 'EnergyScreen', EnergyScreen );
} );