// Copyright 2019, University of Colorado Boulder

/**
 * Plots histogram data in the familiar 'bars' style.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ColorDef = require( 'SCENERY/util/ColorDef' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );

  class BarPlotNode extends Path {

    /**
     * @param {ColorDef} color
     * @param {Dimension2} chartSize
     * @param {number} minYScale - smallest scale for the y axis
     * @param {NumberProperty} maxBinCountProperty
     */
    constructor( color, chartSize, minYScale, maxBinCountProperty ) {
      assert && assert( color !== null && ColorDef.isColorDef( color ), `invalid color: ${color}` );
      assert && assert( chartSize instanceof Dimension2, `invalid chartSize: ${chartSize}` );
      assert && assert( typeof minYScale === 'number' && minYScale > 0, `invalid minYScale: ${minYScale}` );
      assert && assert( maxBinCountProperty instanceof NumberProperty,
                   `invalid maxBinCountProperty: ${maxBinCountProperty}` );

      super( new Shape(), {
        fill: color,
        stroke: color // to hide seams
      } );

      // @private
      this.chartSize = chartSize;
      this.minYScale = minYScale;
      this.maxBinCountProperty = maxBinCountProperty;
    }

    /**
     * Draws the data as a single shape consisting of a set of bars.
     * @param {number[]} binCounts - the count for each bin
     * @public
     */
    plot( binCounts ) {
      assert && assert( Array.isArray( binCounts ) && binCounts.length > 0, `invalid binCounts: ${binCounts}` );

      const barWidth = this.chartSize.width / binCounts.length;

      // scale of the y axis
      const yScale = Math.max( this.minYScale, this.maxBinCountProperty.value );
      assert && assert( yScale > 0, `invalid yScale: ${yScale} ` );

      const shape = new Shape();
      for ( let i = 0; i < binCounts.length; i++ ) {
        const binCount = binCounts[ i ];
        if ( binCount > 0 ) {

          // Compute the bar height
          const barHeight = ( binCount / yScale ) * this.chartSize.height;

          // Add the bar
          shape.rect( i * barWidth, this.chartSize.height - barHeight, barWidth, barHeight );
        }
      }
      this.shape = shape;
    }
  }

  return gasProperties.register( 'BarPlotNode', BarPlotNode );
} );