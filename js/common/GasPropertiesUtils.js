// Copyright 2019, University of Colorado Boulder

/**
 * GasPropertiesUtils is a collection of utility functions used in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const Utils = require( 'DOT/Utils' );

  const GasPropertiesUtils = {

    /**
     * Generates n values with a Gaussian mean and deviation.
     * @param {number} n - number of values to generate
     * @param {number} mean - mean of the Gaussian
     * @param {number} deviation - standard deviation of the Gaussian
     * @param {number} threshold - acceptable difference between the desired and actual mean
     * @returns {number[]}
     */
    getGaussianValues: function( n, mean, deviation, threshold ) {
      assert && assert( typeof n === 'number' && n > 0, `invalid n: ${n}` );
      assert && assert( typeof mean === 'number' && isFinite( mean ), `invalid mean: ${mean}` );
      assert && assert( typeof deviation === 'number' && isFinite( deviation ), `invalid deviation: ${deviation}` );
      assert && assert( typeof threshold === 'number' && threshold >= 0, `invalid threshold: ${threshold}` );

      const values = [];
      let sum = 0;

      // Generate a random Gaussian sample whose values have the desired mean and standard deviation.
      for ( let i = 0; i < n; i++ ) {
        const value = Utils.boxMullerTransform( mean, deviation, phet.joist.random );
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
     * @param {Vector2} p - the point to reflect
     * @param {Vector2} pointOnLine - point on the line
     * @param {number} lineAngle - angle of the line, in radians
     * @param {Vector2} reflectedPoint - the point to be mutated with the return value
     * @returns {Vector2} reflectedPoint mutated
     */
    reflectPointAcrossLine( p, pointOnLine, lineAngle, reflectedPoint ) {
      const alpha = lineAngle % ( Math.PI * 2 );
      const gamma = Math.atan2( ( p.y - pointOnLine.y ), ( p.x - pointOnLine.x ) ) % ( Math.PI * 2 );
      const theta = ( 2 * alpha - gamma ) % ( Math.PI * 2 );
      const d = p.distance( pointOnLine );
      reflectedPoint.setXY( pointOnLine.x + d * Math.cos( theta ), pointOnLine.y + d * Math.sin( theta ) );
      return reflectedPoint;
    },

    /**
     * Determines whether an array is homogeneous.
     * @param {Array} array
     * @param {constructor} Constructor
     * @returns {boolean}
     */
    isArrayOf( array, Constructor ) {
      return Array.isArray( array ) && _.every( array, value => value instanceof Constructor );
    }
  };

  return gasProperties.register( 'GasPropertiesUtils', GasPropertiesUtils );
} );