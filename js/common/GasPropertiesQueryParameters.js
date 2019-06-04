// Copyright 2018-2019, University of Colorado Boulder

/**
 * Query parameters that are specific to this sim.
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
     * In code, this should not be used or interrogated directly. It is used solely to set the initial value of
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

    // Shows how the collision detection space is partitioned into a 2D grid of regions, see RegionsNode.
    // For internal use only.
    regions: { type: 'flag' },

    // Shows the model and view coordinates that correspond to the cursor location, see PointerCoordinatesNode.
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

    /**
     * Speed limit for the container's left movable wall, in pm/ps.
     * For internal use only.
     */
    wallSpeedLimit: {
      type: 'number',
      isValidValue: value => ( value > 0 ),
      defaultValue: 800
    },

    //==================================================================================================================
    // TODO query parameters below here are candidates for removal
    //==================================================================================================================

    // The sample period for the histograms and Average Speed display, in ps.
    // For internal use only.
    histogramSamplePeriod: {
      type: 'number',
      isValidValue: value => ( value > 0 ),
      defaultValue: 1
    },

    // Number of bins for the histograms.
    // For internal use only.
    bins: {
      type: 'number',
      isValidValue: value => ( value > 0 ),
      defaultValue: 19
    },

    // Bin width for the Speed histogram, in pm/ps
    // For internal use only.
    speedBinWidth: {
      type: 'number',
      isValidValue: value => ( value > 0 ),
      defaultValue: 170
    },

    // Bin width for the Kinetic Energy histogram, in AMU * pm^2 / ps^2
    // For internal use only.
    keBinWidth: {
      type: 'number',
      isValidValue: value => ( value > 0 ),
      defaultValue: 8E5
    },

    /**
     * Related to animation of heat/cool bucket for 'Pressure T' mode, #88.
     * deltaT * N >= this value (in K) results in flame/ice being fully on.
     * For internal use only.
     */
    maxDeltaTN: {
      type: 'number',
      isValidValue: value => ( value > 0 ),
      defaultValue: 10000
    }
  } );

  gasProperties.register( 'GasPropertiesQueryParameters', GasPropertiesQueryParameters );

  // log the values of all sim-specific query parameters
  phet.log && phet.log( 'query parameters: ' + JSON.stringify( GasPropertiesQueryParameters, null, 2 ) );

  return GasPropertiesQueryParameters;
} );
