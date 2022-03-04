// Copyright 2019-2021, University of Colorado Boulder

/**
 * LinePlotNode plots histogram data as a set of connected line segments. It is used to overlay species-specific
 * histogram data on top of a more typical bar-style histogram.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Path } from '../../../../scenery/js/imports.js';
import { ColorDef } from '../../../../scenery/js/imports.js';
import gasProperties from '../../gasProperties.js';

class LinePlotNode extends Path {

  /**
   * @param {Dimension2} chartSize - dimensions of the chart
   * @param {NumberProperty} yScaleProperty - scale of the y axis
   * @param {ColorDef} color - color of the line segments
   * @param {number} lineWidth - width of the line segments
   */
  constructor( chartSize, yScaleProperty, color, lineWidth ) {
    assert && assert( chartSize instanceof Dimension2, `invalid chartSize: ${chartSize}` );
    assert && assert( yScaleProperty instanceof NumberProperty, `invalid yScaleProperty: ${yScaleProperty}` );
    assert && assert( color !== null && ColorDef.isColorDef( color ), `invalid color: ${color}` );
    assert && assert( typeof lineWidth === 'number' && lineWidth > 0, `invalid lineWidth: ${lineWidth}` );

    super( new Shape(), {
      fill: null, // because we're drawing lines
      stroke: color,
      lineWidth: lineWidth
    } );

    // @private
    this.chartSize = chartSize;
    this.yScaleProperty = yScaleProperty;
    this.shapeBounds = new Bounds2( 0, 0, chartSize.width, chartSize.height );
  }

  /**
   * Draws the data as a set of line segments.
   * @param {number[]} binCounts - the count for each bin
   * @public
   */
  plot( binCounts ) {
    assert && assert( Array.isArray( binCounts ) && binCounts.length > 0, `invalid binCounts: ${binCounts}` );

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
   * @returns {Bounds2}
   * @public
   * @override
   */
  computeShapeBounds() {
    return this.shapeBounds;
  }
}

gasProperties.register( 'LinePlotNode', LinePlotNode );
export default LinePlotNode;