// Copyright 2018-2019, University of Colorado Boulder

/**
 * The timescale used to map realtime (seconds) to sim time (picoseconds).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const Enumeration = require( 'PHET_CORE/Enumeration' );

  const Timescale = new Enumeration( [ 'NORMAL', 'SLOW' ] );

  return gasProperties.register( 'Timescale', Timescale );
} );