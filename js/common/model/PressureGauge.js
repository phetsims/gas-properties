// Copyright 2018-2019, University of Colorado Boulder

/**
 * Model of the pressure gauge
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );

  class PressureGauge {

    constructor() {

      // @public pressure in kilopascals (kPa)
      this.pressureKilopascalsProperty = new NumberProperty( 0, {
        isValidValue: value => ( value >= 0 ),
        units: 'kilopascals'
      } );

      // @public pressure in atmospheres (atm)
      this.pressureAtmospheresProperty = new DerivedProperty( [ this.pressureKilopascalsProperty ],
        pressureKilopascals => pressureKilopascals * GasPropertiesConstants.ATM_PER_KPA, {
        units: 'atmospheres'
        } );

      // @public (read-only) pressure range in kilopascals (kPa)
      this.pressureRange = new Range( 0, 1000 ); //TODO values

      // @public {Property.<PressureGauge.Units>} pressure units displayed by the pressure gauge
      this.unitsProperty = new Property( PressureGauge.Units.KILOPASCALS, {
        isValidValue: value => PressureGauge.Units.includes( value )
      } );
    }

    // @public
    reset() {
      this.pressureKilopascalsProperty.reset();
      this.unitsProperty.reset();
    }
  }

  // @public Choice of pressure units that the gauge can display
  PressureGauge.Units = new Enumeration( [ 'KILOPASCALS', 'ATMOSPHERES' ] );

  return gasProperties.register( 'PressureGauge', PressureGauge );
} );
 