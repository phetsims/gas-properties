// Copyright 2019, University of Colorado Boulder

/**
 * An enumeration of which quantity should be held constant when applying the Ideal Gas Law, PV = NkT, where:
 *
 * P = pressure
 * V = volume
 * N = number of particles
 * T = temperature
 * k = Boltzmann constant
 *
 * This enumeration was named by consensus, see https://github.com/phetsims/gas-properties/issues/105
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );

  const HoldConstant = new Enumeration( [
    'NOTHING',     // change N, T, or V => change P
    'VOLUME',      // change N or T => change P
    'TEMPERATURE', // change N or V => change P
    'PRESSURE_T',  // change N or V => change T
    'PRESSURE_V'   // change N or T => change V
  ] );

  return gasProperties.register( 'HoldConstant', HoldConstant );
} );