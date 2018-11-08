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
  const GasPropertiesColors = require( 'GAS_PROPERTIES/common/GasPropertiesColors' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const screenEnergyString = require( 'string!GAS_PROPERTIES/screen.energy' );

  class EnergyScreen extends Screen {

    constructor() {

      const options = {
        name: screenEnergyString,
        backgroundColorProperty: new Property( GasPropertiesColors.BACKGROUND_COLOR )
      };

      super(
        () => new EnergyModel(),
        model => new EnergyScreenView( model ),
        options
      );
    }
  }

  return gasProperties.register( 'EnergyScreen', EnergyScreen );
} );