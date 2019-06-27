// Copyright 2019, University of Colorado Boulder

/**
 * TimeTransform is the transform between real and sim time, with instances for the transforms used in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const LinearFunction = require( 'DOT/LinearFunction' );

  class TimeTransform extends LinearFunction {

    /**
     * @param {number} picosecondsPerSecond - number of picoseconds in model time per second of real time
     */
    constructor( picosecondsPerSecond ) {
      assert && assert( typeof picosecondsPerSecond === 'number' && picosecondsPerSecond > 0,
        `invalid picosecondsPerSecond: ${picosecondsPerSecond}` );

      super( 0, 1, 0, picosecondsPerSecond ); // s -> ps
    }
  }

  // 'Normal' time scale
  TimeTransform.NORMAL = new TimeTransform( 2.5 );

  // 'Slow' time scale
  TimeTransform.SLOW = new TimeTransform( 0.3 );

  return gasProperties.register( 'TimeTransform', TimeTransform );
} );