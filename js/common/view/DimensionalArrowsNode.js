// Copyright 2018-2019, University of Colorado Boulder

/**
 * A horizontal dimensional arrow, looks like this, but with solid arrow heads:  |<- - - ->|
 * NOTE! This implementation is specific to Gas Properties in that the arrow grows to the left,
 * which prevents 'strobing' of the dashed line.
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
  const Property = require( 'AXON/Property' );
  const Shape = require( 'KITE/Shape' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const DEFAULT_ARROW_HEAD_DIMENSIONS = new Dimension2( 8, 8 );

  class DimensionalArrowsNode extends Node {

    /**
     * @param {Property.<number>} lengthProperty - length in view coordinates
     * @param {Object} [options]
     */
    constructor( lengthProperty, options ) {
      assert && assert( lengthProperty instanceof Property, `invalid lengthProperty: ${lengthProperty}` );

      options = _.extend( {
        color: 'black',
        horizontalLineWidth: 2,
        horizontalLineDash: [ 5, 5 ],
        verticalLineWidth: 1,
        verticalLineLength: 12,
        arrowHeadDimensions: DEFAULT_ARROW_HEAD_DIMENSIONS
      }, options );

      // horizontal dashed line in center
      const horizontalLine = new Line( 0, 0, 1, 0, {
        stroke: options.color,
        lineWidth: options.horizontalLineWidth,
        lineDash: options.horizontalLineDash
      } );

      // vertical solid line at left end
      const leftVerticalLine = new Line( 0, 0, 0, options.verticalLineLength, {
        stroke: options.color,
        lineWidth: options.verticalLineWidth,
        centerY: horizontalLine.centerY
      } );

      // vertical solid line at right end
      const rightVerticalLine = new Line( 0, 0, 0, options.verticalLineLength, {
        stroke: options.color,
        lineWidth: options.verticalLineWidth,
        centerX: 0,
        centerY: horizontalLine.centerY
      } );

      // arrow head that points left
      const leftArrowHeadShape = new Shape().polygon( [
        new Vector2( 0, 0 ),
        new Vector2( options.arrowHeadDimensions.width, -options.arrowHeadDimensions.height / 2 ),
        new Vector2( options.arrowHeadDimensions.width, options.arrowHeadDimensions.height / 2 )
      ] );
      const leftArrowHead = new Path( leftArrowHeadShape, {
        fill: options.color
      } );

      // arrow head that points right
      const rightArrowHeadShape = leftArrowHeadShape.transformed( Matrix3.scaling( -1, 1 ) );
      const rightArrowHead = new Path( rightArrowHeadShape, {
        fill: options.color,
        right: 0
      } );

      assert && assert( !options.children, 'DimensionalArrowsNode sets children' );
      options = _.extend( {
        children: [ leftVerticalLine, rightVerticalLine, horizontalLine, leftArrowHead, rightArrowHead ]
      }, options );

      super( options );

      // Make the line grow to the left, and reposition left arrow and vertical line.
      lengthProperty.link( length => {
        horizontalLine.setLine( 0, 0, -length, 0 );
        leftVerticalLine.centerX = -length;
        leftArrowHead.left = -length;
      } );
    }
  }

  return gasProperties.register( 'DimensionalArrowsNode', DimensionalArrowsNode );
} );