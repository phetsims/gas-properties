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

      // @public (read-only) deltas for spinners
      this.numberOfParticlesDelta = 10;
      this.massDelta = 1; // AMU
      this.radiusDelta = 5; // pm
      this.initialTemperatureDelta = 50; // K

      const numberOfParticlesOptions = {
        range: GasPropertiesConstants.NUMBER_OF_PARTICLES_RANGE,
        isValidValue: value => ( value % this.numberOfParticlesDelta === 0 )
      };

      // @public quantity of each particle type
      this.numberOfParticles1Property =
        new NumberProperty( GasPropertiesConstants.NUMBER_OF_PARTICLES_RANGE.defaultValue, numberOfParticlesOptions );
      this.numberOfParticles2Property =
        new NumberProperty( GasPropertiesConstants.NUMBER_OF_PARTICLES_RANGE.defaultValue, numberOfParticlesOptions );

      const massOptions = {
        range: GasPropertiesConstants.MASS_RANGE,
        units: 'AMU',
        isValidValue: value => ( value % this.massDelta === 0 )
      };

      // @public mass of each particle type
      this.mass1Property = new NumberProperty( GasPropertiesConstants.MASS_RANGE.defaultValue, massOptions );
      this.mass2Property = new NumberProperty( GasPropertiesConstants.MASS_RANGE.defaultValue, massOptions );

      const radiusOptions = {
        range: GasPropertiesConstants.RADIUS_RANGE,
        units: 'pm',
        isValidValue: value => ( value % this.radiusDelta === 0 )
      };

      // @public radius of each particle type
      this.radius1Property = new NumberProperty( GasPropertiesConstants.RADIUS_RANGE.defaultValue, radiusOptions );
      this.radius2Property = new NumberProperty( GasPropertiesConstants.RADIUS_RANGE.defaultValue, radiusOptions );

      const initialTemperatureOptions = {
        range: GasPropertiesConstants.INITIAL_TEMPERATURE_RANGE,
        units: 'K',
        isValidValue: value => ( value % this.initialTemperatureDelta === 0 )
      };

      // @public initial temperature for each particle type, used to compute initial velocity
      this.initialTemperature1Property =
        new NumberProperty( GasPropertiesConstants.INITIAL_TEMPERATURE_RANGE.defaultValue, initialTemperatureOptions );
      this.initialTemperature2Property =
        new NumberProperty( GasPropertiesConstants.INITIAL_TEMPERATURE_RANGE.defaultValue, initialTemperatureOptions );
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