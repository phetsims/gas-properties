// Copyright 2019, University of Colorado Boulder

/**
 * Values shown in the 'Data' accordion box in the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );

  // constants
  const NUMBER_OF_PARTICLES_OPTIONS = { numberType: 'Integer' };
  const AVERAGE_TEMPERATURE_OPTIONS = {
    isValidValue: value => ( value === null || typeof value === 'number' ),
    units: 'K'
  };

  class DiffusionData {

    constructor() {

      // @public (read-only) Data for the left half of the container
      this.leftNumberOfParticles1Property = new NumberProperty( 0, NUMBER_OF_PARTICLES_OPTIONS );
      this.leftNumberOfParticles2Property = new NumberProperty( 0, NUMBER_OF_PARTICLES_OPTIONS );
      this.leftAverageTemperatureProperty = new Property( null, AVERAGE_TEMPERATURE_OPTIONS ); // K

      // @public (read-only) Data for the right half of the container
      this.rightNumberOfParticles1Property = new NumberProperty( 0, NUMBER_OF_PARTICLES_OPTIONS );
      this.rightNumberOfParticles2Property = new NumberProperty( 0, NUMBER_OF_PARTICLES_OPTIONS );
      this.rightAverageTemperatureProperty = new Property( null, AVERAGE_TEMPERATURE_OPTIONS ); // K
    }

    // @public
    reset() {
      this.leftNumberOfParticles1Property.reset();
      this.leftNumberOfParticles2Property.reset();
      this.leftAverageTemperatureProperty.reset();
      this.rightNumberOfParticles1Property.reset();
      this.rightNumberOfParticles2Property.reset();
      this.rightAverageTemperatureProperty.reset();
    }

    /**
     * Gets the total number of particles in the left side of the container.
     * @returns {number}
     * @public
     */
    get leftNumberOfParticles() {
      return this.leftNumberOfParticles1Property.value + this.leftNumberOfParticles2Property.value;
    }

    /**
     * Gets the total number of particles in the right side of the container.
     * @returns {number}
     * @public
     */
    get rightNumberOfParticles() {
      return this.rightNumberOfParticles1Property.value + this.rightNumberOfParticles2Property.value;
    }
  }

  return gasProperties.register( 'DiffusionData', DiffusionData );
} );