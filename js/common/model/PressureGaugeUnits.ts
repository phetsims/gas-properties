// Copyright 2022, University of Colorado Boulder

//TODO https://github.com/phetsims/gas-properties/issues/202 change PressureGaugeUnits to string union
/**
 * Choice of pressure units that the gauge can display
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import gasProperties from '../../gasProperties.js';

export default class PressureGaugeUnits extends EnumerationValue {

  public static readonly KILOPASCALS = new PressureGaugeUnits();
  public static readonly ATMOSPHERES = new PressureGaugeUnits();

  public static readonly enumeration = new Enumeration( PressureGaugeUnits );
}

gasProperties.register( 'PressureGaugeUnits', PressureGaugeUnits );