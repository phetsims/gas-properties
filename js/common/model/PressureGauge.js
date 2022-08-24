// Copyright 2018-2022, University of Colorado Boulder

/**
 * PressureGauge is the model of the pressure gauge. It is responsible for determining what units will be used to
 * present the pressure, and for deriving pressure in those units. Optionally adds a bit of noise to the displayed
 * values, to make the gauge look more realistic.
 *
 * NOTE: In #111 (code review), it was noted that this class has "a fair likelihood of being reused". If you do
 * reuse this class, you will need to add support for dispose.  It is not included here because instances of this
 * class persist for the lifetime of the sim, as noted in implementation-notes.md.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationDeprecatedProperty from '../../../../axon/js/EnumerationDeprecatedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import Range from '../../../../dot/js/Range.js';
import EnumerationDeprecated from '../../../../phet-core/js/EnumerationDeprecated.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';
import GasPropertiesGlobalOptions from './GasPropertiesGlobalOptions.js';
import GasPropertiesQueryParameters from '../GasPropertiesQueryParameters.js';
import HoldConstant from './HoldConstant.js';

// constants
const MAX_PRESSURE = GasPropertiesQueryParameters.maxPressure; // kPa
const MIN_NOISE = 0; // minimum amount of noise, in kPa
const MAX_NOISE = 50; // maximum amount of noise, in kPa
assert && assert( MIN_NOISE < MAX_NOISE, 'MIN_NOISE must be < MAX_NOISE' );

class PressureGauge {

  /**
   * @param {NumberProperty} pressureProperty - pressure in the container, in kPa
   * @param {Property.<number|null>} temperatureProperty - temperature in the container, in K, null if empty container
   * @param {EnumerationDeprecatedProperty} holdConstantProperty - quantity to be held constant, influences noise
   * @param {Object} [options]
   */
  constructor( pressureProperty, temperatureProperty, holdConstantProperty, options ) {
    assert && assert( pressureProperty instanceof NumberProperty,
      `invalid pressureProperty: ${pressureProperty}` );
    assert && assert( temperatureProperty instanceof Property,
      `invalid temperatureProperty: ${temperatureProperty}` );
    assert && assert( holdConstantProperty instanceof EnumerationDeprecatedProperty,
      `invalid holdConstantProperty: ${holdConstantProperty}` );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // @public pressure in kPa with noise added. This is not derived from pressureProperty,
    // because it needs to noise on step, not when pressureProperty changes.
    this.pressureKilopascalsProperty = new NumberProperty( pressureProperty.value, {
      units: 'kPa',
      isValidValue: value => ( value >= 0 ),
      tandem: options.tandem.createTandem( 'pressureKilopascalsProperty' ),
      phetioReadOnly: true, // value is derived from pressureProperty on step, with noise added
      phetioDocumentation: 'pressure in K, with optional noise added'
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
        isValidValue: value => ( value >= 0 ),
        valueType: 'number',
        phetioValueType: NumberIO,
        tandem: options.tandem.createTandem( 'pressureAtmospheresProperty' ),
        phetioDocumentation: 'pressure in atm, with optional noise added'
      } );

    // @public (read-only) pressure range in kPa
    this.pressureRange = new Range( 0, MAX_PRESSURE );

    // @private amount of noise in kPa is inversely proportional to pressure, so more noise at lower pressure
    this.pressureNoiseFunction = new LinearFunction( 0, this.pressureRange.max, MAX_NOISE, MIN_NOISE, true );

    // @private map from temperature (K) to noise scale factor, so that noise falls off at low temperatures
    this.scaleNoiseFunction = new LinearFunction( 5, 50, 0, 1, true /* clamp */ );

    // @public pressure units displayed by the pressure gauge
    this.unitsProperty = new EnumerationDeprecatedProperty( PressureGauge.Units, PressureGauge.Units.ATMOSPHERES, {
      tandem: options.tandem.createTandem( 'unitsProperty' ),
      phetioDocumentation: 'units displayed by the pressure gauge'
    } );

    // @private
    this.pressureProperty = pressureProperty;
    this.temperatureProperty = temperatureProperty;
    this.holdConstantProperty = holdConstantProperty;
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
   * @public
   */
  step( dt ) {
    assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );

    this.dtAccumulator += dt;

    if ( this.dtAccumulator >= PressureGauge.REFRESH_PERIOD ) {

      // Are we in a mode that holds pressure constant?
      const constantPressure = ( this.holdConstantProperty.value === HoldConstant.PRESSURE_T ||
                                 this.holdConstantProperty.value === HoldConstant.PRESSURE_V );

      // Disable noise when pressure is held constant, or via global options.
      const noiseEnabled = ( !constantPressure && GasPropertiesGlobalOptions.pressureNoiseProperty.value );

      // Add noise (kPa) to the displayed value
      let noise = 0;
      if ( noiseEnabled ) {

        // compute noise
        noise = this.pressureNoiseFunction.evaluate( this.pressureProperty.value ) *
                this.scaleNoiseFunction.evaluate( this.temperatureProperty.value ) *
                dotRandom.nextDouble();

        // randomly apply a sign if doing so doesn't make the pressure become <= 0
        if ( noise < this.pressureProperty.value ) {
          noise *= ( dotRandom.nextBoolean() ? 1 : -1 );
        }
      }

      this.pressureKilopascalsProperty.value = this.pressureProperty.value + noise;
      this.dtAccumulator = 0;
    }
  }
}

// @public The display is refreshed at this interval, in ps
PressureGauge.REFRESH_PERIOD = 0.75;

// @public Choice of pressure units that the gauge can display
PressureGauge.Units = EnumerationDeprecated.byKeys( [ 'KILOPASCALS', 'ATMOSPHERES' ] );

gasProperties.register( 'PressureGauge', PressureGauge );
export default PressureGauge;