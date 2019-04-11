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
  const PlotType = require( 'GAS_PROPERTIES/energy/model/PlotType' );

  class DataSet {

    /**
     * @param {number[]} values
     * @param {PlotType} plotType
     * @param {ColorDef} color
     */
    constructor( values, plotType, color ) {

      assert && assert( PlotType.includes( plotType ), `invalid plotType: ${plotType}` );

      // @public (read-only)
      this.values = values;
      this.plotType = plotType;
      this.color = color;
    }
  }

  return gasProperties.register( 'DataSet', DataSet );
} );