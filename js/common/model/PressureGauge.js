// Copyright 2018-2019, University of Colorado Boulder

/**
 * Model of the pressure gauge. Responsible for determining what units will be used to present the pressure,
 * and for deriving pressure in those units. Optionally add a bit of jitter to the displayed values, to make
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
  const SAMPLE_PERIOD = 0.75; // ps
  const MAX_PRESSURE = GasPropertiesQueryParameters.maxPressure; // kPa
  const MIN_JITTER = 0; // minimum amount of jitter, in kPa
  const MAX_JITTER = 50; // maximum amount of jitter, in kPa
  assert && assert( MIN_JITTER < MAX_JITTER, 'MIN_JITTER must be < MAX_JITTER' );

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

      // @public pressure in kPa with jitter added. This is not derived from pressureProperty,
      // because it needs to jitter on step, not when pressureProperty changes.
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

      // @public pressure in atmospheres (atm) with jitter added
      this.pressureAtmospheresProperty = new DerivedProperty( [ this.pressureKilopascalsProperty ],
        pressureKilopascals => pressureKilopascals * GasPropertiesConstants.ATM_PER_KPA, {
          units: 'atm',
          valueType: 'number',
          isValidValue: value => ( value >= 0 )
        } );

      // @public (read-only) pressure range in kPa
      this.pressureRange = new Range( 0, MAX_PRESSURE );

      // @private amount of jitter in kPa is inversely proportional to pressure
      this.pressureJitterFunction = new LinearFunction( 0, this.pressureRange.max, MAX_JITTER, MIN_JITTER, true );

      // @private map from temperature (K) to jitter scale factor, so that jitter falls off at low temperatures
      this.scaleJitterFunction = new LinearFunction( 5, 50, 0, 1, true /* clamp */ );

      // @public pressure units displayed by the pressure gauge
      this.unitsProperty = new EnumerationProperty( PressureGauge.Units, PressureGauge.Units.ATMOSPHERES );

      // @private
      this.pressureProperty = pressureProperty;
      this.temperatureProperty = temperatureProperty;
      this.dtAccumulator = 0;
    }

    // @public
    reset() {
      this.unitsProperty.reset();
      this.dtAccumulator = 0;
    }

    /**
     * Steps the pressure gauge.
     * @param {number} dt - time step, in ps
     * @param {boolean} jitterEnabled - whether jitter should be added to make the gauge look more realistic
     * @public
     */
    step( dt, jitterEnabled ) {
      assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );
      assert && assert( typeof jitterEnabled === 'boolean', `invalid jitterEnabled: ${jitterEnabled}` );

      this.dtAccumulator += dt;

      if ( this.dtAccumulator >= SAMPLE_PERIOD ) {

        // Add jitter (kPa) to the displayed value, more jitter with lower pressure.
        // Jitter is added if we're not holding pressure constant.
        let jitter = 0;
        if ( jitterEnabled && GasPropertiesGlobalOptions.pressureNoiseProperty.value ) {
          jitter = this.pressureJitterFunction( this.pressureProperty.value ) *
                   this.scaleJitterFunction( this.temperatureProperty.value ) *
                   phet.joist.random.nextDouble();
        }

        // random sign
        const sign = ( jitter >= this.pressureProperty.value || phet.joist.random.nextBoolean() ) ? 1 : -1;

        this.pressureKilopascalsProperty.value = this.pressureProperty.value + ( sign * jitter );
        this.dtAccumulator = 0;
      }
    }
  }

  // @public Choice of pressure units that the gauge can display
  PressureGauge.Units = new Enumeration( [ 'KILOPASCALS', 'ATMOSPHERES' ] );

  return gasProperties.register( 'PressureGauge', PressureGauge );
} );
 