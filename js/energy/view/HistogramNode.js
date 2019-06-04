// Copyright 2019, University of Colorado Boulder

/**
 * Base class for the Speed and Kinetic Energy histograms.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BarPlotNode = require( 'GAS_PROPERTIES/energy/view/BarPlotNode' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const ColorDef = require( 'SCENERY/util/ColorDef' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const Emitter = require( 'AXON/Emitter' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const LinePlotNode = require( 'GAS_PROPERTIES/energy/view/LinePlotNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const Util = require( 'DOT/Util' );

  class HistogramNode extends Node {

    /**
     * @param {number} numberOfBins
     * @param {number} binWidth
     * @param {Emitter} binCountsUpdatedEmitter - notifies when the bin counts have changed
     * @param {Property.<number[]>} allBinCountsProperty  - bin counts for all particles
     * @param {Property.<number[]>} heavyBinCountsProperty - bin counts for heavy particles
     * @param {Property.<number[]>} lightBinCountsProperty - bin counts for light particles
     * @param {NumberProperty} yScaleProperty - scale of the y axis
     * @param {Node} xAxisLabel - label on the x axis
     * @param {Node} yAxisLabel - label on the y axis
     * @param {BooleanProperty} heavyPlotVisibleProperty - whether the plot for heavy particles is visible
     * @param {BooleanProperty} lightPlotVisibleProperty - whether the plot for light particles is visible
     * @param {Object} [options]
     */
    constructor( numberOfBins, binWidth, binCountsUpdatedEmitter,
                 allBinCountsProperty, heavyBinCountsProperty, lightBinCountsProperty,
                 yScaleProperty, xAxisLabel, yAxisLabel,
                 heavyPlotVisibleProperty, lightPlotVisibleProperty,
                 options ) {
      assert && assert( typeof numberOfBins === 'number' && numberOfBins > 0, `invalid numberOfBins: ${numberOfBins}` );
      assert && assert( typeof binWidth === 'number' && binWidth > 0, `invalid binWidth: ${binWidth}` );
      assert && assert( binCountsUpdatedEmitter instanceof Emitter,
        `invalid binCountsUpdatedEmitter: ${binCountsUpdatedEmitter}` );
      assert && assert( allBinCountsProperty instanceof Property,
        `invalid allBinCountsProperty: ${allBinCountsProperty}` );
      assert && assert( heavyBinCountsProperty instanceof Property,
        `invalid heavyBinCountsProperty: ${heavyBinCountsProperty}` );
      assert && assert( lightBinCountsProperty instanceof Property,
        `invalid lightBinCountsProperty: ${lightBinCountsProperty}` );
      assert && assert( yScaleProperty instanceof NumberProperty,
        `invalid yScaleProperty: ${yScaleProperty}` );
      assert && assert( xAxisLabel instanceof Node, `invalid xAxisLabel: ${xAxisLabel}` );
      assert && assert( yAxisLabel instanceof Node, `invalid yAxisLabel: ${yAxisLabel}` );
      assert && assert( heavyPlotVisibleProperty instanceof BooleanProperty,
        `invalid heavyPlotVisibleProperty: ${heavyPlotVisibleProperty}` );
      assert && assert( lightPlotVisibleProperty instanceof BooleanProperty,
        `invalid lightPlotVisibleProperty: ${lightPlotVisibleProperty}` );

      options = _.extend( {
        chartSize: new Dimension2( 150, 130 ),   // size of the Rectangle that is the histogram background
        backgroundFill: 'black', // {ColorDef} histogram background color
        borderStroke: GasPropertiesColorProfile.panelStrokeProperty,// {ColorDef}
        borderLineWidth: 1,
        plotLineWidth: 2, // lineWidth for line segment plots
        barColor: 'white', // {ColorDef}

        // options for the horizontal interval lines
        intervalLinesSpacing: 20, // {number} a horizontal line will be drawn at intervals of this value
        intervalLineOptions: {
          stroke: 'white', // {ColorDef}
          opacity: 0.5, // (0,1)
          lineWidth: 0.5
        }

      }, options );

      assert && assert( options.barColor !== null && ColorDef.isColorDef( options.barColor ),
        `invalid barColor: ${options.barColor}` );
      assert && assert( options.intervalLinesSpacing > 0 && Util.isInteger( options.intervalLinesSpacing ),
        'intervalLinesSpacing must be a positive integer: ' + options.intervalLinesSpacing );

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
        GasPropertiesColorProfile.heavyParticleColorProperty, options.plotLineWidth, );
      const lightPlotNode = new LinePlotNode( options.chartSize, yScaleProperty,
        GasPropertiesColorProfile.lightParticleColorProperty, options.plotLineWidth );

      // parent Node for all plotted data
      const plotNodesParent = new Node( {
        children: [ allPlotNode, heavyPlotNode, lightPlotNode ]
      } );

      // horizontal lines that appear at equally-spaced intervals based on y-axis scale
      const intervalLines = new Path( null, options.intervalLineOptions );

      // position the x-axis label
      xAxisLabel.maxWidth = 0.65 * background.width; // leave room for out-of-range ellipsis!
      xAxisLabel.centerX = background.centerX;
      xAxisLabel.top = background.bottom + 5;

      // rotate and position the y-axis label
      yAxisLabel.rotation = -Math.PI / 2;
      yAxisLabel.maxWidth = 0.85 * background.height;
      yAxisLabel.right = background.left - 8;
      yAxisLabel.centerY = background.centerY;

      assert && assert( !options.children, 'HistogramNode sets children' );
      options = _.extend( {
        children: [ background, intervalLines, plotNodesParent, border, xAxisLabel, yAxisLabel ]
      }, options );

      super( options );

      // Update plots to display the current bin counts. Update species-specific plots only if they are visible.
      const updatePlots = () => {

        allPlotNode.plot( allBinCountsProperty.value );

        if ( heavyPlotVisibleProperty.value ) {
          heavyPlotNode.plot( heavyBinCountsProperty.value );
        }

        if ( lightPlotVisibleProperty.value ) {
          lightPlotNode.plot( lightBinCountsProperty.value );
        }
      };

      // Update the interval lines if the y-axis scale has changed.
      let previousMaxY = null;
      const updateIntervalLines = () => {
        const maxY = yScaleProperty.value;
        if ( previousMaxY === null || previousMaxY !== maxY ) {

          const shape = new Shape();

          const numberOfLines = Math.floor( maxY / options.intervalLinesSpacing );
          const ySpacing = ( options.intervalLinesSpacing / maxY ) * options.chartSize.height;

          for ( let i = 1; i <= numberOfLines; i++ ) {
            const y = options.chartSize.height - ( i * ySpacing );
            shape.moveTo( 0, y ).lineTo( options.chartSize.width, y );
          }

          intervalLines.shape = shape;

          previousMaxY = maxY;
        }
      };

      // Update everything
      const update = () => {
        updatePlots();
        updateIntervalLines();
      };

      // @public whether update are enabled, false ignores binCountsUpdatedEmitter.
      // This is used to prevent updates when the accordion box containing a histogram is collapsed.
      this.updateEnabledProperty = new BooleanProperty( true );
      this.updateEnabledProperty.lazyLink( updateEnabled => {
        if ( updateEnabled ) {
          update();
        }
      } );

      // Update the histogram when the bin counts have been updated.
      binCountsUpdatedEmitter.addListener( () => {
        if ( this.updateEnabledProperty.value ) {
          update();
        }
      } );

      // Visibility of heavy plot, update immediately when it's made visible
      heavyPlotVisibleProperty.link( visible => {
        heavyPlotNode.visible = visible;
        if ( visible ) {
          heavyPlotNode.plot( heavyBinCountsProperty.value );
        }
      } );

      // Visibility of light plot, update immediately when it's made visible
      lightPlotVisibleProperty.link( visible => {
        lightPlotNode.visible = visible;
        if ( visible ) {
          lightPlotNode.plot( lightBinCountsProperty.value );
        }
      } );
    }
  }

  return gasProperties.register( 'HistogramNode', HistogramNode );
} );