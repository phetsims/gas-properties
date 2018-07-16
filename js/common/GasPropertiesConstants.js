// Copyright 2018, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var gasProperties = require( 'GAS_PROPERTIES/gasProperties' );

  var GasPropertiesConstants = {

    SCREEN_VIEW_X_MARGIN: 20,
    SCREEN_VIEW_Y_MARGIN: 20
  };

  gasProperties.register( 'GasPropertiesConstants', GasPropertiesConstants );

  return GasPropertiesConstants;
} );
