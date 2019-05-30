// Copyright 2018-2019, University of Colorado Boulder

//TODO delete query parameters when they are no longer needed
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

    // Turns off noise that is added to the pressure gauge to make it behave more realistically.
    // See https://github.com/phetsims/gas-properties/issues/92
    // Public facing.
    pressureNoiseOff: { type: 'flag' },

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

    // Shows arrows on x and y axes of histogram when there is data that is out of range
    // For internal use only.
    outOfRangeIndicators: { type: 'flag' },

    // Determines how fast particles are heated or cooled. Smaller number is faster.
    // velocityScale = 1 + heatCoolFactor / GasPropertiesQueryParameters.heatCool;
    // For internal use only.
    heatCool: {
      type: 'number',
      isValidValue: value => ( value >= 100 && value <= 100000 ),
      defaultValue: 800
    },

    // The sample period for the histograms and Average Speed display, in ps.
    // For internal use only.
    histogramSamplePeriod: {
      type: 'number',
      isValidValue: value => ( value > 0 ),
      defaultValue: 1
    },

    // Pressure at which the lid blows off of the container, in kPa.
    // For internal use only.
    maxPressure: {
      type: 'number',
      isValidValue: value => ( value > 0 ),
      defaultValue: 20000
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

    // Sample period for updating the pressure gauge, in ps.
    // For internal use only.
    pressureGaugeSamplePeriod: {
      type: 'number',
      isValidValue: value => ( value > 0 ),
      defaultValue: 0.75
    },

    /**
     * Speed limit for the left movable wall, in pm/ps.
     * For internal use only.
     */
    wallSpeedLimit: {
      type: 'number',
      isValidValue: value => ( value > 0 ),
      defaultValue: 800
    },

    /**
     * Related to animation of heat/cool bucket for 'Pressure T' mode, #88.
     * Temperature changes below this value (in K) are considered zero and result in no animation of flame/ice.
     * This is required to avoid spurious animation due to floating-point errors.
     * For internal use only.
     */
    minDeltaT: {
      type: 'number',
      isValidValue: value => ( value >= 0 ),
      defaultValue: 0.1
    },

    /**
     * Related to animation of heat/cool bucket for 'Pressure T' mode, #88.
     * Temperature changes >= this value (in K) result in flame/ice being fully on.
     * For internal use only.
     */
    maxDeltaT: {
      type: 'number',
      isValidValue: value => ( value > 0 ),
      defaultValue: 100
    },

    /**
     * Related to animation of heat/cool bucket for 'Pressure T' mode, #88.
     * Smallest percentage of the flame/ice that is raised out of the bucket for any temperature change.
     * For internal use only.
     */
    minHeatCoolFactor: {
      type: 'number',
      isValidValue: value => ( value > 0 && value < 1 ),
      defaultValue: 0.2
    },

    /**
     * Related to animation of heat/cool bucket for 'Pressure T' mode, #88.
     * Animation duration in seconds, split evenly between raising and lowering the flame/ice.
     * For internal use only.
     */
    heatCoolDuration: {
      type: 'number',
      isValidValue: value => ( value > 0 ),
      defaultValue: 1.5
    }
  } );

  gasProperties.register( 'GasPropertiesQueryParameters', GasPropertiesQueryParameters );

  // log the values of all sim-specific query parameters
  phet.log && phet.log( 'query parameters: ' + JSON.stringify( GasPropertiesQueryParameters, null, 2 ) );

  return GasPropertiesQueryParameters;
} );
