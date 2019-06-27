// Copyright 2018-2019, University of Colorado Boulder

/**
 * GasPropertiesQueryParameters defines the query parameters that are specific to this sim.
 * Running with ?log will print these query parameters and their values to the console at startup.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );

  const GasPropertiesQueryParameters = QueryStringMachine.getAll( {

    //==================================================================================================================
    // Public-facing query parameters.
    //==================================================================================================================

    /**
     * Whether to add noise to the pressure gauge to make it behave more realistically. Public facing.
     *
     * In code, this should not be used or interrogated directly. It's sole usage is to set the initial value of
     * GasPropertiesGlobalOptions.pressureNoiseProperty. See https://github.com/phetsims/gas-properties/issues/92
     */
    pressureNoise: {
      type: 'boolean',
      defaultValue: true
    },

    //==================================================================================================================
    // For internal use only. Expose to the public only after discussion and promotion to public-facing.
    //==================================================================================================================

    // Shows a red dot at the origin of some UI components, for debugging layout and drag listeners.
    // For internal use only.
    origin: { type: 'flag' },

    // Fills the canvasBounds of each CanvasNode, for debugging size and position.
    // For internal use only.
    canvasBounds: { type: 'flag' },

    // Shows how the collision detection space is partitioned into a 2D grid of regions.
    // For internal use only.
    regions: { type: 'flag' },

    // Shows the model and view coordinates that correspond to the cursor location.
    // For internal use only.
    pointerCoordinates: { type: 'flag' },

    // Determines how fast particles are heated or cooled. Smaller numbers result in faster heating/cooling.
    // For internal use only.
    heatCool: {
      type: 'number',
      isValidValue: value => ( value > 0 ),
      defaultValue: 800
    },

    // Pressure at which the lid blows off of the container, in kPa.
    // For internal use only.
    maxPressure: {
      type: 'number',
      isValidValue: value => ( value > 0 ),
      defaultValue: 20000
    },

    // Maximum temperature in K. Exceeding this results in an Oops dialog.
    // For internal use only.
    maxTemperature: {
      type: 'number',
      isValidValue: value => ( value > 0 ),
      defaultValue: 100000
    },

    // Speed limit for the container's left movable wall, in pm/ps. Relevant when reducing the container size.
    // For internal use only.
    wallSpeedLimit: {
      type: 'number',
      isValidValue: value => ( value > 0 ),
      defaultValue: 800
    }
  } );

  gasProperties.register( 'GasPropertiesQueryParameters', GasPropertiesQueryParameters );

  // log the values of all sim-specific query parameters
  phet.log && phet.log( 'query parameters: ' + JSON.stringify( GasPropertiesQueryParameters, null, 2 ) );

  return GasPropertiesQueryParameters;
} );
