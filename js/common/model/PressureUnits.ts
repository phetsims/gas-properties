// Copyright 2022, University of Colorado Boulder

//TODO https://github.com/phetsims/gas-properties/issues/202 change PressureUnits to string union
/**
 * Choice of pressure units that the gauge can display
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import gasProperties from '../../gasProperties.js';

export default class PressureUnits extends EnumerationValue {

  public static readonly KILOPASCALS = new PressureUnits();
  public static readonly ATMOSPHERES = new PressureUnits();

  public static readonly enumeration = new Enumeration( PressureUnits );
}

gasProperties.register( 'PressureUnits', PressureUnits );