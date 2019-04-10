// Copyright 2019, University of Colorado Boulder

/**
 * Describes a data set for a histogram.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );

  class HistogramDataSet {

    /**
     * @param {string} debugName - used internally for debugging, not visible to the user
     * @param {number[]} values
     * @param {Range} range
     * @param {number} numberOfBins
     * @param {Object} [options]
     */
    constructor( debugName, values, range, numberOfBins, options ) {

      options = _.extend( {
        stroke: 'black', // {ColorDef}
        fill: null // {ColorDef}
      }, options );

      // @public (read-only)
      this.debugName = debugName;
      this.values = values;
      this.range = range;
      this.numberOfBins = numberOfBins;
      this.stroke = options.stroke;
      this.fill = options.fill;
    }

    get binWidth() { return this.range.length / this.numberOfBins; }
  }

  return gasProperties.register( 'HistogramDataSet', HistogramDataSet );
} );