// Copyright 2019-2022, University of Colorado Boulder

/**
 * HistogramNode is the base class for the 'Speed' and 'Kinetic Energy' histograms.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, NodeOptions, Rectangle, TColor, Text, TextOptions } from '../../../../scenery/js/imports.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import gasProperties from '../../gasProperties.js';
import BarPlotNode from './BarPlotNode.js';
import IntervalLinesNode from './IntervalLinesNode.js';
import LinePlotNode from './LinePlotNode.js';

// Options for all histogram axis labels
const HISTOGRAM_AXIS_LABEL_OPTIONS = {
  fill: GasPropertiesColors.textFillProperty,
  font: new PhetFont( 14 )
};

type SelfOptions = {
  chartSize?: Dimension2; // size of the Rectangle that is the histogram background
  backgroundFill?: TColor; // histogram background color
  borderStroke?: TColor;
  borderLineWidth?: number;
  plotLineWidth?: number; // lineWidth for line segment plots
  barColor?: TColor;
};

export type HistogramNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class HistogramNode extends Node {

  // visibility of species-specific plots
  public readonly heavyPlotVisibleProperty: Property<boolean>;
  public readonly lightPlotVisibleProperty: Property<boolean>;

  // Whether updates are enabled, false ignores binCountsUpdatedEmitter.
  // This is used to prevent updates when the accordion box containing a histogram is collapsed.
  public readonly updateEnabledProperty: Property<boolean>;

  /**
   * @param numberOfBins
   * @param binWidth
   * @param binCountsUpdatedEmitter - notifies when the bin counts have changed
   * @param allBinCountsProperty  - bin counts for all particles
   * @param heavyBinCountsProperty - bin counts for heavy particles
   * @param lightBinCountsProperty - bin counts for light particles
   * @param yScaleProperty - scale of the y-axis
   * @param xAxisStringProperty - label on the x-axis
   * @param yAxisStringProperty - label on the y-axis
   * @param providedOptions
   */
  public constructor( numberOfBins: number,
                      binWidth: number,
                      binCountsUpdatedEmitter: Emitter,
                      allBinCountsProperty: Property<number[]>,
                      heavyBinCountsProperty: Property<number[]>,
                      lightBinCountsProperty: Property<number[]>,
                      yScaleProperty: Property<number>,
                      xAxisStringProperty: TReadOnlyProperty<string>,
                      yAxisStringProperty: TReadOnlyProperty<string>,
                      providedOptions: HistogramNodeOptions ) {
    assert && assert( numberOfBins > 0, `invalid numberOfBins: ${numberOfBins}` );
    assert && assert( binWidth > 0, `invalid binWidth: ${binWidth}` );

    const options = optionize<HistogramNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      chartSize: new Dimension2( 150, 130 ),
      backgroundFill: 'black',
      borderStroke: GasPropertiesColors.panelStrokeProperty,
      borderLineWidth: 1,
      plotLineWidth: 2,
      barColor: 'white'
    }, providedOptions );

    // Background appears behind plotted data
    const background = new Rectangle( 0, 0, options.chartSize.width, options.chartSize.height, {
      fill: options.backgroundFill
    } );

    // Outside border appears on top of plotted data
    const border = new Rectangle( 0, 0, options.chartSize.width, options.chartSize.height, {
      stroke: options.borderStroke,
      lineWidth: options.borderLineWidth
    } );

    // The main plot, for all particles
    const allPlotNode = new BarPlotNode( options.chartSize, yScaleProperty, options.barColor );

    // Species-specific plots
    const heavyPlotNode = new LinePlotNode( options.chartSize, yScaleProperty,
      GasPropertiesColors.heavyParticleColorProperty, options.plotLineWidth );
    const lightPlotNode = new LinePlotNode( options.chartSize, yScaleProperty,
      GasPropertiesColors.lightParticleColorProperty, options.plotLineWidth );

    // parent Node for all plotted data
    const plotNodesParent = new Node( {
      children: [ allPlotNode, heavyPlotNode, lightPlotNode ]
    } );

    // Horizontal lines that indicate y-axis scale.
    const intervalLines = new IntervalLinesNode( options.chartSize );

    // x-axis label
    const xAxisLabelNode = new Text( xAxisStringProperty,
      combineOptions<TextOptions>( {}, HISTOGRAM_AXIS_LABEL_OPTIONS, {
        maxWidth: 0.9 * background.width
      } ) );
    xAxisLabelNode.boundsProperty.link( bounds => {
      xAxisLabelNode.centerX = background.centerX;
      xAxisLabelNode.top = background.bottom + 5;
    } );

    // y-axis label
    const yAxisLabelNode = new Text( yAxisStringProperty,
      combineOptions<TextOptions>( {}, HISTOGRAM_AXIS_LABEL_OPTIONS, {
        rotation: -Math.PI / 2,
        maxWidth: 0.9 * background.height
      } ) );
    yAxisLabelNode.boundsProperty.link( bounds => {
      yAxisLabelNode.right = background.left - 8;
      yAxisLabelNode.centerY = background.centerY;
    } );

    options.children = [ background, intervalLines, plotNodesParent, border, xAxisLabelNode, yAxisLabelNode ];

    super( options );

    this.heavyPlotVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'heavyPlotVisibleProperty' ),
      phetioDocumentation: 'whether the plot for heavy particles is visible on the histogram'
    } );

    this.lightPlotVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'lightPlotVisibleProperty' ),
      phetioDocumentation: 'whether the plot for light particles is visible on the histogram'
    } );

    // Update plots to display the current bin counts. Update species-specific plots only if they are visible.
    const updatePlots = () => {

      allPlotNode.plot( allBinCountsProperty.value );

      if ( this.heavyPlotVisibleProperty.value ) {
        heavyPlotNode.plot( heavyBinCountsProperty.value );
      }

      if ( this.lightPlotVisibleProperty.value ) {
        lightPlotNode.plot( lightBinCountsProperty.value );
      }
    };

    // Update everything
    const update = () => {
      updatePlots();
      intervalLines.update( yScaleProperty.value );
    };

    this.updateEnabledProperty = new BooleanProperty( true );
    this.updateEnabledProperty.lazyLink( updateEnabled => {
      if ( updateEnabled ) {
        update();
      }
    } );

    // Update the histogram when the bin counts have been updated. We do this instead of observing the
    // individual bin count Properties to improve performance because the histogram should be updated atomically.
    binCountsUpdatedEmitter.addListener( () => {
      if ( this.updateEnabledProperty.value ) {
        update();
      }
    } );

    // Visibility of heavy plot, update immediately when it's made visible
    this.heavyPlotVisibleProperty.link( visible => {
      heavyPlotNode.visible = visible;
      if ( visible ) {
        heavyPlotNode.plot( heavyBinCountsProperty.value );
      }
    } );

    // Visibility of light plot, update immediately when it's made visible
    this.lightPlotVisibleProperty.link( visible => {
      lightPlotNode.visible = visible;
      if ( visible ) {
        lightPlotNode.plot( lightBinCountsProperty.value );
      }
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public reset(): void {
    this.heavyPlotVisibleProperty.reset();
    this.lightPlotVisibleProperty.reset();
  }
}

gasProperties.register( 'HistogramNode', HistogramNode );