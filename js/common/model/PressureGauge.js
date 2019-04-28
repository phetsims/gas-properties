// Copyright 2018-2019, University of Colorado Boulder

/**
 * Model of the pressure gauge.  Adds a bit of jitter to make the gauge look more realistic.
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
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );

  class PressureGauge {

    /**
     * @param {Property.<number|null>} pressureKilopascalsProperty - pressure in the container, in kPa
     * @param {NumberProperty} totalParticlesProperty - total number of particles in the container
     * @param {number} maxParticles - maximum number of particles in the container
     */
    constructor( pressureKilopascalsProperty, totalParticlesProperty, maxParticles ) {

      // @public pressure in kilopascals (kPa) with jitter added
      this.pressureKilopascalsProperty = new DerivedProperty( [ pressureKilopascalsProperty, totalParticlesProperty ],
        ( pressureKilopascals, totalParticles ) => {
          if ( totalParticles === 0 ) {
            return pressureKilopascals;
          }
          else {
            return pressureKilopascals; //TODO #50 add jitter here, more jitter with fewer particles
          }
        } );

      // @public pressure in atmospheres (atm) with jitter added
      this.pressureAtmospheresProperty = new DerivedProperty( [ this.pressureKilopascalsProperty ],
        pressureKilopascals => pressureKilopascals * GasPropertiesConstants.ATM_PER_KPA, {
          units: 'atm'
        } );

      // @public (read-only) pressure range in kilopascals (kPa)
      this.pressureRange = new Range( 0, GasPropertiesQueryParameters.maxPressure );

      // @public {Property.<PressureGauge.Units>} pressure units displayed by the pressure gauge
      this.unitsProperty = new Property( PressureGauge.Units.KILOPASCALS, {
        isValidValue: value => PressureGauge.Units.includes( value )
      } );
    }

    // @public
    reset() {
      this.unitsProperty.reset();
    }
  }

  // @public Choice of pressure units that the gauge can display
  PressureGauge.Units = new Enumeration( [ 'KILOPASCALS', 'ATMOSPHERES' ] );

  return gasProperties.register( 'PressureGauge', PressureGauge );
} );
 