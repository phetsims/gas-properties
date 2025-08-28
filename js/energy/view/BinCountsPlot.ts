// Copyright 2024-2025, University of Colorado Boulder

/**
 * BinCountsPlot plots the counts for an ordered set of bins. The bins are positioned at integer x values, while
 * the counts are y values.  This results in a plot that looks like the familiar 'bars' style histogram.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Path, { PathOptions } from '../../../../scenery/js/nodes/Path.js';
import gasProperties from '../../gasProperties.js';

type SelfOptions = {
  closeShape?: boolean; // Whether to close the Shape that describes the plot.
};

export type HistogramPlotOptions = SelfOptions & PathOptions;

export default class BinCountsPlot extends Path {

  // Model-view transform for plotting data.
  private readonly chartTransform: ChartTransform;

  // Bin counts to be rendered, in order from left to right.
  private readonly binCountsProperty: TReadOnlyProperty<number[]>;

  // Whether to close the Shape that describes the plot.
  private readonly closeShape: boolean;

  public constructor( chartTransform: ChartTransform,
                      binCountsProperty: TReadOnlyProperty<number[]>,
                      providedOptions?: HistogramPlotOptions ) {

    const options = optionize<HistogramPlotOptions, SelfOptions, PathOptions>()( {

      // SelfOptions
      isDisposable: false,
      closeShape: false
    }, providedOptions );

    super( null, options );

    this.chartTransform = chartTransform;
    this.binCountsProperty = binCountsProperty;
    this.closeShape = options.closeShape;

    // Update when the bin counts change, or the plot is made visible.
    Multilink.multilink( [ binCountsProperty, this.visibleProperty ], () => this.update() );

    // Update when the chart transform changes.
    chartTransform.changedEmitter.addListener( () => this.update() );
  }

  /**
   * Recomputes the rendered shape. As a performance optimization, this is a no-op if the plot is not visible.
   */
  public update(): void {
    if ( this.visibleProperty.value ) {

      const shape = new Shape();

      const barWidth = this.chartTransform.modelToViewX( 1 );

      // Start at the origin.
      shape.moveTo( this.chartTransform.modelToViewX( 0 ), this.chartTransform.modelToViewY( 0 ) );

      const binCounts = this.binCountsProperty.value;
      for ( let i = 0; i < binCounts.length; i++ ) {

        const binCount = binCounts[ i ];
        assert && assert( isFinite( binCount ), `The data set must contain finite numbers: ${binCount}` );

        const viewX = this.chartTransform.modelToViewX( i );
        const viewY = this.chartTransform.modelToViewY( binCount );
        shape.lineTo( viewX, viewY );
        shape.lineTo( viewX + barWidth, viewY );

        // Finish at y = 0.
        if ( i === binCounts.length - 1 ) {
          shape.lineTo( viewX + barWidth, this.chartTransform.modelToViewY( 0 ) );
        }
      }

      if ( this.closeShape ) {
        shape.close();
      }

      this.shape = shape.makeImmutable();
    }
  }
}

gasProperties.register( 'BinCountsPlot', BinCountsPlot );