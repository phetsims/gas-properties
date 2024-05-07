// Copyright 2019-2024, University of Colorado Boulder

/**
 * PressureModel is a sub-model of IdealGasModel. It is responsible for the P (pressure) component of the
 * Ideal Gas Law (PV = NkT).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';
import GasPropertiesQueryParameters from '../GasPropertiesQueryParameters.js';
import { HoldConstant } from './HoldConstant.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Range from '../../../../dot/js/Range.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import { PressureUnits, PressureUnitsValues } from './PressureUnits.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import GasPropertiesPreferences from './GasPropertiesPreferences.js';
import dotRandom from '../../../../dot/js/dotRandom.js';

// Maximum pressure, in kPa. When exceeded, the lid blows off of the container.
const MAX_PRESSURE = GasPropertiesQueryParameters.maxPressure;

const MIN_NOISE = 0; // minimum amount of noise, in kPa
const MAX_NOISE = 50; // maximum amount of noise, in kPa
assert && assert( MIN_NOISE < MAX_NOISE, 'MIN_NOISE must be < MAX_NOISE' );

export default class PressureModel extends PhetioObject {

  // quantity to be held constant, influences noise
  private readonly holdConstantProperty: StringUnionProperty<HoldConstant>;

  private readonly numberOfParticlesProperty: TReadOnlyProperty<number>;
  private readonly volumeProperty: TReadOnlyProperty<number>;
  private readonly temperatureProperty: TReadOnlyProperty<number | null>;
  private readonly blowLidOff: () => void;

  // pressure range, in kPa
  public readonly pressureKilopascalsRange: Range;

  // P, pressure in the container, in kPa
  public readonly pressureKilopascalsProperty: Property<number>;

  // Pressure in kPa, with optional noise added, used exclusively by the view.
  public readonly pressureKilopascalsNoiseProperty: Property<number>;

  // Pressure in atmospheres (atm), with optional noise added, used exclusively by the view.
  public readonly pressureAtmospheresNoiseProperty: TReadOnlyProperty<number>;

  // amount of noise in kPa is inversely proportional to pressure, so more noise at lower pressure
  private readonly pressureNoiseFunction: LinearFunction;

  // map from temperature (K) to noise scale factor, so that noise falls off at low temperatures
  private readonly scaleNoiseFunction: LinearFunction;

  // pressure units displayed by the pressure gauge
  public readonly unitsProperty: StringUnionProperty<PressureUnits>;

  // Accumulates dt values when the model is stepped, so that we update the view at interval REFRESH_PERIOD.
  private readonly dtAccumulatorProperty: Property<number>;

  // whether to update pressure
  private updatePressureEnabled: boolean;

  // The display is refreshed at this interval, in ps
  public static readonly REFRESH_PERIOD = 0.75;

  public constructor( holdConstantProperty: StringUnionProperty<HoldConstant>,
                      numberOfParticlesProperty: TReadOnlyProperty<number>,
                      volumeProperty: TReadOnlyProperty<number>,
                      temperatureProperty: TReadOnlyProperty<number | null>,
                      blowLidOff: () => void,
                      tandem: Tandem ) {

    super( {
      isDisposable: false,
      tandem: tandem,
      phetioState: false
    } );

    this.holdConstantProperty = holdConstantProperty;
    this.numberOfParticlesProperty = numberOfParticlesProperty;
    this.volumeProperty = volumeProperty;
    this.temperatureProperty = temperatureProperty;
    this.blowLidOff = blowLidOff;

    this.pressureKilopascalsRange = new Range( 0, MAX_PRESSURE );

    this.pressureKilopascalsProperty = new NumberProperty( 0, {
      units: 'kPa',
      isValidValue: value => ( value >= 0 ),
      tandem: tandem.createTandem( 'pressureKilopascalsProperty' ),
      phetioReadOnly: true, // value is derived from state of particle system,
      phetioFeatured: true,
      phetioDocumentation: 'Pressure in kPa, with no noise.'
    } );

    // This is not derived from pressureKilopascalsProperty, because it needs to add noise on step, not when pressureKilopascalsProperty changes.
    this.pressureKilopascalsNoiseProperty = new NumberProperty( this.pressureKilopascalsProperty.value, {
      units: 'kPa',
      isValidValue: value => ( value >= 0 ),
      tandem: tandem.createTandem( 'pressureKilopascalsNoiseProperty' ),
      phetioReadOnly: true, // value is derived from pressureKilopascalsProperty on step, with noise added
      phetioFeatured: true,
      phetioDocumentation: 'Pressure in kPa, with optional noise added.'
    } );

    this.pressureAtmospheresNoiseProperty = new DerivedProperty( [ this.pressureKilopascalsNoiseProperty ],
      pressureKilopascals => pressureKilopascals * GasPropertiesConstants.ATM_PER_KPA, {
        units: 'atm',
        isValidValue: value => ( value >= 0 ),
        valueType: 'number',
        phetioValueType: NumberIO,
        tandem: tandem.createTandem( 'pressureAtmospheresNoiseProperty' ),
        phetioFeatured: true,
        phetioDocumentation: 'Pressure in atm, with optional noise added.'
      } );

    this.pressureNoiseFunction = new LinearFunction( 0, this.pressureKilopascalsRange.max, MAX_NOISE, MIN_NOISE, true );

    this.scaleNoiseFunction = new LinearFunction( 5, 50, 0, 1, true /* clamp */ );

    this.unitsProperty = new StringUnionProperty<PressureUnits>( 'atmospheres', {
      validValues: PressureUnitsValues,
      tandem: tandem.createTandem( 'unitsProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Units displayed by the pressure gauge.'
    } );

    this.dtAccumulatorProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'dtAccumulatorProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only.'
    } );

    this.updatePressureEnabled = false;

    // When pressure goes to zero, update the gauge immediately.
    this.pressureKilopascalsProperty.link( pressure => {
      if ( pressure === 0 ) {
        this.pressureKilopascalsNoiseProperty.value = 0;
      }
    } );

    // If the container is empty, set pressure to zero and disable pressure updates.
    // Updates will be enabled when 1 particle has collided with the container.
    this.numberOfParticlesProperty.link( numberOfParticles => {
      if ( numberOfParticles === 0 ) {
        this.pressureKilopascalsProperty.value = 0;
        this.updatePressureEnabled = false;
      }
    } );
  }

  public reset(): void {
    this.pressureKilopascalsProperty.reset();
    this.unitsProperty.reset();
    this.dtAccumulatorProperty.reset();
    this.updatePressureEnabled = false;
  }

  /**
   * Updates this model.
   * @param dtPressureGauge - time delta used to step the pressure gauge, in ps
   * @param numberOfCollisions - number of collisions on the most recent time step
   */
  public update( dtPressureGauge: number, numberOfCollisions: number ): void {

    // When adding particles to empty container, don't compute pressure until 1 particle has collided with container
    if ( !this.updatePressureEnabled && numberOfCollisions > 0 ) {
      this.updatePressureEnabled = true;
    }

    // Compute pressure
    if ( this.updatePressureEnabled ) {

      // Compute the actual pressure, based on the state of the particle system
      this.pressureKilopascalsProperty.value = this.computePressure();

      // Step regardless of whether pressure has changed, since the gauge updates on a sample period.
      this.step( dtPressureGauge );

      // If pressure exceeds the maximum, blow the lid off of the container.
      if ( this.pressureKilopascalsProperty.value > MAX_PRESSURE ) {
        this.blowLidOff();
      }
    }
  }

  /**
   * Steps the pressure model.
   * @param dt - time step, in ps
   */
  private step( dt: number ): void {
    assert && assert( dt > 0, `invalid dt: ${dt}` );

    this.dtAccumulatorProperty.value += dt;

    if ( this.dtAccumulatorProperty.value >= PressureModel.REFRESH_PERIOD ) {

      // Are we in a mode that holds pressure constant?
      const constantPressure = ( this.holdConstantProperty.value === 'pressureT' ||
                                 this.holdConstantProperty.value === 'pressureV' );

      // Disable noise when pressure is held constant, or via global options.
      const noiseEnabled = ( !constantPressure && GasPropertiesPreferences.pressureNoiseProperty.value );

      // Add noise (kPa) to the displayed value
      let noise = 0;
      if ( noiseEnabled ) {

        // compute noise
        noise = this.pressureNoiseFunction.evaluate( this.pressureKilopascalsProperty.value ) *
                this.scaleNoiseFunction.evaluate( this.temperatureProperty.value || 0 ) *
                dotRandom.nextDouble();

        // randomly apply a sign if doing so doesn't make the pressure become <= 0
        if ( noise < this.pressureKilopascalsProperty.value ) {
          noise *= ( dotRandom.nextBoolean() ? 1 : -1 );
        }
      }

      this.pressureKilopascalsNoiseProperty.value = this.pressureKilopascalsProperty.value + noise;
      this.dtAccumulatorProperty.value = 0;
    }
  }

  /**
   * Computes pressure in kPa, using the Ideal Gas Law, P = NkT/V
   */
  private computePressure(): number {

    const N = this.numberOfParticlesProperty.value;
    const k = GasPropertiesConstants.BOLTZMANN; // (pm^2 * AMU)/(ps^2 * K)
    const T = this.temperatureProperty.value || 0; // in K, assumes temperatureKelvinProperty has been updated
    const V = this.volumeProperty.value; // pm^3
    const P = ( N * k * T / V );

    // converted to kPa
    return P * GasPropertiesConstants.PRESSURE_CONVERSION_SCALE;
  }
}

gasProperties.register( 'PressureModel', PressureModel );