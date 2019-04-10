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
     * @param {number[]} values
     * @param {number} binWidth
     * @param {Object} [options]
     */
    constructor( values, binWidth, options ) {

      options = _.extend( {
        stroke: 'black', // {ColorDef}
        fill: 'white' // {ColorDef}
      }, options );

      // @public (read-only)
      this.values = values;
      this.binWidth = binWidth;
      this.stroke = options.stroke;
      this.fill = options.fill;
    }
  }

  return gasProperties.register( 'HistogramDataSet', HistogramDataSet );
} );