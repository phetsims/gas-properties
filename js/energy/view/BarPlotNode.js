// Copyright 2019, University of Colorado Boulder

/**
 * BarPlotNode plots histogram data in the familiar 'bars' style.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const ColorDef = require( 'SCENERY/util/ColorDef' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );

  class BarPlotNode extends Path {

    /**
     * @param {Dimension2} chartSize - dimensions of the chart
     * @param {NumberProperty} yScaleProperty - scale of the y axis
     * @param {ColorDef} color - color of the bars
     */
    constructor( chartSize, yScaleProperty, color ) {
      assert && assert( chartSize instanceof Dimension2, `invalid chartSize: ${chartSize}` );
      assert && assert( yScaleProperty instanceof NumberProperty, `invalid yScaleProperty: ${yScaleProperty}` );
      assert && assert( color !== null && ColorDef.isColorDef( color ), `invalid color: ${color}` );

      super( new Shape(), {
        fill: color,
        stroke: color // to hide seams
      } );

      // @private
      this.chartSize = chartSize;
      this.yScaleProperty = yScaleProperty;
      this.shapeBounds = new Bounds2( 0, 0, chartSize.width, chartSize.height );
    }

    /**
     * Draws the data as a single shape consisting of a set of bars.
     * @param {number[]} binCounts - the count for each bin
     * @public
     */
    plot( binCounts ) {
      assert && assert( Array.isArray( binCounts ) && binCounts.length > 0, `invalid binCounts: ${binCounts}` );

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
     * @returns {Bounds2}
     * @public
     * @override
     */
    computeShapeBounds() {
      return this.shapeBounds;
    }
  }

  return gasProperties.register( 'BarPlotNode', BarPlotNode );
} );