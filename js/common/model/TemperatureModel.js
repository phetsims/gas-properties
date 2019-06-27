// Copyright 2019, University of Colorado Boulder

/**
 * TemperatureModel is a sub-model of GasPropertiesModel. It is responsible for the T (temperature) component of
 * the Ideal Gas Law (PV = NkT) and for the thermometer.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
  const RangeWithValue = require( 'DOT/RangeWithValue' );
  const Thermometer = require( 'GAS_PROPERTIES/common/model/Thermometer' );

  // constants

  // temperature used to compute the initial speed for particles, in K
  const INITIAL_TEMPERATURE_RANGE = new RangeWithValue( 50, 1000, 300 );

  class TemperatureModel {

    /**
     * @param {Property.<number>} numberOfParticlesProperty
     * @param {function:number} getAverageKineticEnergy
     */
    constructor( numberOfParticlesProperty, getAverageKineticEnergy ) {
      assert && assert( numberOfParticlesProperty instanceof Property,
        `invalid numberOfParticlesProperty: ${numberOfParticlesProperty}` );
      assert && assert( typeof getAverageKineticEnergy === 'function',
        `invalid getAverageKineticEnergy: ${getAverageKineticEnergy}` );

      // @private
      this.numberOfParticlesProperty = numberOfParticlesProperty;
      this.getAverageKineticEnergy = getAverageKineticEnergy;

      // @public {Property.<number|null>} T, temperature in the container, in K, null when the container is empty
      this.temperatureProperty = new Property( null, {
        isValidValue: value => ( value === null || ( typeof value === 'number' && value >= 0 ) ),
        units: 'K'
      } );

      // @public whether initial temperature is controlled by the user
      this.controlTemperatureEnabledProperty = new BooleanProperty( false );

      // @public initial temperature of particles added to the container, in K
      // Ignored if !controlTemperatureEnabledProperty.value
      this.initialTemperatureProperty = new NumberProperty( INITIAL_TEMPERATURE_RANGE.defaultValue, {
        range: INITIAL_TEMPERATURE_RANGE,
        units: 'K'
      } );

      // @public (read-only) thermometer that displays temperatureProperty with a choice of units
      this.thermometer = new Thermometer( this.temperatureProperty );
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

  return gasProperties.register( 'TemperatureModel', TemperatureModel );
} );