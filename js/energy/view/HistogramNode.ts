// Copyright 2019-2024, University of Colorado Boulder

/**
 * HistogramNode is the base class for the 'Speed' and 'Kinetic Energy' histograms.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../../dot/js/Range.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Line, Node, NodeOptions, TColor, Text } from '../../../../scenery/js/imports.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import gasProperties from '../../gasProperties.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import GridLineSet from '../../../../bamboo/js/GridLineSet.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import HistogramsModel from '../model/HistogramsModel.js';
import BinCountsPlot from './BinCountsPlot.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import Property from '../../../../axon/js/Property.js';

const AXIS_LABEL_FONT = new PhetFont( 12 );
const TICK_LABEL_FONT = new PhetFont( 12 );

type SelfOptions = {
  chartSize?: Dimension2; // size of the Rectangle that is the histogram background
  backgroundFill?: TColor; // histogram background color
  plotLineWidth?: number; // lineWidth for line segment plots
  barColor?: TColor;
};

export type HistogramNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class HistogramNode extends Node {

  // Visibility of species-specific plots.
  public readonly heavyPlotVisibleProperty: Property<boolean>;
  public readonly lightPlotVisibleProperty: Property<boolean>;

  /**
   * @param numberOfBins
   * @param binWidth
   * @param heavyBinCountsProperty - bin counts for heavy particles
   * @param lightBinCountsProperty - bin counts for light particles
   * @param totalBinCountsProperty  - bin counts for total particles
   * @param zoomLevelIndexProperty - index into HistogramsModel.ZOOM_LEVELS
   * @param xAxisStringProperty - label on the x-axis
   * @param yAxisStringProperty - label on the y-axis
   * @param accordionBoxExpandedProperty - whether the parent accordion box is expanded
   * @param providedOptions
   */
  protected constructor( numberOfBins: number,
                         binWidth: number,
                         heavyBinCountsProperty: TReadOnlyProperty<number[]>,
                         lightBinCountsProperty: TReadOnlyProperty<number[]>,
                         totalBinCountsProperty: TReadOnlyProperty<number[]>,
                         zoomLevelIndexProperty: NumberProperty,
                         xAxisStringProperty: TReadOnlyProperty<string>,
                         yAxisStringProperty: TReadOnlyProperty<string>,
                         accordionBoxExpandedProperty: TReadOnlyProperty<boolean>,
                         providedOptions: HistogramNodeOptions ) {
    assert && assert( numberOfBins > 0, `invalid numberOfBins: ${numberOfBins}` );
    assert && assert( binWidth > 0, `invalid binWidth: ${binWidth}` );

    const options = optionize<HistogramNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      chartSize: new Dimension2( 150, 130 ),
      backgroundFill: 'black',
      plotLineWidth: 2,
      barColor: 'white',

      // NodeOptions
      isDisposable: false,
      phetioFeatured: true
    }, providedOptions );

    const chartTransform = new ChartTransform( {
      viewWidth: options.chartSize.width,
      viewHeight: options.chartSize.height,
      modelXRange: new Range( 0, numberOfBins ),
      modelYRange: new Range( 0, HistogramsModel.ZOOM_LEVELS[ zoomLevelIndexProperty.value ].yMax )
    } );

    // Main body of the chart.
    const chartRectangle = new ChartRectangle( chartTransform, {
      fill: options.backgroundFill,
      stroke: options.backgroundFill
    } );

    // x-axis label
    const xAxisLabelText = new Text( xAxisStringProperty, {
      font: AXIS_LABEL_FONT,
      fill: GasPropertiesColors.textFillProperty,
      maxWidth: 0.9 * chartTransform.viewWidth
    } );
    xAxisLabelText.boundsProperty.link( () => {
      xAxisLabelText.centerX = chartRectangle.centerX;
      xAxisLabelText.top = chartRectangle.bottom + 5;
    } );

    // y-axis label
    const yAxisLabelText = new Text( yAxisStringProperty, {
      font: AXIS_LABEL_FONT,
      fill: GasPropertiesColors.textFillProperty,
      maxWidth: 0.8 * chartTransform.viewHeight,
      rotation: -Math.PI / 2
    } );
    yAxisLabelText.boundsProperty.link( () => {
      yAxisLabelText.right = chartRectangle.left - 8;
      yAxisLabelText.bottom = chartRectangle.bottom - 10;
    } );

    // Grid lines for the y-axis.
    const yMajorGridLines = new GridLineSet( chartTransform, Orientation.VERTICAL, 2, {
      stroke: 'white',
      opacity: 0.75,
      lineWidth: 1
    } );
    const yMinorGridLines = new GridLineSet( chartTransform, Orientation.VERTICAL, 1, {
      stroke: 'white',
      opacity: 0.25,
      lineWidth: 1
    } );

    // Tick mark at yMax. Since we only have one tick mark, do not use bamboo.TickMarkSet.
    const yMaxTickMark = new Line( 0, 0, 6, 0, {
      stroke: GasPropertiesColors.textFillProperty,
      right: chartRectangle.x,
      top: chartRectangle.top
    } );

    // Tick label at yMax. Since we only have one tick mark, do not use bamboo.TickLabelSet.
    // Use a NumberDisplay so that it has constant width.
    const yMaxProperty = new DerivedProperty( [ zoomLevelIndexProperty ],
      zoomLevelIndex => HistogramsModel.ZOOM_LEVELS[ zoomLevelIndex ].yMax, {
        phetioValueType: NumberIO,
        tandem: options.tandem.createTandem( 'yMaxProperty' ),
        phetioFeatured: true,
        phetioDocumentation: 'The maximum y value shown on the histogram\'s y-axis.'
      } );
    const sortedZoomLevels = _.sortBy( HistogramsModel.ZOOM_LEVELS, [ 'yMax' ] );
    const yMaxRange = new Range( sortedZoomLevels[ 0 ].yMax, sortedZoomLevels[ sortedZoomLevels.length - 1 ].yMax );
    const yMaxTickLabel = new NumberDisplay( yMaxProperty, yMaxRange, {
      backgroundFill: null,
      backgroundStroke: null,
      xMargin: 0,
      yMargin: 0,
      textOptions: {
        font: TICK_LABEL_FONT,
        fill: GasPropertiesColors.textFillProperty
      }
    } );
    yMaxTickLabel.boundsProperty.link( () => {
      yMaxTickLabel.right = yMaxTickMark.left - 3;
      yMaxTickLabel.centerY = yMaxTickMark.centerY;
    } );

    const heavyPlotVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'heavyPlotVisibleProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Whether the plot for heavy particles is visible on the histogram.'
    } );

    const lightPlotVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'lightPlotVisibleProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Whether the plot for light particles is visible on the histogram.'
    } );

    // Plots
    const heavyPlotNode = new BinCountsPlot( chartTransform, heavyBinCountsProperty, {
      visibleProperty: DerivedProperty.and( [ heavyPlotVisibleProperty, accordionBoxExpandedProperty ] ),
      stroke: GasPropertiesColors.heavyParticleColorProperty,
      lineWidth: options.plotLineWidth
    } );
    const lightPlotNode = new BinCountsPlot( chartTransform, lightBinCountsProperty, {
      visibleProperty: DerivedProperty.and( [ lightPlotVisibleProperty, accordionBoxExpandedProperty ] ),
      stroke: GasPropertiesColors.lightParticleColorProperty,
      lineWidth: options.plotLineWidth
    } );
    const totalPlotNode = new BinCountsPlot( chartTransform, totalBinCountsProperty, {
      visibleProperty: accordionBoxExpandedProperty,
      fill: options.barColor,
      closeShape: true
    } );

    // Parent for all chart elements that should be clipped to chartRectangle.
    const clippedNode = new Node( {
      clipArea: chartRectangle.getShape(),
      children: [ yMinorGridLines, yMajorGridLines, totalPlotNode, heavyPlotNode, lightPlotNode ]
    } );

    options.children = [ yMaxTickMark, chartRectangle, clippedNode, xAxisLabelText, yAxisLabelText, yMaxTickLabel ];

    super( options );

    this.heavyPlotVisibleProperty = heavyPlotVisibleProperty;
    this.lightPlotVisibleProperty = lightPlotVisibleProperty;

    zoomLevelIndexProperty.link( zoomLevelIndex => {

      const zoomDescription = HistogramsModel.ZOOM_LEVELS[ zoomLevelIndex ];

      // Adjust the chart transform's y-axis range.
      chartTransform.setModelYRange( new Range( 0, zoomDescription.yMax ) );

      // Adjust grid lines.
      yMajorGridLines.setSpacing( zoomDescription.majorGridLineSpacing );
      if ( zoomDescription.minorGridLineSpacing !== null ) {
        yMinorGridLines.visible = true;
        yMinorGridLines.setSpacing( zoomDescription.minorGridLineSpacing );
      }
      else {
        yMinorGridLines.visible = false;
      }
    } );
  }

  public reset(): void {
    this.heavyPlotVisibleProperty.reset();
    this.lightPlotVisibleProperty.reset();
  }
}

gasProperties.register( 'HistogramNode', HistogramNode );