// Copyright 2019, University of Colorado Boulder

/**
 * Base class for histograms.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const PlotType = require( 'GAS_PROPERTIES/energy/model/PlotType' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );

  // constants
  const ELLIPSIS_STRING = '\u2022\u2022\u2022'; // ...

  class Histogram extends Node {

    /**
     * @param {number} numberOfBins
     * @param {number} binWidth
     * @param {Node} xAxisLabel - label on the x axis
     * @param {Node} yAxisLabel - label on the y axis
     * @param {Object} [options]
     */
    constructor( numberOfBins, binWidth, xAxisLabel, yAxisLabel, options ) {

      options = _.extend( {

        // size of the Rectangle that is the histogram background
        chartSize: new Dimension2( 150, 130 ),

        maxY: 100, // {number} maximum for the y axis
        yInterval: 100, // {number} a horizontal line will be drawn at intervals of this value

        backgroundFill: 'black', // {ColorDef}
        borderStroke: 'white',// {ColorDef}
        borderLineWidth: 1,

        // options for the horizontal interval lines
        intervalLineOptions: {
          stroke: 'white', // {ColorDef}
          opacity: 0.5,
          lineWidth: 0.5
        }

      }, options );

      assert && assert( options.maxY > 0 && Util.isInteger( options.maxY ),
        'maxY must be a positive integer: ' + options.maxY );
      assert && assert( options.yInterval > 0 && Util.isInteger( options.yInterval ),
        'yInterval must be a positive integer: ' + options.yInterval );

      // Background appears behind plotted data
      const background = new Rectangle( 0, 0, options.chartSize.width, options.chartSize.height, {
        fill: options.backgroundFill
      } );

      // Outside border appears on top of plotted data
      const border = new Rectangle( 0, 0, options.chartSize.width, options.chartSize.height, {
        stroke: options.borderStroke,
        lineWidth: options.borderLineWidth
      } );

      // parent Node for all plotted data
      const plotNodesParent = new Node();

      // horizontal lines that appear at equally-spaced intervals based on y-axis scale
      const intervalLines = new Path( null, options.intervalLineOptions );

      // position the x-axis label
      xAxisLabel.maxWidth = 0.65 * background.width; // leave room for out-of-range ellipsis!
      xAxisLabel.centerX = background.centerX;
      xAxisLabel.top = background.bottom + 5;

      // position the y-axis label
      yAxisLabel.rotation = -Math.PI / 2;
      yAxisLabel.maxWidth = 0.85 * background.height;
      yAxisLabel.right = background.left - 8;
      yAxisLabel.centerY = background.centerY;

      //TODO temporary 'out of range' indicator for x axis, ellipsis
      // ellipsis to indicate x-axis data out of range
      const ellipsisNode = new Text( ELLIPSIS_STRING, {
        font: new PhetFont( 14 ),
        fill: GasPropertiesColorProfile.histogramBarColorProperty,
        right: background.right,
        centerY: xAxisLabel.centerY
      } );

      assert && assert( !options.children, 'Histogram sets children' );
      options = _.extend( {
        children: [ background, intervalLines, plotNodesParent, border, xAxisLabel, yAxisLabel, ellipsisNode ]
      }, options );

      super( options );

      // @private
      this.intervalLines = intervalLines;
      this.plotNodesParent = plotNodesParent;
      this.numberOfBins = numberOfBins;
      this.binWidth = binWidth;
      this.chartSize = options.chartSize;
      this.ellipsisNode = ellipsisNode;
      this.maxY = options.maxY;
      this.yInterval = options.yInterval;
      this.dataSets = []; // {number[]}
      this.intervalLinesDirty = true; // does intervalLines Shape need recomputing?
    }

    /**
     * See options.maxY
     * @param {number} maxY
     * @public
     */
    setMaxY( maxY ) {
      assert && assert( maxY > 0 && Util.isInteger( maxY ), 'maxY must be a positive integer: ' + maxY );
      if ( maxY !== this.maxY ) {
        this.maxY = maxY;
        this.intervalLinesDirty = true;
      }
    }

    /**
     * See options.yInterval
     * @param {number} yInterval
     * @public
     */
    setYInterval( yInterval ) {
      assert && assert( yInterval > 0 && Util.isInteger( yInterval ), 'yInterval must be a positive integer: ' + yInterval );
      if ( yInterval !== this.yInterval ) {
        this.yInterval = yInterval;
        this.intervalLinesDirty = true;
      }
    }

    /**
     * Adds a data set to the histogram.  Data sets are rendered in the order that they are added.
     * @param {DataSet} dataSet
     * @public
     */
    addDataSet( dataSet ) {
      this.dataSets.push( dataSet );
    }

    /**
     * Removes all data sets from the histogram.
     * @public
     */
    removeAllDataSets() {
      this.dataSets.length = 0;
    }

    /**
     * Updates the histogram. Client is responsible for calling update after adding or removing data sets.
     * @public
     */
    update() {
      this.updatePlots();
      if ( this.intervalLinesDirty ) {
        this.updateIntervalLines();
        this.intervalLinesDirty = false;
      }
    }

    /**
     * Updates the horizontal interval lines.
     * @private
     */
    updateIntervalLines() {

      const shape = new Shape();

      const numberOfLines = Math.floor( this.maxY / this.yInterval );
      const ySpacing = ( this.yInterval / this.maxY ) * this.chartSize.height;

      for ( let i = 1; i <= numberOfLines; i++ ) {
        const y = this.chartSize.height - ( i * ySpacing );
        shape.moveTo( 0, y ).lineTo( this.chartSize.width, y );
      }

      this.intervalLines.shape = shape;
    }

    /**
     * Updates the plots.
     * @private
     */
    updatePlots() {

      // Remove previous plots
      this.plotNodesParent.removeAllChildren();

      const maxX = this.numberOfBins * this.binWidth;

      let numberOfValuesOutOfRange = 0;

      // Create new plots
      for ( let i = 0; i < this.dataSets.length; i++ ) {

        const dataSet = this.dataSets[ i ];

        // Convert data set to counts for each bin.
        const counts = this.getCounts( dataSet );

        // Plot the data set as bars or line segments.
        if ( dataSet.plotType === PlotType.BARS ) {
          this.plotBars( counts, dataSet.color );
        }
        else {
          this.plotLines( counts, dataSet.color );
        }

        // count the number of values that exceed the x range
        numberOfValuesOutOfRange += _.filter( dataSet.values, value => ( value > maxX ) ).length;
      }

      // If there are values out of range, make the ellipsis visible.
      this.ellipsisNode.visible = ( numberOfValuesOutOfRange > 0 );
    }

    //TODO should this be implemented more efficiently?
    /**
     * Converts a data set to an array of counts, one value for each bin.
     * @param dataSet
     * @returns {number[]}
     * @private
     */
    getCounts( dataSet ) {
      const counts = [];
      for ( let i = 0; i < this.numberOfBins; i++ ) {

        // Determine the range of the bin, [min,max)
        const min = i * this.binWidth;
        const max = ( i + 1 ) * this.binWidth;

        // Determine the number of values that belong in this bin
        const count = _.filter( dataSet.values, value => ( value >= min && value < max ) ).length;

        counts.push( count );
      }
      return counts;
    }

    /**
     * Plots the data set as bars.
     * @param {number[]} counts - the count for each bin
     * @param {ColorDef} color - the color of the bars
     * @private
     */
    plotBars( counts, color ) {

      const shape = new Shape();

      // Compute the bar width
      const barWidth = this.chartSize.width / this.numberOfBins;

      for ( let i = 0; i < counts.length; i++ ) {
        if ( counts[ i ] > 0 ) {

          // Compute the bar height
          const barHeight = ( counts[ i ] / this.maxY ) * this.chartSize.height;
          assert && assert( barHeight <= this.chartSize.height, `barHeight exceeds chart height: ${barHeight}` );

          // Add the bar
          shape.rect( i * barWidth, this.chartSize.height - barHeight, barWidth, barHeight );
        }
      }

      this.plotNodesParent.addChild( new Path( shape, {
        fill: color,
        stroke: color // to hide seams
      } ) );
    }

    /**
     * Plots the data set as lines segments.
     * @param {number[]} counts - the count for each bin
     * @param {ColorDef} color - the color of the bars
     * @private
     */
    plotLines( counts, color ) {

      const shape = new Shape().moveTo( 0, this.chartSize.height );

      // Compute the line width
      const lineWidth = this.chartSize.width / this.numberOfBins;

      // Draw the line segments
      let previousCount = 0;
      for ( let i = 0; i < counts.length; i++ ) {
        const count = counts[ i ];
        const lineHeight = ( count / this.maxY ) * this.chartSize.height;
        const y = this.chartSize.height - lineHeight;
        if ( count !== previousCount ) {
          shape.lineTo( i * lineWidth, y );
        }
        shape.lineTo( ( i + 1 ) * lineWidth, y );
        previousCount = count;
      }

      this.plotNodesParent.addChild( new Path( shape, {
        stroke: color,
        lineWidth: 2 //TODO
      } ) );
    }
  }

  return gasProperties.register( 'Histogram', Histogram );
} );