// Copyright 2019-2022, University of Colorado Boulder

/**
 * IntervalLinesNode renders the horizontal lines that appear at equally-spaced intervals based on a histogram's
 * y-axis scale.  These lines are intended to cue the student about the relative scale of the y-axis.  More lines
 * means a larger value for 'Number of Particles'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Path } from '../../../../scenery/js/imports.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import gasProperties from '../../gasProperties.js';

export default class IntervalLinesNode extends Path {

  private readonly chartSize: Dimension2;
  private readonly shapeBounds: Bounds2;
  private previousMaxY: number | null;

  public constructor( chartSize: Dimension2 ) {

    super( new Shape(), {
      stroke: 'white',
      opacity: 0.5,
      lineWidth: 0.5
    } );

    this.chartSize = chartSize;
    this.shapeBounds = new Bounds2( 0, 0, chartSize.width, chartSize.height );
    this.previousMaxY = null;
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Updates the lines to match the current y scale.
   */
  public update( maxY: number ): void {
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
   */
  public override computeShapeBounds(): Bounds2 {
    return this.shapeBounds;
  }
}

gasProperties.register( 'IntervalLinesNode', IntervalLinesNode );