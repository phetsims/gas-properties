// Copyright 2019-2020, University of Colorado Boulder

/**
 * PressureModel is a sub-model of IdealGasModel. It is responsible for the P (pressure) component of the
 * Ideal Gas Law (PV = NkT) and for the pressure gauge.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationDeprecatedProperty from '../../../../axon/js/EnumerationDeprecatedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';
import GasPropertiesQueryParameters from '../GasPropertiesQueryParameters.js';
import PressureGauge from './PressureGauge.js';

// maximum pressure in kPa, when exceeded the lid blows off of the container
const MAX_PRESSURE = GasPropertiesQueryParameters.maxPressure;

class PressureModel {

  /**
   * @param {EnumerationDeprecatedProperty} holdConstantProperty
   * @param {Property.<number>} numberOfParticlesProperty
   * @param {Property.<number>} volumeProperty
   * @param {Property.<number|null>} temperatureProperty
   * @param {function} blowLidOff
   * @param {Object} [options]
   */
  constructor( holdConstantProperty, numberOfParticlesProperty, volumeProperty, temperatureProperty, blowLidOff, options ) {
    assert && assert( holdConstantProperty instanceof EnumerationDeprecatedProperty,
      `invalid holdConstantProperty: ${holdConstantProperty}` );
    assert && assert( numberOfParticlesProperty instanceof Property,
      `invalid numberOfParticlesProperty: ${numberOfParticlesProperty}` );
    assert && assert( volumeProperty instanceof Property, `invalid volumeProperty: ${volumeProperty}` );
    assert && assert( temperatureProperty instanceof Property, `invalid temperatureProperty: ${temperatureProperty}` );
    assert && assert( typeof blowLidOff === 'function', `invalid blowLidOff: ${blowLidOff}` );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // @private
    this.holdConstantProperty = holdConstantProperty;
    this.numberOfParticlesProperty = numberOfParticlesProperty;
    this.volumeProperty = volumeProperty;
    this.temperatureProperty = temperatureProperty;
    this.blowLidOff = blowLidOff;

    // @public P, pressure in the container, in kPa
    this.pressureProperty = new NumberProperty( 0, {
      units: 'kPa',
      isValidValue: value => ( value >= 0 ),
      tandem: options.tandem.createTandem( 'pressureProperty' ),
      phetioReadOnly: true, // value is derived from state of particle system,
      phetioDocumentation: 'pressure in K, with no noise'
    } );

    // @public (read-only) gauge that display pressureProperty with a choice of units
    this.pressureGauge = new PressureGauge( this.pressureProperty, temperatureProperty, holdConstantProperty, {
      tandem: options.tandem.createTandem( 'pressureGauge' )
    } );

    // @private whether to update pressure
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

  /**
   * Resets this model.
   * @public
   */
  reset() {
    this.pressureProperty.reset();
    this.pressureGauge.reset();
    this.updatePressureEnabled = false;
  }

  /**
   * Updates this model.
   * @param {number} dtPressureGauge - time delta used to step the pressure gauge, in ps
   * @param {number} numberOfCollisions - number of collisions on the most recent time step
   * @public
   */
  update( dtPressureGauge, numberOfCollisions ) {

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
   * Computes pressure using the Ideal Gas Law, P = NkT/V
   * @returns {number} in kPa
   * @private
   */
  computePressure() {

    const N = this.numberOfParticlesProperty.value;
    const k = GasPropertiesConstants.BOLTZMANN; // (pm^2 * AMU)/(ps^2 * K)
    const T = this.temperatureProperty.value; // in K, assumes temperatureProperty has been updated
    assert && assert( typeof T === 'number' && T >= 0, `invalid temperature: ${T}` );
    const V = this.volumeProperty.value; // pm^3
    const P = ( N * k * T / V );

    // converted to kPa
    return P * GasPropertiesConstants.PRESSURE_CONVERSION_SCALE;
  }
}

gasProperties.register( 'PressureModel', PressureModel );
export default PressureModel;