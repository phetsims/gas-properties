// Copyright 2018, University of Colorado Boulder

/**
 * A horizontal dimensional arrow, looks like this, but with solid arrow heads:  |<- - - ->|
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Matrix3 = require( 'DOT/Matrix3' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const DEFAULT_ARROW_HEAD_DIMENSIONS = new Dimension2( 8, 8 );

  class DimensionalArrowNode extends Node {

    /**
     * @param {number} length
     * @param {Object} [options]
     */
    constructor( length, options ) {

      options = _.extend( {
        color: 'black',
        horizontalLineWidth: 2,
        horizontalLineDash: [ 4, 4 ],
        verticalLineWidth: 1,
        verticalLineLength: 12,
        arrowHeadDimensions: DEFAULT_ARROW_HEAD_DIMENSIONS
      }, options );

      // horizontal line in center
      const horizontalLine = new Line( 0, 0, length, 0, {
        stroke: options.color,
        lineWidth: options.horizontalLineWidth,
        lineDash: options.horizontalLineDash,
        maxWidth: length
      } );

      // vertical line at left end
      const leftVerticalLine = new Line( 0, 0, 0, options.verticalLineLength, {
        stroke: options.color,
        lineWidth: options.verticalLineWidth,
        centerX: 0,
        centerY: horizontalLine.centerY
      } );

      // vertical line at right end
      const rightVerticalLine = new Line( 0, 0, 0, options.verticalLineLength, {
        stroke: options.color,
        lineWidth: options.verticalLineWidth,
        centerX: length,
        centerY: horizontalLine.centerY
      } );

      // arrow head that points left
      const leftArrowHeadShape = new Shape().polygon( [
        new Vector2( 0, 0 ),
        new Vector2( options.arrowHeadDimensions.width, -options.arrowHeadDimensions.height / 2 ),
        new Vector2( options.arrowHeadDimensions.width, options.arrowHeadDimensions.height / 2 )
      ] );
      const leftArrowHead = new Path( leftArrowHeadShape, {
        fill: options.color,
        left: leftVerticalLine.right
      } );

      // arrow head that points right
      const rightArrowHeadShape = leftArrowHeadShape.transformed( Matrix3.scaling( -1, 1 ) );
      const rightArrowHead = new Path( rightArrowHeadShape, {
        fill: options.color,
        right: rightVerticalLine.left
      } );

      assert && assert( !options.children, 'DimensionalArrowNode sets children' );
      options.children = [ leftVerticalLine, rightVerticalLine, horizontalLine, leftArrowHead, rightArrowHead ];

      super( options );
    }
  }

  return gasProperties.register( 'DimensionalArrowNode', DimensionalArrowNode );
} ); 