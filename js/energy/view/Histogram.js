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
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PlotType = require( 'GAS_PROPERTIES/energy/model/PlotType' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const Util = require( 'DOT/Util' );

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
          lineWidth: 0.5
        }

      }, options );

      assert && assert( options.maxY > 0 && Util.isInteger( options.maxY ),
        'maxY must be a positive integer: ' + options.maxY );
      assert && assert( options.yInterval > 0 && Util.isInteger( options.yInterval ),
        'yInterval must be a positive integer: ' + options.yInterval );

      const background = new Rectangle( 0, 0, options.chartSize.width, options.chartSize.height, {
        fill: options.backgroundFill
      } );

      const border = new Rectangle( 0, 0, options.chartSize.width, options.chartSize.height, {
        stroke: options.borderStroke,
        lineWidth: options.borderLineWidth
      } );

      const barNodesParent = new Node();

      // position the x-axis label
      xAxisLabel.maxWidth = background.width;
      xAxisLabel.centerX = background.centerX;
      xAxisLabel.top = background.bottom + 5;

      // position the y-axis label
      yAxisLabel.rotation = -Math.PI / 2;
      yAxisLabel.maxWidth = background.height;
      yAxisLabel.right = background.left - 8;
      yAxisLabel.centerY = background.centerY;

      assert && assert( !options.children, 'Histogram sets children' );
      options = _.extend( {
        children: [ background, barNodesParent, border, xAxisLabel, yAxisLabel ]
      }, options );

      super( options );

      // @private
      this.background = background;
      this.barNodesParent = barNodesParent;
      this.numberOfBins = numberOfBins;
      this.binWidth = binWidth;
      this.chartSize = options.chartSize;
      this._maxY = options.maxY;
      this._yInterval = options.yInterval;
      this.intervalLineOptions = options.intervalLineOptions;
      this.dataSets = []; // {number[]}
    }

    /**
     * See options.maxY
     * @param {number} value
     * @public
     */
    set maxY( value ) {
      assert && assert( value > 0 && Util.isInteger( value ), 'maxY must be a positive integer: ' + value );
      this._maxY = value;
    }

    /**
     * See options.yInterval
     * @param {number} value
     * @public
     */
    set yInterval( value ) {
      assert && assert( value > 0 && Util.isInteger( value ), 'yInterval must be a positive integer: ' + value );
      this._yInterval = value;
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

      // Remove previous plots
      this.barNodesParent.removeAllChildren();

      // Create new plots
      for ( let i = 0; i < this.dataSets.length; i++ ) {
        const dataSet = this.dataSets[ i ];
        const counts = this.getCounts( dataSet );
        if ( dataSet.plotType === PlotType.BARS ) {
          this.drawBars( counts, dataSet.color );
        }
        else {
          this.drawLines( counts, dataSet.color );
        }
      }

      //TODO add 'out of range' indicator
    }

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
     * Draws the data set as a set of bars.
     * @param {number[]} counts - the count for each bin
     * @param {ColorDef} color - the color of the bars
     */
    drawBars( counts, color ) {

      // Compute the bar width
      const barWidth = this.chartSize.width / this.numberOfBins;

      for ( let i = 0; i < counts.length; i++ ) {
        if ( counts[ i ] > 0 ) {

          // Compute the bar height
          const barHeight = ( counts[ i ] / this._maxY ) * this.chartSize.height;
          assert && assert( barHeight <= this.chartSize.height, `barHeight exceeds chart height: ${barHeight}` );

          // Add the bar
          const barNode = new Rectangle( 0, 0, barWidth, barHeight, {
            fill: color,
            stroke: color,
            left: this.background.left + ( i * barWidth ),
            bottom: this.background.bottom
          } );
          this.barNodesParent.addChild( barNode );
        }
      }
    }

    /**
     * Draws the data set as lines segments.
     * @param {number[]} counts - the count for each bin
     * @param {ColorDef} color - the color of the bars
     */
    drawLines( counts, color ) {

      const shape = new Shape().moveTo( 0, this.chartSize.height );

      // Compute the line width
      const lineWidth = this.chartSize.width / this.numberOfBins;

      // Draw the line segments
      let previousCount = 0;
      for ( let i = 0; i < counts.length; i++ ) {
        const count = counts[ i ];
        const lineHeight = ( count / this._maxY ) * this.chartSize.height;
        const y = this.chartSize.height - lineHeight;
        if ( count !== previousCount ) {
          shape.lineTo( i * lineWidth, y );
        }
        shape.lineTo( ( i + 1 ) * lineWidth, y );
        previousCount = count;
      }

      this.barNodesParent.addChild( new Path( shape, {
        stroke: color,
        lineWidth: 2 //TODO
      } ) );
    }
  }

  return gasProperties.register( 'Histogram', Histogram );
} );