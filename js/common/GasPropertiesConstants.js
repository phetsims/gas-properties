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
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );

  var GasPropertiesConstants = {

    SCREEN_VIEW_X_MARGIN: 20,
    SCREEN_VIEW_Y_MARGIN: 20,

    HEAVY_PARTICLES_RANGE: new RangeWithValue( 0, 100, 0 ),
    LIGHT_PARTICLES_RANGE: new RangeWithValue( 0, 100, 0 ),

    TITLE_FONT: new PhetFont( { size: 22, weight: 'bold' } )
  };

  gasProperties.register( 'GasPropertiesConstants', GasPropertiesConstants );

  return GasPropertiesConstants;
} );
