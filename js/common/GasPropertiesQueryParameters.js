// Copyright 2018, University of Colorado Boulder

/**
 * Query parameters that are specific to the Equality Explorer sim.
 *
 * Running with ?log will print these query parameters and their values to the console.
 *
 * Running with ?dev shows the following things that are specific to this sim:
 * TODO describe what ?dev shows
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );

  const GasPropertiesQueryParameters = QueryStringMachine.getAll( {

    // Shows how the collision detection space is partitioned into a 2D grid of regions.
    // For internal use only, not public facing.
    regions: { type: 'flag' },

    // Shows a 2D grid for the model coordinate frame.
    // For internal use only, not public facing.
    grid: { type: 'flag' },

    // Shows the model and view coordinates that correspond to the cursor location.
    // For internal use only, not public facing.
    pointerCoordinates: { type: 'flag' }

  } );

  gasProperties.register( 'GasPropertiesQueryParameters', GasPropertiesQueryParameters );

  // log the values of all sim-specific query parameters
  phet.log && phet.log( 'query parameters: ' + JSON.stringify( GasPropertiesQueryParameters, null, 2 ) );

  return GasPropertiesQueryParameters;
} );
