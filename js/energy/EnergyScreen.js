// Copyright 2018, University of Colorado Boulder

/**
 * The 'Work' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  var GasPropertiesColors = require( 'GAS_PROPERTIES/common/GasPropertiesColors' );
  var inherit = require( 'PHET_CORE/inherit' );
  var EnergyModel = require( 'GAS_PROPERTIES/energy/model/EnergyModel' );
  var EnergyScreenView = require( 'GAS_PROPERTIES/energy/view/EnergyScreenView' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenEnergyString = require( 'string!GAS_PROPERTIES/screen.energy' );

  /**
   * @constructor
   */
  function EnergyScreen() {

    var options = {
      name: screenEnergyString,
      backgroundColorProperty: new Property( GasPropertiesColors.BACKGROUND_COLOR )
    };

    Screen.call( this,
      function() { return new EnergyModel(); },
      function( model ) { return new EnergyScreenView( model ); },
      options
    );
  }

  gasProperties.register( 'EnergyScreen', EnergyScreen );

  return inherit( Screen, EnergyScreen );
} );