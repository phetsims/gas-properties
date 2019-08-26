// Copyright 2019, University of Colorado Boulder

/**
 * IntervalLinesNode renders the horizontal lines that appear at equally-spaced intervals based on a histogram's
 * y-axis scale.  These lines are intended to cue the student about the relative scale of the y axis.  More lines
 * means a larger value for 'Number of Particles'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );

  class IntervalLinesNode extends Path {

    /**
     * @param {Dimension2} chartSize - dimensions of the chart
     */
    constructor( chartSize ) {
      assert && assert( chartSize instanceof Dimension2, `invalid chartSize: ${chartSize}` );

      super( new Shape(), {
        stroke: 'white', // {ColorDef}
        opacity: 0.5, // (0,1)
        lineWidth: 0.5
      } );

      // @private
      this.chartSize = chartSize;
      this.shapeBounds = new Bounds2( 0, 0, chartSize.width, chartSize.height );
    }

    /**
     * Updates the lines to match the current y scale.
     * @param {number} maxY
     * @public
     */
    update( maxY ) {
      if ( this.previousMaxY === null || this.previousMaxY !== maxY ) {

        const shape = new Shape();

        const numberOfLines = Math.floor( maxY / GasPropertiesConstants.HISTOGRAM_LINE_SPACING );
        const ySpacing = ( GasPropertiesConstants.HISTOGRAM_LINE_SPACING / maxY ) * this.chartSize.height;

        for ( let i = 1; i <= numberOfLines; i++ ) {
          const y = this.chartSize.height - ( i * ySpacing );
          shape.moveTo( 0, y ).lineTo( this.chartSize.width, y );
        }

        this.shape = shape;

        this.previousMaxY = maxY;
      }
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

  return gasProperties.register( 'IntervalLinesNode', IntervalLinesNode );
} );