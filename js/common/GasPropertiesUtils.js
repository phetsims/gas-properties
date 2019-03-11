// Copyright 2019, University of Colorado Boulder

/**
 * Utility methods used in Gas Properties.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );

  const GasPropertiesUtils = {

    /**
     * Determines whether a line segment intersects a rectangle (bounds).
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {Bounds2} b
     * @returns {boolean}
     * @public
     */
    lineSegmentIntersectsBounds( x1, y1, x2, y2, b ) {

      // First test if either endpoint is inside the rectangle.
      // If not, then test whether the line segment intersects any of the 4 line segments that make up the rectangle.
      return b.containsCoordinates( x1, y1 ) ||
             b.containsCoordinates( x2, y2 ) ||
             // left edge
             GasPropertiesUtils.lineSegmentIntersectsLineSegment( x1, y1, x2, y2, b.left, b.top, b.left, b.bottom ) ||
             // right edge
             GasPropertiesUtils.lineSegmentIntersectsLineSegment( x1, y1, x2, y2, b.right, b.top, b.right, b.bottom ) ||
             // top edge
             GasPropertiesUtils.lineSegmentIntersectsLineSegment( x1, y1, x2, y2, b.left, b.top, b.right, b.top ) ||
             // bottom edge
             GasPropertiesUtils.lineSegmentIntersectsLineSegment( x1, y1, x2, y2, b.left, b.bottom, b.right, b.bottom );
    },

    //TODO address this in DOT/Util
    /**
     * Determines whether 2 line segments intersect. Copied from DOT/Util.lineSegmentIntersection because this will be
     * used in critical code and we don't want object allocation.
     * Line segment 1 is defined by (x1,y1) and (x2,y2).
     * Line segment 2 is defined by (x3,y3) and (x4,y4).
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {number} x3
     * @param {number} y3
     * @param {number} x4
     * @param {number} y4
     * @returns {boolean}
     * @public
     */
    lineSegmentIntersectsLineSegment: function( x1, y1, x2, y2, x3, y3, x4, y4 ) {

      // Check if intersection doesn't exist. See http://jeffe.cs.illinois.edu/teaching/373/notes/x06-sweepline.pdf
      // If point1 and point2 are on opposite sides of line 3 4, exactly one of the two triples 1, 3, 4 and 2, 3, 4
      // is in counterclockwise order.
      if ( ccw( x1, y1, x3, y3, x4, y4 ) * ccw( x2, y2, x3, y3, x4, y4 ) > 0 ||
           ccw( x3, y3, x1, y1, x2, y2 ) * ccw( x4, y4, x1, y1, x2, y2 ) > 0 ) {
        return false;
      }

      const denominator = ( x1 - x2 ) * ( y3 - y4 ) - ( y1 - y2 ) * ( x3 - x4 );

      // If denominator is 0, the lines are parallel or coincident
      return ( Math.abs( denominator ) > 1e-10 );
    }
  };

  //TODO make this available in DOT/Util
  /**
   * Copied from DOT/Util, where it was defined inside lineSegmentIntersection.
   * Determines counterclockwiseness. Positive if counterclockwise, negative if clockwise, zero if straight line
   * Point1(a,b), Point2(c,d), Point3(e,f)
   * See http://jeffe.cs.illinois.edu/teaching/373/notes/x05-convexhull.pdf
   * @param {number} a
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @param {number} e
   * @param {number} f
   * @returns {number}
   * @private
   */
  function ccw( a, b, c, d, e, f ) {
    return ( f - b ) * ( c - a ) - ( d - b ) * ( e - a );
  }

  return gasProperties.register( 'GasPropertiesUtils', GasPropertiesUtils );
} );