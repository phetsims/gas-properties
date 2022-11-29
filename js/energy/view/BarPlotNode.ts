// Copyright 2019-2022, University of Colorado Boulder

/**
 * BarPlotNode plots histogram data in the familiar 'bars' style.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Path, TColor } from '../../../../scenery/js/imports.js';
import gasProperties from '../../gasProperties.js';

export default class BarPlotNode extends Path {

  private readonly chartSize: Dimension2;
  private readonly yScaleProperty: Property<number>;
  private readonly shapeBounds: Bounds2;

  /**
   * @param chartSize - dimensions of the chart
   * @param yScaleProperty - scale of the y-axis
   * @param color - color of the bars
   */
  public constructor( chartSize: Dimension2, yScaleProperty: Property<number>, color: TColor ) {

    super( new Shape(), {
      fill: color,
      stroke: color // to hide seams
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
   * Draws the data as a single shape consisting of a set of bars.
   * @param binCounts - the count for each bin
   */
  public plot( binCounts: number[] ): void {
    assert && assert( binCounts.length > 0, `invalid binCounts: ${binCounts}` );

    const numberOfBins = binCounts.length;
    const barWidth = this.chartSize.width / numberOfBins;

    const shape = new Shape();
    for ( let i = 0; i < numberOfBins; i++ ) {

      const binCount = binCounts[ i ];
      assert && assert( binCount <= this.yScaleProperty.value,
        `binCount ${binCount} should be <= yScale ${this.yScaleProperty.value}` );

      if ( binCount > 0 ) {

        // Compute the bar height
        const barHeight = ( binCount / this.yScaleProperty.value ) * this.chartSize.height;

        // Add the bar
        shape.rect( i * barWidth, this.chartSize.height - barHeight, barWidth, barHeight );
      }
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

gasProperties.register( 'BarPlotNode', BarPlotNode );