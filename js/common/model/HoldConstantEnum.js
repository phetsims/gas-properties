// Copyright 2019, University of Colorado Boulder

/**
 * Indicates which quantity to hold constant in the Ideal Gas Law equation, PV = NkT, where:
 *
 * P = pressure
 * V = volume
 * N = number of particles
 * T = temperature
 * k = Boltzmann constant
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );

  const HoldConstantEnum = new Enumeration( [
    'NOTHING',     // change N, T, or V => change P
    'VOLUME',      // change N or T => change P
    'TEMPERATURE', // change N or V => change P
    'PRESSURE_T',  // change N or V => change T
    'PRESSURE_V'   // change N or T => change V
  ] );

  return gasProperties.register( 'HoldConstantEnum', HoldConstantEnum );
} );