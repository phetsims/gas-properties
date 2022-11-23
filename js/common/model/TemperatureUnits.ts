// Copyright 2022, University of Colorado Boulder

//TODO https://github.com/phetsims/gas-properties/issues/202 change TemperatureUnits to string union
/**
 * Choice of temperature units that the thermometer can display
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import gasProperties from '../../gasProperties.js';

export default class TemperatureUnits extends EnumerationValue {

  public static readonly KELVIN = new TemperatureUnits();
  public static readonly CELSIUS = new TemperatureUnits();

  public static readonly enumeration = new Enumeration( TemperatureUnits );
}

gasProperties.register( 'TemperatureUnits', TemperatureUnits );