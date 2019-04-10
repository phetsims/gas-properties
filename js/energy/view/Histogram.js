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
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
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
      });
      
      const border = new Rectangle( 0, 0, options.chartSize.width, options.chartSize.height, {
        stroke: options.borderStroke,
        lineWidth: options.borderLineWidth
      });

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
     * Removes a data set from the histogram.
     * @param {DataSet} dataSet
     * @public
     */
    removeDataSet( dataSet ) {
      const index = this.dataSets.indexOf( dataSet );
      assert && assert( index !== 1, 'dataSet does not belong to this Histogram' );
      this.dataSets.splice( index, 1 );
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
      this.barNodesParent.removeAllChildren();
      for ( let i = 0; i < this.dataSets.length; i++ ) {
        this.drawDataSet( this.dataSets[ i ] );
      }
    }

    /**
     * Draws a data set.
     * @param {DataSet} dataSet
     */
    drawDataSet( dataSet ) {

      // Compute the bar width
      const barWidth = this.chartSize.width / this.numberOfBins;

      for ( let i = 0; i < this.numberOfBins; i++ ) {

        // Determine the range of the bin, [min,max)
        const min = i * this.binWidth;
        const max = ( i + 1 ) * this.binWidth;

        // Determine the number of values that belong in this bin
        const count = _.filter( dataSet.values, value => ( value >= min && value < max ) ).length;

        if ( count > 0 ) {

          // Compute the bar height
          const barHeight = ( count / this._maxY ) * this.chartSize.height;
          assert && assert( barHeight <= this.chartSize.height, `barHeight exceeds chart height: ${barHeight}` );

          // Add the bar
          const barNode = new Rectangle( 0, 0, barWidth, barHeight, {
            fill: dataSet.fill,
            stroke: dataSet.stroke,
            left: this.background.left + ( i * barWidth ),
            bottom: this.background.bottom
          } );
          this.barNodesParent.addChild( barNode );
        }
      }
    }
  }

  return gasProperties.register( 'Histogram', Histogram );
} );