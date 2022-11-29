// Copyright 2018-2022, University of Colorado Boulder

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

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { Line, Node, NodeOptions, Path, TColor } from '../../../../scenery/js/imports.js';
import gasProperties from '../../gasProperties.js';

// constants
const DEFAULT_ARROW_HEAD_DIMENSIONS = new Dimension2( 8, 8 );

type SelfOptions = {
  color?: TColor;
  horizontalLineWidth?: number;
  horizontalLineDash?: number[];
  verticalLineWidth?: number;
  verticalLineLength?: number;
  arrowHeadDimensions?: Dimension2;
};

type DimensionalArrowsNodeOptions = SelfOptions;

export default class DimensionalArrowsNode extends Node {

  /**
   * @param lengthProperty - length in view coordinates
   * @param providedOptions
   */
  public constructor( lengthProperty: TReadOnlyProperty<number>, providedOptions: DimensionalArrowsNodeOptions ) {

    const options = optionize<DimensionalArrowsNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      color: 'black',
      horizontalLineWidth: 2,
      horizontalLineDash: [ 5, 5 ],
      verticalLineWidth: 1,
      verticalLineLength: 12,
      arrowHeadDimensions: DEFAULT_ARROW_HEAD_DIMENSIONS,

      // NodeOptions
      pickable: false
    }, providedOptions );

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

    options.children = [ leftVerticalLine, rightVerticalLine, horizontalLine, leftArrowHead, rightArrowHead ];

    super( options );

    // Make the line grow to the left, and reposition left arrow and vertical line.
    lengthProperty.link( length => {
      horizontalLine.setLine( 0, 0, -length, 0 );
      leftVerticalLine.centerX = -length;
      leftArrowHead.left = -length;
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

gasProperties.register( 'DimensionalArrowsNode', DimensionalArrowsNode );