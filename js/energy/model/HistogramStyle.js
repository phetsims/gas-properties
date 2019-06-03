// Copyright 2018-2019, University of Colorado Boulder

/**
 * Style used to plot a histogram.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );

  const HistogramStyle = new Enumeration( [ 'BARS', 'LINE_SEGMENTS' ] );

  return gasProperties.register( 'HistogramStyle', HistogramStyle );
} );