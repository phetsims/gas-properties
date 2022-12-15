// Copyright 2019-2022, University of Colorado Boulder

/**
 * PressureModel is a sub-model of IdealGasModel. It is responsible for the P (pressure) component of the
 * Ideal Gas Law (PV = NkT) and for the pressure gauge.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';
import GasPropertiesQueryParameters from '../GasPropertiesQueryParameters.js';
import PressureGauge from './PressureGauge.js';
import { HoldConstant } from './HoldConstant.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';

// Maximum pressure, in kPa. When exceeded, the lid blows off of the container.
const MAX_PRESSURE = GasPropertiesQueryParameters.maxPressure;

export default class PressureModel {

  private readonly holdConstantProperty: StringUnionProperty<HoldConstant>;
  private readonly numberOfParticlesProperty: TReadOnlyProperty<number>;
  private readonly volumeProperty: TReadOnlyProperty<number>;
  private readonly temperatureProperty: TReadOnlyProperty<number | null>;
  private readonly blowLidOff: () => void;

  // P, pressure in the container, in kPa
  public readonly pressureProperty: Property<number>;

  // gauge that display pressureProperty with a choice of units
  public readonly pressureGauge: PressureGauge;

  // whether to update pressure
  private updatePressureEnabled: boolean;

  public constructor( holdConstantProperty: StringUnionProperty<HoldConstant>,
                      numberOfParticlesProperty: TReadOnlyProperty<number>,
                      volumeProperty: TReadOnlyProperty<number>,
                      temperatureProperty: TReadOnlyProperty<number | null>,
                      blowLidOff: () => void,
                      tandem: Tandem ) {

    this.holdConstantProperty = holdConstantProperty;
    this.numberOfParticlesProperty = numberOfParticlesProperty;
    this.volumeProperty = volumeProperty;
    this.temperatureProperty = temperatureProperty;
    this.blowLidOff = blowLidOff;

    this.pressureProperty = new NumberProperty( 0, {
      units: 'kPa',
      isValidValue: value => ( value >= 0 ),
      tandem: tandem.createTandem( 'pressureProperty' ),
      phetioReadOnly: true, // value is derived from state of particle system,
      phetioDocumentation: 'pressure in K, with no noise'
    } );

    this.pressureGauge = new PressureGauge( this.pressureProperty, temperatureProperty, holdConstantProperty,
      tandem.createTandem( 'pressureGauge' ) );

    this.updatePressureEnabled = false;

    // If the container is empty, set pressure to zero and disable pressure updates.
    // Updates will be enabled when 1 particle has collided with the container.
    this.numberOfParticlesProperty.link( numberOfParticles => {
      if ( numberOfParticles === 0 ) {
        this.pressureProperty.value = 0;
        this.updatePressureEnabled = false;
      }
    } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  public reset(): void {
    this.pressureProperty.reset();
    this.pressureGauge.reset();
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
      this.pressureProperty.value = this.computePressure();

      // Step the gauge regardless of whether pressure has changed, since the gauge updates on a sample period.
      this.pressureGauge.step( dtPressureGauge );

      // If pressure exceeds the maximum, blow the lid off of the container.
      if ( this.pressureProperty.value > MAX_PRESSURE ) {
        this.blowLidOff();
      }
    }
  }

  /**
   * Computes pressure in kPa, using the Ideal Gas Law, P = NkT/V
   */
  private computePressure(): number {

    const N = this.numberOfParticlesProperty.value;
    const k = GasPropertiesConstants.BOLTZMANN; // (pm^2 * AMU)/(ps^2 * K)
    const T = this.temperatureProperty.value || 0; // in K, assumes temperatureProperty has been updated
    const V = this.volumeProperty.value; // pm^3
    const P = ( N * k * T / V );

    // converted to kPa
    return P * GasPropertiesConstants.PRESSURE_CONVERSION_SCALE;
  }
}

gasProperties.register( 'PressureModel', PressureModel );