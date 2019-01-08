// Copyright 2018, University of Colorado Boulder

//TODO should this Enumeration be a static field of some class?
/**
 * Enumeration for which quantity to hold constant.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );

  const HoldConstantEnum = new Enumeration( [
      'NOTHING',
      'VOLUME',
      'TEMPERATURE',
      'PRESSURE_T', // change temperature (T) to maintain constant pressure
      'PRESSURE_V' // change volume (V) to maintain constant pressure
    ]
  );

  return gasProperties.register( 'HoldConstantEnum', HoldConstantEnum );
} );