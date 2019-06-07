// Copyright 2018-2019, University of Colorado Boulder

/**
 * Model of the pressure gauge. Responsible for determining what units will be used to present the pressure,
 * and for deriving pressure in those units. Optionally add a bit of noise to the displayed values, to make
 * the gauge look more realistic.
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
  const GasPropertiesGlobalOptions = require( 'GAS_PROPERTIES/common/GasPropertiesGlobalOptions' );
  const LinearFunction = require( 'DOT/LinearFunction' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );

  // constants
  const MAX_PRESSURE = GasPropertiesQueryParameters.maxPressure; // kPa
  const MIN_NOISE = 0; // minimum amount of noise, in kPa
  const MAX_NOISE = 50; // maximum amount of noise, in kPa
  assert && assert( MIN_NOISE < MAX_NOISE, 'MIN_NOISE must be < MAX_NOISE' );

  class PressureGauge {

    /**
     * @param {NumberProperty} pressureProperty - pressure in the container, in kPa
     * @param {Property.<number|null>} temperatureProperty - temperature in the container, in K, null if empty container
     */
    constructor( pressureProperty, temperatureProperty ) {
      assert && assert( pressureProperty instanceof NumberProperty,
        `invalid pressureProperty: ${pressureProperty}` );
      assert && assert( temperatureProperty instanceof Property,
        `invalid temperatureProperty: ${temperatureProperty}` );

      // @public pressure in kPa with noise added. This is not derived from pressureProperty,
      // because it needs to noise on step, not when pressureProperty changes.
      this.pressureKilopascalsProperty = new NumberProperty( pressureProperty.value, {
        units: 'kPa',
        isValidValue: value => ( value >= 0 )
      } );

      // When pressure goes to zero, update the gauge immediately.
      pressureProperty.link( pressure => {
        if ( pressure === 0 ) {
          this.pressureKilopascalsProperty.value = 0;
        }
      } );

      // @public pressure in atmospheres (atm) with noise added
      this.pressureAtmospheresProperty = new DerivedProperty( [ this.pressureKilopascalsProperty ],
        pressureKilopascals => pressureKilopascals * GasPropertiesConstants.ATM_PER_KPA, {
          units: 'atm',
          valueType: 'number',
          isValidValue: value => ( value >= 0 )
        } );

      // @public (read-only) pressure range in kPa
      this.pressureRange = new Range( 0, MAX_PRESSURE );

      // @private amount of noise in kPa is inversely proportional to pressure
      this.pressureNoiseFunction = new LinearFunction( 0, this.pressureRange.max, MAX_NOISE, MIN_NOISE, true );

      // @private map from temperature (K) to noise scale factor, so that noise falls off at low temperatures
      this.scaleNoiseFunction = new LinearFunction( 5, 50, 0, 1, true /* clamp */ );

      // @public pressure units displayed by the pressure gauge
      this.unitsProperty = new EnumerationProperty( PressureGauge.Units, PressureGauge.Units.ATMOSPHERES );

      // @private
      this.pressureProperty = pressureProperty;
      this.temperatureProperty = temperatureProperty;
      this.dtAccumulator = 0;
    }

    /**
     * Resets the pressure gauge.
     * @public
     */
    reset() {
      this.unitsProperty.reset();
      this.dtAccumulator = 0;
    }

    /**
     * Steps the pressure gauge.
     * @param {number} dt - time step, in ps
     * @param {boolean} noiseEnabled - whether noise should be added to make the gauge look more realistic
     * @public
     */
    step( dt, noiseEnabled ) {
      assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );
      assert && assert( typeof noiseEnabled === 'boolean', `invalid noiseEnabled: ${noiseEnabled}` );

      this.dtAccumulator += dt;

      if ( this.dtAccumulator >= PressureGauge.REFRESH_PERIOD ) {

        // Add noise (kPa) to the displayed value, more noise with lower pressure.
        // Noise is added if we're not holding pressure constant.
        let noise = 0;
        if ( noiseEnabled && GasPropertiesGlobalOptions.pressureNoiseProperty.value ) {
          noise = this.pressureNoiseFunction( this.pressureProperty.value ) *
                   this.scaleNoiseFunction( this.temperatureProperty.value ) *
                   phet.joist.random.nextDouble();
        }

        // random sign
        const sign = ( noise >= this.pressureProperty.value || phet.joist.random.nextBoolean() ) ? 1 : -1;

        this.pressureKilopascalsProperty.value = this.pressureProperty.value + ( sign * noise );
        this.dtAccumulator = 0;
      }
    }
  }

  // @public The display is refreshed at this interval, in ps
  PressureGauge.REFRESH_PERIOD = 0.75;

  // @public Choice of pressure units that the gauge can display
  PressureGauge.Units = new Enumeration( [ 'KILOPASCALS', 'ATMOSPHERES' ] );

  return gasProperties.register( 'PressureGauge', PressureGauge );
} );
 