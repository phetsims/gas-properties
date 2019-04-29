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
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Range = require( 'DOT/Range' );

  // constants
  const SAMPLE_PERIOD = 0.25; // ps
  const MAX_JITTER = 50; // maximum amount of jitter that will be added, in kPa

  class PressureGauge {

    /**
     * @param {Property.<number|null>} pressureProperty - pressure in the container, in kPa
     * @param {NumberProperty} totalParticlesProperty - total number of particles in the container
     * @param {number} maxParticles - maximum number of particles in the container
     */
    constructor( pressureProperty, totalParticlesProperty, maxParticles ) {

      // @public pressure in kilopascals (kPa) with jitter added
      this.pressureKilopascalsProperty = new NumberProperty( pressureProperty.value, {
        units: 'kPa',
        isValidValue: value => value >= 0
      } );

      // @public pressure in atmospheres (atm) with jitter added
      this.pressureAtmospheresProperty = new DerivedProperty( [ this.pressureKilopascalsProperty ],
        pressureKilopascals => pressureKilopascals * GasPropertiesConstants.ATM_PER_KPA, {
          units: 'atm',
          isValidValue: value => value >= 0
        } );

      // @public (read-only) pressure range in kilopascals (kPa)
      this.pressureRange = new Range( 0, GasPropertiesQueryParameters.maxPressure );

      // @public pressure units displayed by the pressure gauge
      this.unitsProperty = new EnumerationProperty( PressureGauge.Units, PressureGauge.Units.KILOPASCALS );

      // @private
      this.pressureProperty = pressureProperty;
      this.totalParticlesProperty = totalParticlesProperty;
      this.maxParticles = maxParticles;
      this.dtAccumulator = 0;
    }

    // @public
    reset() {
      this.unitsProperty.reset();
    }

    /**
     * @param {number} dt - time step, in ps
     * @public
     */
    step( dt ) {

      this.dtAccumulator += dt;

      if ( this.dtAccumulator >= SAMPLE_PERIOD ) {

        // Add jitter to the displayed value, more jitter with fewer particles
        if ( this.totalParticlesProperty.value !== 0 ) {

          const delta = MAX_JITTER * ( 1 - ( this.totalParticlesProperty.value / this.maxParticles ) );

          let sign = phet.joist.random.nextBoolean() ? 1 : -1;
          if ( delta >= this.pressureProperty.value ) {
            sign = 1;
          }

          this.pressureKilopascalsProperty.value = this.pressureProperty.value + ( sign * delta );
          this.dtAccumulator = 0;
        }
      }
    }
  }

  // @public Choice of pressure units that the gauge can display
  PressureGauge.Units = new Enumeration( [ 'KILOPASCALS', 'ATMOSPHERES' ] );

  return gasProperties.register( 'PressureGauge', PressureGauge );
} );
 