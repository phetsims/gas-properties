// Copyright 2019, University of Colorado Boulder

/**
 * A data set is a set of values and the colors used to render them.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );

  class DataSet {

    /**
     * @param {number[]} values
     * @param {Object} [options]
     */
    constructor( values, options ) {

      options = _.extend( {
        stroke: 'black', // {ColorDef}
        fill: 'white' // {ColorDef}
      }, options );

      // @public (read-only)
      this.values = values;
      this.stroke = options.stroke;
      this.fill = options.fill;
    }
  }

  return gasProperties.register( 'DataSet', DataSet );
} );