// Copyright 2019, University of Colorado Boulder

/**
 * Method used to plot a DataSet.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );

  const PlotType = new Enumeration( [ 'BARS', 'LINES' ] );

  return gasProperties.register( 'PlotType', PlotType );
} );