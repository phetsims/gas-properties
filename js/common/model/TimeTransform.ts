// Copyright 2019-2022, University of Colorado Boulder

// @ts-nocheck
/**
 * TimeTransform is the transform between real and sim time, with instances for the transforms used in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import LinearFunction from '../../../../dot/js/LinearFunction.js';
import gasProperties from '../../gasProperties.js';

export default class TimeTransform extends LinearFunction {

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

gasProperties.register( 'TimeTransform', TimeTransform );