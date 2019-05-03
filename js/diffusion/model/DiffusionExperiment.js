// Copyright 2019, University of Colorado Boulder

/**
 * Parameters that control the experiment in the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const NumberProperty = require( 'AXON/NumberProperty' );

  class DiffusionExperiment {

    constructor() {

      // @public quantity of each particle type
      this.numberOfParticles1Property = new NumberProperty( GasPropertiesConstants.NUMBER_OF_PARTICLES_RANGE.defaultValue, {
        range: GasPropertiesConstants.NUMBER_OF_PARTICLES_RANGE
      } );
      this.numberOfParticles2Property = new NumberProperty( GasPropertiesConstants.NUMBER_OF_PARTICLES_RANGE.defaultValue, {
        range: GasPropertiesConstants.NUMBER_OF_PARTICLES_RANGE
      } );

      // @public mass of each particle type
      this.mass1Property = new NumberProperty( GasPropertiesConstants.MASS_RANGE.defaultValue, {
        range: GasPropertiesConstants.MASS_RANGE,
        units: 'AMU'
      } );
      this.mass2Property = new NumberProperty( GasPropertiesConstants.MASS_RANGE.defaultValue, {
        range: GasPropertiesConstants.MASS_RANGE,
        units: 'AMU'
      } );

      // @public radius of each particle type
      this.radius1Property = new NumberProperty( GasPropertiesConstants.RADIUS_RANGE.defaultValue, {
        range: GasPropertiesConstants.RADIUS_RANGE,
        units: 'nm'
      } );
      this.radius2Property = new NumberProperty( GasPropertiesConstants.RADIUS_RANGE.defaultValue, {
        range: GasPropertiesConstants.RADIUS_RANGE,
        units: 'nm'
      } );

      // @public initial temperature for each particle type, used to compute initial velocity
      this.initialTemperature1Property = new NumberProperty( GasPropertiesConstants.INITIAL_TEMPERATURE_RANGE.defaultValue, {
        range: GasPropertiesConstants.INITIAL_TEMPERATURE_RANGE,
        units: 'K'
      } );
      this.initialTemperature2Property = new NumberProperty( GasPropertiesConstants.INITIAL_TEMPERATURE_RANGE.defaultValue, {
        range: GasPropertiesConstants.INITIAL_TEMPERATURE_RANGE,
        units: 'K'
      } );

      // @public (read-only) deltas for spinners
      this.numberOfParticlesDelta = 10;
      this.massDelta = 1; // AMU
      this.radiusDelta = 0.01; // nm
      this.initialTemperatureDelta = 50; // K
    }

    /**
     * Resets the experiment.
     * @public
     */
    reset() {
      this.numberOfParticles1Property.reset();
      this.numberOfParticles2Property.reset();
      this.mass1Property.reset();
      this.mass2Property.reset();
      this.radius1Property.reset();
      this.radius2Property.reset();
      this.initialTemperature1Property.reset();
      this.initialTemperature2Property.reset();
    }
  }

  return gasProperties.register( 'DiffusionExperiment', DiffusionExperiment );
} );