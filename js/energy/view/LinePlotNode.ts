// Copyright 2019-2022, University of Colorado Boulder

/**
 * LinePlotNode plots histogram data as a set of connected line segments. It is used to overlay species-specific
 * histogram data on top of a more typical bar-style histogram.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Path, TColor } from '../../../../scenery/js/imports.js';
import gasProperties from '../../gasProperties.js';

export default class LinePlotNode extends Path {

  private readonly chartSize: Dimension2;
  private readonly yScaleProperty: Property<number>;
  private readonly shapeBounds: Bounds2;

  /**
   * @param chartSize - dimensions of the chart
   * @param yScaleProperty - scale of the y-axis
   * @param color - color of the line segments
   * @param lineWidth - width of the line segments
   */
  public constructor( chartSize: Dimension2, yScaleProperty: Property<number>, color: TColor, lineWidth: number ) {
    assert && assert( lineWidth > 0, `invalid lineWidth: ${lineWidth}` );

    super( new Shape(), {
      stroke: color,
      lineWidth: lineWidth
    } );

    this.chartSize = chartSize;
    this.yScaleProperty = yScaleProperty;
    this.shapeBounds = new Bounds2( 0, 0, chartSize.width, chartSize.height );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Draws the data as a set of line segments.
   * @param binCounts - the count for each bin
   */
  public plot( binCounts: number[] ): void {
    assert && assert( binCounts.length > 0, `invalid binCounts: ${binCounts}` );

    const numberOfBins = binCounts.length;
    const binWidth = this.chartSize.width / numberOfBins;

    const shape = new Shape().moveTo( 0, this.chartSize.height );
    let previousCount = 0;
    for ( let i = 0; i < numberOfBins; i++ ) {

      const binCount = binCounts[ i ];
      assert && assert( binCount <= this.yScaleProperty.value,
        `binCount ${binCount} should be <= yScale ${this.yScaleProperty.value}` );

      const lineHeight = ( binCount / this.yScaleProperty.value ) * this.chartSize.height;
      const y = this.chartSize.height - lineHeight;

      if ( binCount !== previousCount ) {
        shape.lineTo( i * binWidth, y );
      }
      shape.lineTo( ( i + 1 ) * binWidth, y );

      previousCount = binCount;
    }
    this.shape = shape;
  }

  /**
   * Always use the full chart bounds, as a performance optimization.
   * See https://github.com/phetsims/gas-properties/issues/146
   */
  public override computeShapeBounds(): Bounds2 {
    return this.shapeBounds;
  }
}

gasProperties.register( 'LinePlotNode', LinePlotNode );