// Copyright 2019-2022, University of Colorado Boulder

//TODO https://github.com/phetsims/gas-properties/issues/202 change HoldConstant to string union
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
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import gasProperties from '../../gasProperties.js';

export default class HoldConstant extends EnumerationValue {
  
  public static readonly NOTHING = new HoldConstant();     // change N, T, or V => change P
  public static readonly VOLUME = new HoldConstant();      // change N or T => change P
  public static readonly TEMPERATURE = new HoldConstant(); // change N or V => change P
  public static readonly PRESSURE_V = new HoldConstant();  // change N or T => change V
  public static readonly PRESSURE_T = new HoldConstant();  // change N or V => change T

  public static readonly enumeration = new Enumeration( HoldConstant );
}

gasProperties.register( 'HoldConstant', HoldConstant );