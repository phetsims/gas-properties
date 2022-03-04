// Copyright 2018-2021, University of Colorado Boulder

/**
 * DimensionalArrowsNode is a horizontal dimensional arrow. It looks like this, but with solid arrow heads:
 *
 * |<- - - ->|
 *
 * NOTE! This implementation is specific to Gas Properties. Since the container grows and shrinks by moving
 * its left wall, we want the arrow to grow from right to left, so that the dashes in its line remain stationary
 * as the container is resized.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import { Line } from '../../../../scenery/js/imports.js';
import { Node } from '../../../../scenery/js/imports.js';
import { Path } from '../../../../scenery/js/imports.js';
import gasProperties from '../../gasProperties.js';

// constants
const DEFAULT_ARROW_HEAD_DIMENSIONS = new Dimension2( 8, 8 );

class DimensionalArrowsNode extends Node {

  /**
   * @param {Property.<number>} lengthProperty - length in view coordinates
   * @param {Object} [options]
   */
  constructor( lengthProperty, options ) {
    assert && assert( lengthProperty instanceof Property, `invalid lengthProperty: ${lengthProperty}` );

    options = merge( {
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
    options = merge( {
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

gasProperties.register( 'DimensionalArrowsNode', DimensionalArrowsNode );
export default DimensionalArrowsNode;