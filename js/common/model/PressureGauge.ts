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
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import Range from '../../../../dot/js/Range.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';
import GasPropertiesQueryParameters from '../GasPropertiesQueryParameters.js';
import GasPropertiesPreferences from './GasPropertiesPreferences.js';
import { HoldConstant } from './HoldConstant.js';
import { PressureUnits, PressureUnitsValues } from './PressureUnits.js';

// constants
const MAX_PRESSURE = GasPropertiesQueryParameters.maxPressure; // kPa
const MIN_NOISE = 0; // minimum amount of noise, in kPa
const MAX_NOISE = 50; // maximum amount of noise, in kPa
assert && assert( MIN_NOISE < MAX_NOISE, 'MIN_NOISE must be < MAX_NOISE' );

export default class PressureGauge {

  // pressure in the container, in kPa
  private readonly pressureProperty: TReadOnlyProperty<number>;

  // temperature in the container, in K, null if empty container
  private readonly temperatureProperty: TReadOnlyProperty<number | null>;

  // quantity to be held constant, influences noise
  private readonly holdConstantProperty: StringUnionProperty<HoldConstant>;

  // pressure in kPa, with noise added
  public readonly pressureKilopascalsProperty: Property<number>;

  // pressure in atmospheres (atm), with noise added
  public readonly pressureAtmospheresProperty: TReadOnlyProperty<number>;

  // pressure range in kPa
  public readonly pressureRange: Range;

  // amount of noise in kPa is inversely proportional to pressure, so more noise at lower pressure
  private readonly pressureNoiseFunction: LinearFunction;

  // map from temperature (K) to noise scale factor, so that noise falls off at low temperatures
  private readonly scaleNoiseFunction: LinearFunction;

  // pressure units displayed by the pressure gauge
  public readonly unitsProperty: StringUnionProperty<PressureUnits>;

  private dtAccumulator: number;

  // The display is refreshed at this interval, in ps
  public static readonly REFRESH_PERIOD = 0.75;

  public constructor( pressureProperty: TReadOnlyProperty<number>,
                      temperatureProperty: TReadOnlyProperty<number | null>,
                      holdConstantProperty: StringUnionProperty<HoldConstant>,
                      tandem: Tandem ) {

    this.pressureProperty = pressureProperty;
    this.temperatureProperty = temperatureProperty;
    this.holdConstantProperty = holdConstantProperty;

    // This is not derived from pressureProperty, because it needs to add noise on step, not when pressureProperty changes.
    this.pressureKilopascalsProperty = new NumberProperty( pressureProperty.value, {
      units: 'kPa',
      isValidValue: value => ( value >= 0 ),
      tandem: tandem.createTandem( 'pressureKilopascalsProperty' ),
      phetioReadOnly: true, // value is derived from pressureProperty on step, with noise added
      phetioDocumentation: 'pressure in K, with optional noise added'
    } );

    // When pressure goes to zero, update the gauge immediately.
    pressureProperty.link( pressure => {
      if ( pressure === 0 ) {
        this.pressureKilopascalsProperty.value = 0;
      }
    } );

    this.pressureAtmospheresProperty = new DerivedProperty( [ this.pressureKilopascalsProperty ],
      pressureKilopascals => pressureKilopascals * GasPropertiesConstants.ATM_PER_KPA, {
        units: 'atm',
        isValidValue: value => ( value >= 0 ),
        valueType: 'number',
        phetioValueType: NumberIO,
        tandem: tandem.createTandem( 'pressureAtmospheresProperty' ),
        phetioDocumentation: 'pressure in atm, with optional noise added'
      } );

    this.pressureRange = new Range( 0, MAX_PRESSURE );

    this.pressureNoiseFunction = new LinearFunction( 0, this.pressureRange.max, MAX_NOISE, MIN_NOISE, true );

    this.scaleNoiseFunction = new LinearFunction( 5, 50, 0, 1, true /* clamp */ );

    this.unitsProperty = new StringUnionProperty<PressureUnits>( 'atmospheres', {
      validValues: PressureUnitsValues,
      tandem: tandem.createTandem( 'unitsProperty' ),
      phetioDocumentation: 'units displayed by the pressure gauge'
    } );

    this.dtAccumulator = 0;
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  public reset(): void {
    this.unitsProperty.reset();
    this.dtAccumulator = 0;
  }

  /**
   * Steps the pressure gauge.
   * @param dt - time step, in ps
   */
  public step( dt: number ): void {
    assert && assert( dt > 0, `invalid dt: ${dt}` );

    this.dtAccumulator += dt;

    if ( this.dtAccumulator >= PressureGauge.REFRESH_PERIOD ) {

      // Are we in a mode that holds pressure constant?
      const constantPressure = ( this.holdConstantProperty.value === 'pressureT' ||
                                 this.holdConstantProperty.value === 'pressureV' );

      // Disable noise when pressure is held constant, or via global options.
      const noiseEnabled = ( !constantPressure && GasPropertiesPreferences.pressureNoiseProperty.value );

      // Add noise (kPa) to the displayed value
      let noise = 0;
      if ( noiseEnabled ) {

        // compute noise
        noise = this.pressureNoiseFunction.evaluate( this.pressureProperty.value ) *
                this.scaleNoiseFunction.evaluate( this.temperatureProperty.value || 0 ) *
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

gasProperties.register( 'PressureGauge', PressureGauge );