// Copyright 2019-2023, University of Colorado Boulder

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
  private readonly yMaxProperty: Property<number>;
  private readonly shapeBounds: Bounds2;

  /**
   * @param chartSize - dimensions of the chart
   * @param yMaxProperty - maximum of the y-axis range
   * @param color - color of the bars
   */
  public constructor( chartSize: Dimension2, yMaxProperty: Property<number>, color: TColor ) {

    super( new Shape(), {

      // PathOptions
      isDisposable: false,
      fill: color,
      stroke: color // to hide seams
    } );

    this.chartSize = chartSize;
    this.yMaxProperty = yMaxProperty;
    this.shapeBounds = new Bounds2( 0, 0, chartSize.width, chartSize.height );
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

      if ( binCount > 0 ) {

        // Compute the bar height
        const barHeight = ( binCount / this.yMaxProperty.value ) * this.chartSize.height;

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