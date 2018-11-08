// Copyright 2018, University of Colorado Boulder

/**
 * Colors used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );

  const GasPropertiesColors = {

    FOREGROUND_COLOR: 'white',
    BACKGROUND_COLOR: 'black',

    HEAVY_PARTICLE: 'rgb( 119, 114, 244 )',
    LIGHT_PARTICLE: 'rgb( 232, 78, 32 )'
  };

  return gasProperties.register( 'GasPropertiesColors', GasPropertiesColors );
} );
