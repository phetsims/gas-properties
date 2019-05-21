// Copyright 2018-2019, University of Colorado Boulder

//TODO delete query parameters when they are no longer needed
/**
 * Query parameters that are specific to this sim.
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

    // Strokes the canvasBounds of each CanvasNode.
    // For internal use only, not public facing.
    canvasBounds: { type: 'flag' },

    // Shows how the collision detection space is partitioned into a 2D grid of regions.
    // For internal use only, not public facing.
    regions: { type: 'flag' },

    // Shows a 2D grid for the model coordinate frame.
    // For internal use only, not public facing.
    grid: { type: 'flag' },

    // Shows the model and view coordinates that correspond to the cursor location.
    // For internal use only, not public facing.
    pointerCoordinates: { type: 'flag' },

    // Shows arrows on x and y axes of histogram when there is data that is out of range
    // For internal use only, not public facing.
    outOfRangeIndicators: { type: 'flag' },

    // Determines how fast particles are heated or cooled. Smaller number is faster.
    // velocityScale = 1 + heatCoolFactor / GasPropertiesQueryParameters.heatCool;
    // For internal use only, not public facing.
    heatCool: {
      type: 'number',
      isValidValue: value => ( value >= 100 && value <= 100000 ),
      defaultValue: 800
    },

    // The sample period for the histograms and Average Speed display, in ps
    // For internal use only, not public facing.
    histogramSamplePeriod: {
      type: 'number',
      isValidValue: value => ( value > 0 ),
      defaultValue: 1
    },

    // Pressure at which the lid blows off of the container, in kPa.
    // For internal use only, not public facing.
    maxPressure: {
      type: 'number',
      isValidValue: value => ( value > 0 ),
      defaultValue: 20000
    },

    // Maximum number of particles in the Diffusion screen
    // For internal use only, not public facing.
    maxNumberOfParticlesDiffusion: {
      type: 'number',
      isValidValue: value => ( value > 0 ),
      defaultValue: 200
    },

    // The number of samples in the running average for particle flow rate.
    // For internal use only, not public facing.
    flowRateSamples: {
      type: 'number',
      isValidValue: value => ( value > 0 ),
      defaultValue: 50
    },

    // Particle flow rate vector of 1 particle/ps will have a vector (arrow) that is this long.
    // For internal use only, not public facing.
    flowRateScale: {
      type: 'number',
      isValidValue: value => ( value > 0 ),
      defaultValue: 25
    },

    // Number of bins for the histograms.
    // For internal use only, not public facing.
    bins: {
      type: 'number',
      isValidValue: value => ( value > 0 ),
      defaultValue: 19
    },

    // Bin width for the Speed histogram, in pm/ps
    // For internal use only, not public facing.
    speedBinWidth: {
      type: 'number',
      isValidValue: value => ( value > 0 ),
      defaultValue: 170
    },

    // Bin width for the Kinetic Energy histogram, in AMU * pm^2 / ps^2
    // For internal use only, not public facing.
    keBinWidth: {
      type: 'number',
      isValidValue: value => ( value > 0 ),
      defaultValue: 8E5
    },

    // Depth of the container, in pm
    // For internal use only, not public facing.
    containerDepth: {
      type: 'number',
      isValidValue: value => ( value > 0 ),
      defaultValue: 4000
    },

    // Minimum amount of jitter in the pressure gauge, in kPa.
    // For internal use only, not public facing.
    minJitter: {
      type: 'number',
      isValidValue: value => ( value >= 0 ),
      defaultValue: 0
    },

    // Maximum amount of jitter in the pressure gauge, in kPa.
    // For internal use only, not public facing.
    maxJitter: {
      type: 'number',
      isValidValue: value => ( value > 0 ),
      defaultValue: 200
    },

    // Sample period for updating the pressure gauge, in ps.
    // For internal use only, not public facing.
    pressureGaugeSamplePeriod: {
      type: 'number',
      isValidValue: value => ( value > 0 ),
      defaultValue: 0.75
    },

    // Sample periods for the collision detector, in ps
    // For internal use only, not public facing.
    collisionCounterSamplePeriods: {
      type: 'array',
      elementSchema: {
        type: 'number'
      },
      defaultValue: [ 5, 10, 20 ],
      isValidValue: array => {
        return ( array.length > 1 ) && // more than one value
               ( _.uniq( array ).length === array.length ) &&  // unique values
               ( _.filter( array, value => value | 0 === value ).length === array.length ); // integer values
      }
    },

    /**
     * x component of the lid's animation speed, in pixels/second. Positive x is to the right.
     * For internal use only, not public facing.
     */
    lidSpeedX: {
      type: 'number',
      defaultValue: -50
    },

    /**
     * y component of the lid's animation speed, in pixels/second. Positive y is down.
     * For internal use only, not public facing.
     */
    lidSpeedY: {
      type: 'number',
      isValidValue: value => ( value < 0 ), // lid must move upward
      defaultValue: -150
    },

    /**
     * The lid's rotation speed, in degrees/second. Positive rotation is clockwise.
     * For internal use only, not public facing.
     */
    lidSpeedTheta: {
      type: 'number',
      defaultValue: -50
    },

    /**
     * Thickness of the container's walls, in pm.
     * For internal use only, not public facing.
     */
    wallThickness: {
      type: 'number',
      isValidValue: value => ( value > 0 ),
      defaultValue: 50
    },

    /**
     * Thickness of the container's lid, in pm.
     * For internal use only, not public facing.
     */
    lidThickness: {
      type: 'number',
      isValidValue: value => ( value > 0 ),
      defaultValue: 150
    },

    /**
     * Thickness of the container's vertical divider, in pm.
     * For internal use only, not public facing.
     */
    dividerThickness: {
      type: 'number',
      isValidValue: value => ( value > 0 ),
      defaultValue: 100
    }
  } );

  gasProperties.register( 'GasPropertiesQueryParameters', GasPropertiesQueryParameters );

  // log the values of all sim-specific query parameters
  phet.log && phet.log( 'query parameters: ' + JSON.stringify( GasPropertiesQueryParameters, null, 2 ) );

  return GasPropertiesQueryParameters;
} );
