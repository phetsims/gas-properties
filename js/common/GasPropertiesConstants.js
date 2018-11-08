// Copyright 2018, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RangeWithValue = require( 'DOT/RangeWithValue' );

  const GasPropertiesConstants = {

    SCREEN_VIEW_X_MARGIN: 20,
    SCREEN_VIEW_Y_MARGIN: 20,

    HEAVY_PARTICLES_RANGE: new RangeWithValue( 0, 250, 0 ),
    LIGHT_PARTICLES_RANGE: new RangeWithValue( 0, 250, 0 ),
    HEAVY_PARTICLES_THUMB_INTERVAL: 10,
    LIGHT_PARTICLES_THUMB_INTERVAL: 10,

    TITLE_FONT: new PhetFont( { size: 22, weight: 'bold' } ),
    PANEL_CORNER_RADIUS: 5,
    PANEL_X_MARGIN: 20,
    PANEL_Y_MARGIN: 15
  };

  return gasProperties.register( 'GasPropertiesConstants', GasPropertiesConstants );
} );
