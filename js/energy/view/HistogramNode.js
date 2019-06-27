// Copyright 2019, University of Colorado Boulder

/**
 * HistogramNode is the base class for the 'Speed' and 'Kinetic Energy' histograms.
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
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const LinePlotNode = require( 'GAS_PROPERTIES/energy/view/LinePlotNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );

  // Options for all histogram axis labels
  const HISTOGRAM_AXIS_LABEL_OPTIONS = {
    fill: GasPropertiesColorProfile.textFillProperty,
    font: new PhetFont( 14 )
  };

  class HistogramNode extends Node {

    /**
     * @param {number} numberOfBins
     * @param {number} binWidth
     * @param {Emitter} binCountsUpdatedEmitter - notifies when the bin counts have changed
     * @param {Property.<number[]>} allBinCountsProperty  - bin counts for all particles
     * @param {Property.<number[]>} heavyBinCountsProperty - bin counts for heavy particles
     * @param {Property.<number[]>} lightBinCountsProperty - bin counts for light particles
     * @param {NumberProperty} yScaleProperty - scale of the y axis
     * @param {string} xAxisString - label on the x axis
     * @param {string} yAxisString - label on the y axis
     * @param {Object} [options]
     */
    constructor( numberOfBins, binWidth, binCountsUpdatedEmitter,
                 allBinCountsProperty, heavyBinCountsProperty, lightBinCountsProperty,
                 yScaleProperty, xAxisString, yAxisString,
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
      assert && assert( typeof xAxisString === 'string', `invalid xAxisString: ${xAxisString}` );
      assert && assert( typeof yAxisString === 'string', `invalid yAxisString: ${yAxisString}` );

      options = _.extend( {
        chartSize: new Dimension2( 150, 130 ),   // size of the Rectangle that is the histogram background
        backgroundFill: 'black', // {ColorDef} histogram background color
        borderStroke: GasPropertiesColorProfile.panelStrokeProperty,// {ColorDef}
        borderLineWidth: 1,
        plotLineWidth: 2, // lineWidth for line segment plots
        barColor: 'white', // {ColorDef}

        // {number} space between the interval lines, in number of particles
        intervalLinesSpacing: GasPropertiesConstants.HISTOGRAM_LINE_SPACING,

        // options that style the interval lines
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

      // Horizontal lines that appear at equally-spaced intervals based on y-axis scale.
      // These lines are intended to cue the student about the relative scale of the y axis.
      // More lines means a larger value for 'Number of Particles'.
      const intervalLines = new Path( null, options.intervalLineOptions );

      // x-axis label
      const xAxisLabelNode = new Text( xAxisString, _.extend( {}, HISTOGRAM_AXIS_LABEL_OPTIONS, {
        maxWidth: 0.9 * background.width,
        centerX: background.centerX,
        top: background.bottom + 5
      } ) );

      // y-axis label
      const yAxisLabelNode = new Text( yAxisString, _.extend( {}, HISTOGRAM_AXIS_LABEL_OPTIONS, {
        rotation: -Math.PI / 2,
        maxWidth: 0.9 * background.height,
        right: background.left - 8,
        centerY: background.centerY
      } ) );

      assert && assert( !options.children, 'HistogramNode sets children' );
      options = _.extend( {
        children: [ background, intervalLines, plotNodesParent, border, xAxisLabelNode, yAxisLabelNode ]
      }, options );

      super( options );

      // @public visibility of species-specific plots
      this.heavyPlotVisibleProperty = new BooleanProperty( false );
      this.lightPlotVisibleProperty = new BooleanProperty( false );

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

    /**
     * Resets the histogram view.
     * @public
     */
    reset() {
      this.heavyPlotVisibleProperty.reset();
      this.lightPlotVisibleProperty.reset();
    }
  }

  return gasProperties.register( 'HistogramNode', HistogramNode );
} );