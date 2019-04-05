// Copyright 2018-2019, University of Colorado Boulder

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
    pointerCoordinates: { type: 'flag' },

    // Checks all checkboxes at startup
    // For internal use only, not public facing.
    checked: { type: 'flag' },

    // Expands all accordion boxes at startup
    // For internal use only, not public facing.
    expanded: { type: 'flag' },

    //TODO #45 choose a value and delete
    // Determines when particles will be redistributed as the result of resizing the container in the Ideal screen.
    // 'drag' redistributes as the resize handle is being dragged.
    // 'endDrag' redistributes when the user releases the resize handle, on end drag.
    // For internal use only, not public facing.
    redistribute: {
      type: 'string',
      validValues: [ 'drag', 'end' ],
      defaultValue: 'drag'
    },

    //TODO #44 choose a value and delete
    // Determines how fast particles are heated or cooled. Smaller number is faster.
    // velocityScale = 1 + heatCoolFactor / GasPropertiesQueryParameters.heatCool;
    // For internal use only, not public facing.
    heatCool: {
      type: 'number',
      isValidValue: value => ( value >= 100 && value <= 100000 ),
      defaultValue: 800
    },

    //TODO choose a value and delete
    // Average Speed is smoothed over this interval, in ps
    // For internal use only, not public facing.
    averageSpeedSmoothingInterval: {
      type: 'number',
      isValidValue: value => ( value > 0 ),
      defaultValue: 0.5
    }
  } );

  gasProperties.register( 'GasPropertiesQueryParameters', GasPropertiesQueryParameters );

  // log the values of all sim-specific query parameters
  phet.log && phet.log( 'query parameters: ' + JSON.stringify( GasPropertiesQueryParameters, null, 2 ) );

  //TODO #41 need a better way to prevent graphics processor switching
  phet.chipper.queryParameters.webgl = false;

  return GasPropertiesQueryParameters;
} );
