// Copyright 2019, University of Colorado Boulder

/**
 * A data set is a set of values and the colors used to render them.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ColorDef = require( 'SCENERY/util/ColorDef' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const PlotType = require( 'GAS_PROPERTIES/energy/model/PlotType' );

  class DataSet {

    /**
     * @param {number[][]} valueArrays - one array for each sample, to avoid expensive Array.concat
     * @param {PlotType} plotType
     * @param {ColorDef} color
     */
    constructor( valueArrays, plotType, color ) {
      assert && assert( Array.isArray( valueArrays ), `invalid valueArrays: ${valueArrays}` );
      assert && assert( PlotType.includes( plotType ), `invalid plotType: ${plotType}` );
      assert && assert( ColorDef.isColorDef( color ), `invalid color: ${color}` );

      // @public
      this.valueArrays = valueArrays;

      // @public (read-only)
      this.plotType = plotType;
      this.color = color;
    }
  }

  return gasProperties.register( 'DataSet', DataSet );
} );