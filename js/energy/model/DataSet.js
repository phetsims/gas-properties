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
  const HistogramStyle = require( 'GAS_PROPERTIES/energy/model/HistogramStyle' );

  class DataSet {

    /**
     * @param {number[][]} valueArrays - one array for each sample, to avoid expensive Array.concat
     * @param {HistogramStyle} style
     * @param {ColorDef} color
     */
    constructor( valueArrays, style, color ) {
      assert && assert( Array.isArray( valueArrays ), `invalid valueArrays: ${valueArrays}` );
      assert && assert( HistogramStyle.includes( style ), `invalid style: ${style}` );
      assert && assert( ColorDef.isColorDef( color ), `invalid color: ${color}` );

      // @public
      this.valueArrays = valueArrays;

      // @public (read-only)
      this.style = style;
      this.color = color;
    }
  }

  return gasProperties.register( 'DataSet', DataSet );
} );