// Copyright 2019-2020, University of Colorado Boulder

/**
 * HoldConstant is an enumeration that identifies which quantity should be held constant when applying
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

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import gasProperties from '../../gasProperties.js';

const HoldConstant = Enumeration.byKeys( [
  'NOTHING',     // change N, T, or V => change P
  'VOLUME',      // change N or T => change P
  'TEMPERATURE', // change N or V => change P
  'PRESSURE_V',  // change N or T => change V
  'PRESSURE_T'   // change N or V => change T
] );

gasProperties.register( 'HoldConstant', HoldConstant );
export default HoldConstant;