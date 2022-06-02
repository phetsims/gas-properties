// Copyright 2019-2020, University of Colorado Boulder

/**
 * TemperatureModel is a sub-model of IdealGasModel. It is responsible for the T (temperature) component of
 * the Ideal Gas Law (PV = NkT) and for the thermometer.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property, { AbstractProperty } from '../../../../axon/js/Property.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';
import Thermometer from './Thermometer.js';

// constants

// temperature used to compute the initial speed for particles, in K
const INITIAL_TEMPERATURE_RANGE = new RangeWithValue( 50, 1000, 300 );

class TemperatureModel {

  /**
   * @param {Property.<number>} numberOfParticlesProperty
   * @param {function:number} getAverageKineticEnergy
   * @param {Object} [options]
   */
  constructor( numberOfParticlesProperty, getAverageKineticEnergy, options ) {
    assert && assert( numberOfParticlesProperty instanceof AbstractProperty,
      `invalid numberOfParticlesProperty: ${numberOfParticlesProperty}` );
    assert && assert( typeof getAverageKineticEnergy === 'function',
      `invalid getAverageKineticEnergy: ${getAverageKineticEnergy}` );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // @private
    this.numberOfParticlesProperty = numberOfParticlesProperty;
    this.getAverageKineticEnergy = getAverageKineticEnergy;

    // @public {Property.<number|null>} T, temperature in the container, in K, null when the container is empty
    this.temperatureProperty = new Property( null, {
      units: 'K',
      isValidValue: value => ( value === null || ( typeof value === 'number' && value >= 0 ) ),
      phetioType: Property.PropertyIO( NullableIO( NumberIO ) ),
      tandem: options.tandem.createTandem( 'temperatureProperty' ),
      phetioReadOnly: true, // value is derived from state of particle system
      phetioDocumentation: 'temperature in K'
    } );

    // @public whether initial temperature is controlled by the user
    this.controlTemperatureEnabledProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'controlTemperatureEnabledProperty' ),
      phetioDocumentation: 'indicates whether initial temperature is controlled by the user'
    } );

    // @public initial temperature of particles added to the container, in K
    // Ignored if !controlTemperatureEnabledProperty.value
    this.initialTemperatureProperty = new NumberProperty( INITIAL_TEMPERATURE_RANGE.defaultValue, {
      range: INITIAL_TEMPERATURE_RANGE,
      units: 'K',
      tandem: options.tandem.createTandem( 'initialTemperatureProperty' ),
      phetioDocumentation: 'temperature used to determine the initial speed of particles when controlled by the user'
    } );

    // @public (read-only) thermometer that displays temperatureProperty with a choice of units
    this.thermometer = new Thermometer( this.temperatureProperty, {
      tandem: options.tandem.createTandem( 'thermometer' )
    } );
  }

  /**
   * Resets this model.
   * @public
   */
  reset() {
    this.temperatureProperty.reset();
    this.controlTemperatureEnabledProperty.reset();
    this.initialTemperatureProperty.reset();
    this.thermometer.reset();
  }

  /**
   * Updates the model to match the state of the system.
   * @public
   */
  update() {
    this.temperatureProperty.value = this.computeTemperature();
  }

  /**
   * Gets the temperature that will be used to compute initial velocity magnitude.
   * @returns {number} in K
   * @public
   */
  getInitialTemperature() {

    let initialTemperature = null;

    if ( this.controlTemperatureEnabledProperty.value ) {

      // User's setting
      initialTemperature = this.initialTemperatureProperty.value;
    }
    else if ( this.temperatureProperty.value !== null ) {

      // Current temperature in the container
      initialTemperature = this.temperatureProperty.value;
    }
    else {

      // Default for empty container
      initialTemperature = INITIAL_TEMPERATURE_RANGE.defaultValue;
    }

    assert && assert( typeof initialTemperature === 'number' && initialTemperature >= 0,
      `bad initialTemperature: ${initialTemperature}` );
    return initialTemperature;
  }

  /**
   * Computes the actual temperature, which is a measure of the kinetic energy of the particles in the container.
   * @returns {number|null} in K, null if the container is empty
   * @public
   */
  computeTemperature() {
    let temperature = null;
    const n = this.numberOfParticlesProperty.value;
    if ( n > 0 ) {
      const averageKineticEnergy = this.getAverageKineticEnergy(); // AMU * pm^2 / ps^2
      const k = GasPropertiesConstants.BOLTZMANN; // (pm^2 * AMU)/(ps^2 * K)

      // T = (2/3)KE/k
      temperature = ( 2 / 3 ) * averageKineticEnergy / k; // K
    }
    return temperature;
  }
}

gasProperties.register( 'TemperatureModel', TemperatureModel );
export default TemperatureModel;