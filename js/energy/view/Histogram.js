// Copyright 2019, University of Colorado Boulder

//TODO flesh out
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
     * @param {Node} xAxisLabel - label on the x axis
     * @param {Node} yAxisLabel - label on the y axis
     * @param {Object} [options]
     */
    constructor( xAxisLabel, yAxisLabel, options ) {

      options = _.extend( {

        // size of the Rectangle that is the histogram background
        size: new Dimension2( 150, 130 ),

        maxY: 100, // {number} maximum for the y axis
        yInterval: 100, // {number} a horizontal line will be drawn at intervals of this value

        // options for the Rectangle that is the histogram background
        backgroundRectangleOptions: {
          fill: 'black',
          stroke: 'white',
          lineWidth: 1
        },

        // options for the horizontal interval lines
        intervalLineOptions: {
          stroke: 'white',
          lineWidth: 0.5
        }

      }, options );

      assert && assert( options.maxY > 0 && Util.isInteger( options.maxY ),
        'maxY must be a positive integer: ' + options.maxY );
      assert && assert( options.yInterval > 0 && Util.isInteger( options.yInterval ),
        'yInterval must be a positive integer: ' + options.yInterval );

      const backgroundRectangle = new Rectangle( 0, 0, options.size.width, options.size.height,
        options.backgroundRectangleOptions );

      // position the x-axis label
      xAxisLabel.maxWidth = backgroundRectangle.width;
      xAxisLabel.centerX = backgroundRectangle.centerX;
      xAxisLabel.top = backgroundRectangle.bottom + 5;

      // position the y-axis label
      yAxisLabel.rotation = -Math.PI / 2;
      yAxisLabel.maxWidth = backgroundRectangle.height;
      yAxisLabel.right = backgroundRectangle.left - 8;
      yAxisLabel.centerY = backgroundRectangle.centerY;

      assert && assert( !options.children, 'Histogram sets children' );
      options = _.extend( {
        children: [ backgroundRectangle, xAxisLabel, yAxisLabel ]
      }, options );

      super( options );

      // @private
      this._maxY = options.maxY;
      this._yInterval = options.yInterval;
      this.dataSets = []; // {number[]}
    }

    /**
     * Adds a data set to the histogram.  Data sets are rendered in the order that they are added.
     * @param {HistogramDataSet} dataSet
     * @public
     */
    addDataSet( dataSet ) {
      this.dataSets.push( dataSet );
    }

    /**
     * Removes a data set from the histogram.
     * @param {HistogramDataSet} dataSet
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
      //TODO
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
  }

  return gasProperties.register( 'Histogram', Histogram );
} );