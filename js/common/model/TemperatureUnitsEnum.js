// Copyright 2018, University of Colorado Boulder

/**
 * Enumeration for temperature units.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );

  const TemperatureUnitsEnum = new Enumeration( [ 'KELVIN', 'CELSIUS' ] );

  return gasProperties.register( 'TemperatureUnitsEnum', TemperatureUnitsEnum );
} );