// Copyright 2024, University of Colorado Boulder

/**
 * HistogramPlot plots a histogram in the familiar 'bars' style, or as a set of connected lines. The data set consists
 * of the y values for an ordered set of bins.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import { Path, PathOptions } from '../../../../scenery/js/imports.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import { Shape } from '../../../../kite/js/imports.js';
import gasProperties from '../../gasProperties.js';

type SelfOptions = {
  closeShape?: boolean; // Whether to close the Shape that describes the plot.
};

export type HistogramPlotOptions = SelfOptions & PathOptions;

export default class HistogramPlot extends Path {

  private readonly chartTransform: ChartTransform;
  private binCounts: number[];
  private readonly closeShape: boolean;
  private readonly disposeHistogramPlot: () => void;

  public constructor( chartTransform: ChartTransform, binCounts: number[], providedOptions?: HistogramPlotOptions ) {

    const options = optionize<HistogramPlotOptions, SelfOptions, PathOptions>()( {

      // SelfOptions
      closeShape: false
    }, providedOptions );

    super( null, options );

    this.chartTransform = chartTransform;
    this.binCounts = binCounts;
    this.closeShape = options.closeShape;

    // Initialize
    this.update();

    // Update when the transform changes.
    const changedListener = () => this.update();
    chartTransform.changedEmitter.addListener( changedListener );

    this.disposeHistogramPlot = () => chartTransform.changedEmitter.removeListener( changedListener );
  }

  public override dispose(): void {
    this.disposeHistogramPlot();
    super.dispose();
  }

  /**
   * Sets the bin counts and redraws the plot.
   */
  public setBinCounts( binCounts: number[] ): void {
    this.binCounts = binCounts;
    this.update();
  }

  /**
   * Recomputes the rendered shape.
   */
  public update(): void {

    const shape = new Shape();

    const barWidth = this.chartTransform.modelToViewX( 1 );

    // Start at the origin.
    shape.moveTo( this.chartTransform.modelToViewX( 0 ), this.chartTransform.modelToViewY( 0 ) );

    for ( let i = 0; i < this.binCounts.length; i++ ) {

      const binCount = this.binCounts[ i ];
      assert && assert( isFinite( binCount ), `The data set must contain finite numbers: ${binCount}` );

      const viewX = this.chartTransform.modelToViewX( i );
      const viewY = this.chartTransform.modelToViewY( binCount );
      shape.lineTo( viewX, viewY );
      shape.lineTo( viewX + barWidth, viewY );

      // Finish at y = 0.
      if ( i === this.binCounts.length - 1 ) {
        shape.lineTo( viewX + barWidth, this.chartTransform.modelToViewY( 0 ) );
      }
    }

    if ( this.closeShape ) {
      shape.close();
    }

    this.shape = shape.makeImmutable();
  }
}

gasProperties.register( 'HistogramPlot', HistogramPlot );