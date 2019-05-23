// Copyright 2019, University of Colorado Boulder

/**
 * Base class for general histograms.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ColorDef = require( 'SCENERY/util/ColorDef' );
  const DataSet = require( 'GAS_PROPERTIES/energy/model/DataSet' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const PlotType = require( 'GAS_PROPERTIES/energy/model/PlotType' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const Text = require( 'SCENERY/nodes/Text' );
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
      assert && assert( typeof numberOfBins === 'number' && numberOfBins > 0, `invalid numberOfBins: ${numberOfBins}` );
      assert && assert( typeof binWidth === 'number' && binWidth > 0, `invalid binWidth: ${binWidth}` );
      assert && assert( xAxisLabel instanceof Node, `invalid xAxisLabel: ${xAxisLabel}` );
      assert && assert( yAxisLabel instanceof Node, `invalid yAxisLabel: ${yAxisLabel}` );

      options = _.extend( {

        // size of the Rectangle that is the histogram background
        chartSize: new Dimension2( 150, 130 ),

        maxY: 100, // {number} maximum for the y axis
        yInterval: 20, // {number} a horizontal line will be drawn at intervals of this value

        backgroundFill: 'black', // {ColorDef}
        borderStroke: GasPropertiesColorProfile.panelStrokeProperty,// {ColorDef}
        borderLineWidth: 1,
        plotLineWidth: 2, // lineWidth for PlotType.LINES

        // options for the horizontal interval lines
        intervalLineOptions: {
          stroke: 'white', // {ColorDef}
          opacity: 0.5, // (0,1)
          lineWidth: 0.5
        }

      }, options );

      assert && assert( options.maxY > 0, 'maxY must be positive: ' + options.maxY );
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

      // parent Node for all plotted data, clipped to the background
      const plotNodesParent = new Node( {
        clipArea: Shape.rect( 0, 0, options.chartSize.width, options.chartSize.height )
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

      // Options shared by both out-of-range indicators
      const outOfRangeOptions = {
        font: new PhetFont( { size: 20, weight: 'bold' } ),
        fill: 'white',
        visible: false
      };

      // indicates that y-axis has data that is out of range, up arrow
      const yOutOfRangeNode = new Text( '\u2191', _.extend( {}, outOfRangeOptions, {
        right: background.right - 2,
        top: background.top
      } ) );

      // indicates that x-axis has data that is out of range, right arrow
      const xOutOfRangeNode = new Text( '\u2192', _.extend( {}, outOfRangeOptions, {
        right: yOutOfRangeNode.left - 2,
        top: background.top
      } ) );

      assert && assert( !options.children, 'Histogram sets children' );
      options = _.extend( {
        children: [ background, intervalLines, plotNodesParent, border, xAxisLabel, yAxisLabel ]
      }, options );

      super( options );

      // out-of-range indicators, for debugging
      if ( GasPropertiesQueryParameters.outOfRangeIndicators ) {
        this.addChild( xOutOfRangeNode );
        this.addChild( yOutOfRangeNode );
      }

      // @private
      this.intervalLines = intervalLines;
      this.plotNodesParent = plotNodesParent;
      this.numberOfBins = numberOfBins;
      this.binWidth = binWidth;
      this.chartSize = options.chartSize;
      this.xOutOfRangeNode = xOutOfRangeNode;
      this.yOutOfRangeNode = yOutOfRangeNode;
      this.maxY = options.maxY;
      this.yInterval = options.yInterval;
      this.dataSets = []; // {number[]}
      this.intervalLinesDirty = true; // does intervalLines Shape need recomputing?
      this.plotLineWidth = options.plotLineWidth;
    }

    /**
     * See options.maxY
     * @param {number} maxY
     * @public
     */
    setMaxY( maxY ) {
      assert && assert( typeof maxY === 'number' && maxY > 0, `invalid maxY: ${maxY}` );
      if ( maxY !== this.maxY ) {
        this.maxY = maxY;
        this.intervalLinesDirty = true;
      }
    }

    /**
     * Sets the visibility of a data set.
     * @param {number} index
     * @param {boolean} visible
     */
    setDataSetVisible( index, visible ) {
      assert && assert( typeof index === 'number', `invalid index: ${index}` );
      assert && assert( index > 0 && index < this.plotNodesParent.getChildrenCount(), `index out of range: ${index}` );
      assert && assert( typeof visible === 'boolean', `invalid visible: ${visible}` );

      this.plotNodesParent.getChildAt( index ).visible = visible;
    }

    /**
     * Adds a data set to the histogram.  Data sets are rendered in the order that they are added.
     * Client must call update to render the data set.
     * @param {PlotType} plotType
     * @param {ColorDef} color
     * @returns {number} the index of the data set
     * @public
     */
    addDataSet( plotType, color ) {
      assert && assert( PlotType.includes( plotType ), `invalid plotType: ${plotType}` );
      assert && assert( ColorDef.isColorDef( color ), `invalid color: ${color}` );

      this.dataSets.push( new DataSet( [], plotType, color ) );
      this.plotNodesParent.addChild( new Path( new Shape() ) );
      return this.dataSets.length - 1;
    }

    /**
     * Updates a specific data set that was previously added using addDataSet.
     * Client must call update to render the data set.
     * @param {number} index - the data set's index, returned by addDataSet
     * @param {number[]} valueArrays
     * @public
     */
    updateDataSet( index, valueArrays ) {
      assert && assert( typeof index === 'number', `invalid index: ${index}` );
      assert && assert( index >= 0 && index < this.dataSets.length, `index out of range: ${index}` );
      assert && assert( Array.isArray( valueArrays ), `invalid valueArrays: ${valueArrays}` );

      this.dataSets[ index ].valueArrays = valueArrays;
    }

    /**
     * Updates the histogram. Client is responsible for calling update after adding or updating data sets.
     * @public
     */
    update() {
      assert && assert( this.plotNodesParent.getChildrenCount() === this.dataSets.length,
        'there should be one Path for each DataSet' );
      this.updatePlots();
      this.updateIntervalLines();
    }

    /**
     * Updates the horizontal interval lines. This is a no-op if !this.intervalLinesDirty.
     * @private
     */
    updateIntervalLines() {
      if ( this.intervalLinesDirty ) {

        const shape = new Shape();

        const numberOfLines = Math.floor( this.maxY / this.yInterval );
        const ySpacing = ( this.yInterval / this.maxY ) * this.chartSize.height;

        for ( let i = 1; i <= numberOfLines; i++ ) {
          const y = this.chartSize.height - ( i * ySpacing );
          shape.moveTo( 0, y ).lineTo( this.chartSize.width, y );
        }

        this.intervalLines.shape = shape;

        this.intervalLinesDirty = false;
      }
    }

    /**
     * Updates the plots.
     * @private
     */
    updatePlots() {

      const maxX = this.numberOfBins * this.binWidth;
      let xRangeExceeded = false;
      let yRangeExceeded = false;

      for ( let i = 0; i < this.dataSets.length; i++ ) {

        const dataSet = this.dataSets[ i ];

        // {number[]} Convert data set to counts for each bin.
        const counts = this.getCounts( dataSet );

        // Plot the data set as bars or line segments.
        if ( dataSet.plotType === PlotType.BARS ) {
          this.plotBars( i, counts, dataSet.color );
        }
        else {
          this.plotLines( i, counts, dataSet.color );
        }

        // count the number of values that exceed the x & y ranges
        if ( GasPropertiesQueryParameters.outOfRangeIndicators ) {
          xRangeExceeded = xRangeExceeded || _.some( dataSet.valueArrays, valueArray => _.some( valueArray, value => value > maxX ) );
          yRangeExceeded = yRangeExceeded || _.some( counts, count => ( count > this.maxY ) );
        }
      }

      // If there are values out of range, make the indicators visible.
      this.xOutOfRangeNode.visible = xRangeExceeded;
      this.yOutOfRangeNode.visible = yRangeExceeded;
    }

    /**
     * Converts a data set to an array of counts, one value for each bin.
     * @param {DataSet} dataSet
     * @returns {number[]}
     * @private
     */
    getCounts( dataSet ) {
      assert && assert( dataSet instanceof DataSet, `invalid dataSet: ${dataSet}` );

      const counts = [];
      for ( let i = 0; i < this.numberOfBins; i++ ) {

        // Determine the range of the bin, [min,max)
        const min = i * this.binWidth;
        const max = ( i + 1 ) * this.binWidth;

        // Determine the number of values that belong in this bin
        let totalCount = 0;
        for ( let j = 0; j < dataSet.valueArrays.length; j++ ) {
          const values = dataSet.valueArrays[ j ];
          for ( let k = 0; k < values.length; k++ ) {
            const value = values[ k ];
            if ( value >= min && value < max ) {
              totalCount++;
            }
          }
        }

        // Average over the number of samples
        let averageCount = 0;
        if ( dataSet.valueArrays.length > 0 ) {
          averageCount = totalCount / dataSet.valueArrays.length;
        }
        counts.push( averageCount );
      }
      return counts;
    }

    /**
     * Plots the data set as bars.
     * @param {number} index - data set index
     * @param {number[]} counts - the count for each bin
     * @param {ColorDef} color - the color of the bars
     * @private
     */
    plotBars( index, counts, color ) {
      assert && assert( typeof index === 'number', `invalid index: ${index}` );
      assert && assert( index >= 0 && index < this.plotNodesParent.getChildrenCount(),
        `index out of range: ${index}` );
      assert && assert( Array.isArray( counts ), `invalid counts: ${counts}` );
      assert && assert( ColorDef.isColorDef( color ), `invalid color: ${color}` );

      // Draw the bars as a single shape.
      const shape = new Shape();
      const barWidth = this.chartSize.width / this.numberOfBins;
      for ( let i = 0; i < counts.length; i++ ) {
        if ( counts[ i ] > 0 ) {

          // Compute the bar height
          const barHeight = ( counts[ i ] / this.maxY ) * this.chartSize.height;

          // Add the bar
          shape.rect( i * barWidth, this.chartSize.height - barHeight, barWidth, barHeight );
        }
      }

      // Update the Path that corresponds to the data set.
      const plotNode = this.plotNodesParent.getChildAt( index );
      plotNode.shape = shape;
      plotNode.mutate( {
        fill: color,
        stroke: color // to hide seams
      } );
    }

    /**
     * Plots the data set as lines segments.
     *  @param {number} index - data set index
     * @param {number[]} counts - the count for each bin
     * @param {ColorDef} color - the color of the bars
     * @private
     */
    plotLines( index, counts, color ) {
      assert && assert( typeof index === 'number', `invalid index: ${index}` );
      assert && assert( index >= 0 && index < this.plotNodesParent.getChildrenCount(),
        `index out of range: ${index}` );
      assert && assert( Array.isArray( counts ), `invalid counts: ${counts}` );
      assert && assert( ColorDef.isColorDef( color ), `invalid color: ${color}` );

      assert && assert( index >= 0 && index < this.plotNodesParent.getChildrenCount(),
        `index out of range: ${index}` );

      // Draw the line segments as a single shape.
      const shape = new Shape();
      if ( counts.length > 0 ) {
        shape.moveTo( 0, this.chartSize.height );
        const lineWidth = this.chartSize.width / this.numberOfBins;
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
      }

      // Update the Path that corresponds to the data set.
      const plotNode = this.plotNodesParent.getChildAt( index );
      plotNode.shape = shape;
      plotNode.mutate( {
        fill: null,
        stroke: color,
        lineWidth: this.plotLineWidth
      } );
    }
  }

  return gasProperties.register( 'Histogram', Histogram );
} );