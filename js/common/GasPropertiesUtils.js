// Copyright 2019, University of Colorado Boulder

/**
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const Util = require( 'DOT/Util' );

  const GasPropertiesUtils = {

    /**
     * Determines whether a line segment intersects a bounds.
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {Bounds2} bounds
     * @returns {boolean}
     * @private
     */
    lineSegmentIntersectsBounds( x1, y1, x2, y2, bounds ) {
      return bounds.containsCoordinates( x1, y1 ) ||
             bounds.containsCoordinates( x2, y2 ) ||
             Util.lineSegmentIntersection( x1, y1, x2, y2, bounds.left, bounds.top, bounds.left, bounds.bottom ) ||
             Util.lineSegmentIntersection( x1, y1, x2, y2, bounds.right, bounds.top, bounds.right, bounds.bottom ) ||
             Util.lineSegmentIntersection( x1, y1, x2, y2, bounds.left, bounds.top, bounds.right, bounds.top ) ||
             Util.lineSegmentIntersection( x1, y1, x2, y2, bounds.left, bounds.bottom, bounds.right, bounds.bottom );
    }
  };

  return gasProperties.register( 'GasPropertiesUtils', GasPropertiesUtils );
} );