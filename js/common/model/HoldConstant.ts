// Copyright 2019-2022, University of Colorado Boulder

/**
 * HoldConstant is string union that identifies which quantity should be held constant when applying
 * the Ideal Gas Law, PV = NkT, where:
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

export const HoldConstantValues = [
  'nothing',      // change N, T, or V => change P
  'volume',       // change N or T => change P
  'temperature',  // change N or V => change P
  'pressureV',    // change N or T => change V
  'pressureT'     // change N or V => change T
] as const;
export type HoldConstant = ( typeof HoldConstantValues )[number];