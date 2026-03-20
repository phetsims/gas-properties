// Copyright 2019-2026, University of Colorado Boulder

/**
 * TimeTransform is the transform between real and sim time, with instances for the transforms used in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import LinearFunction from '../../../../dot/js/LinearFunction.js';

export default class TimeTransform extends LinearFunction {

  public static readonly NORMAL = new TimeTransform( 2.5 );
  public static readonly SLOW = new TimeTransform( 0.3 );

  /**
   * @param picosecondsPerSecond - number of picoseconds in model time per second of real time
   */
  private constructor( picosecondsPerSecond: number ) {
    assert && assert( picosecondsPerSecond > 0, `invalid picosecondsPerSecond: ${picosecondsPerSecond}` );

    super( 0, 1, 0, picosecondsPerSecond ); // s -> ps
  }
}
