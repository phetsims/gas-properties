// Copyright 2019, University of Colorado Boulder

/**
 * Settings that initialize one side of the container in the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const NumberProperty = require( 'AXON/NumberProperty' );

  // constants
  // values must be a multiple of these deltas
  const DELTAS = {
    numberOfParticles: 10,
    mass: 1, // AMU
    radius: 5, // pm
    initialTemperature: 50 // K
  };

  class DiffusionSettings {

    constructor() {

      // @public
      this.numberOfParticlesProperty =
        new NumberProperty( GasPropertiesConstants.NUMBER_OF_PARTICLES_RANGE.defaultValue, {
          numberType: 'Integer',
          range: GasPropertiesConstants.NUMBER_OF_PARTICLES_RANGE,
          isValidValue: value => ( value % DELTAS.numberOfParticles === 0 )
        } );

      // @public mass, in AMU
      this.massProperty = new NumberProperty( GasPropertiesConstants.MASS_RANGE.defaultValue, {
        numberType: 'Integer',
        range: GasPropertiesConstants.MASS_RANGE,
        units: 'AMU',
        isValidValue: value => ( value % DELTAS.mass === 0 )
      } );

      // @public radius, in pm
      this.radiusProperty = new NumberProperty( GasPropertiesConstants.RADIUS_RANGE.defaultValue, {
        numberType: 'Integer',
        range: GasPropertiesConstants.RADIUS_RANGE,
        units: 'pm',
        isValidValue: value => ( value % DELTAS.radius === 0 )
      } );

      // @public initial temperature, in K, used to compute initial velocity
      this.initialTemperatureProperty =
        new NumberProperty( GasPropertiesConstants.INITIAL_TEMPERATURE_RANGE.defaultValue, {
          numberType: 'Integer',
          range: GasPropertiesConstants.INITIAL_TEMPERATURE_RANGE,
          units: 'K',
          isValidValue: value => ( value % DELTAS.initialTemperature === 0 )
        } );
    }

    /**
     * Resets the settings.
     * @public
     */
    reset() {
      this.numberOfParticlesProperty.reset();
      this.massProperty.reset();
      this.radiusProperty.reset();
      this.initialTemperatureProperty.reset();
    }

    /**
     * Restarts an experiment with the same settings.
     * This causes the current set of particles to be deleted, and a new set of particles to be created.
     * @public
     */
    restart() {
      const numberOfParticles = this.numberOfParticlesProperty.value;
      this.numberOfParticlesProperty.value = 0;
      this.numberOfParticlesProperty.value = numberOfParticles;
    }
  }

  // @public (read-only) values must be a multiple of these deltas
  DiffusionSettings.DELTAS = DELTAS;


  return gasProperties.register( 'DiffusionSettings', DiffusionSettings );
} );