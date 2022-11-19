// Copyright 2019-2022, University of Colorado Boulder

/**
 * GasPropertiesUtils is a collection of utility functions used in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import dotRandom from '../../../dot/js/dotRandom.js';
import Utils from '../../../dot/js/Utils.js';
import Vector2 from '../../../dot/js/Vector2.js';
import gasProperties from '../gasProperties.js';

const GasPropertiesUtils = {

  /**
   * Generates n values with a Gaussian mean and deviation.
   * @param n - number of values to generate
   * @param mean - mean of the Gaussian
   * @param deviation - standard deviation of the Gaussian
   * @param threshold - acceptable difference between the desired and actual mean
   */
  getGaussianValues: function( n: number, mean: number, deviation: number, threshold: number ): number[] {
    assert && assert( Number.isInteger( n ) && n > 0, `invalid n: ${n}` );
    assert && assert( isFinite( mean ), `invalid mean: ${mean}` );
    assert && assert( isFinite( deviation ), `invalid deviation: ${deviation}` );
    assert && assert( threshold >= 0, `invalid threshold: ${threshold}` );

    const values: number[] = [];
    let sum = 0;

    // Generate a random Gaussian sample whose values have the desired mean and standard deviation.
    for ( let i = 0; i < n; i++ ) {
      const value = Utils.boxMullerTransform( mean, deviation, dotRandom );
      assert && assert( isFinite( value ), `invalid value: ${value}` );
      values.push( value );
      sum += value;
    }
    assert && assert( values.length === n, 'wrong number of values' );

    // Adjust values so that the actual mean matches the desired mean.
    const emergentMean = sum / n;
    const deltaMean = mean - emergentMean;
    sum = 0;
    for ( let i = values.length - 1; i >= 0; i-- ) {
      const value = values[ i ] + deltaMean;
      assert && assert( isFinite( value ), `invalid value: ${value}` );
      values[ i ] = value;
      sum += value;
    }

    // Verify that the actual mean is within the tolerance.
    const actualMean = sum / n;
    assert && assert( Math.abs( actualMean - mean ) < threshold,
      `mean: ${mean}, actualMean: ${actualMean}` );

    return values;
  },

  /**
   * Determines the position of a point that is the reflection of a specified point across a line.
   * Used in collision response.
   * @param p - the point to reflect
   * @param pointOnLine - point on the line
   * @param lineAngle - angle of the line, in radians
   * @param reflectedPoint - the point to be mutated with the return value
   * @returns reflectedPoint mutated
   */
  reflectPointAcrossLine( p: Vector2, pointOnLine: Vector2, lineAngle: number, reflectedPoint: Vector2 ): Vector2 {
    const alpha = lineAngle % ( Math.PI * 2 );
    const gamma = Math.atan2( ( p.y - pointOnLine.y ), ( p.x - pointOnLine.x ) ) % ( Math.PI * 2 );
    const theta = ( 2 * alpha - gamma ) % ( Math.PI * 2 );
    const d = p.distance( pointOnLine );
    reflectedPoint.setXY( pointOnLine.x + d * Math.cos( theta ), pointOnLine.y + d * Math.sin( theta ) );
    return reflectedPoint;
  }
};

gasProperties.register( 'GasPropertiesUtils', GasPropertiesUtils );
export default GasPropertiesUtils;