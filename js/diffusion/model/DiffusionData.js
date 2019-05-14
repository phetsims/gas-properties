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
      this.numberOfParticles1Property = new NumberProperty( 0, NUMBER_OF_PARTICLES_OPTIONS );
      this.numberOfParticles2Property = new NumberProperty( 0, NUMBER_OF_PARTICLES_OPTIONS );
      this.averageTemperatureProperty = new Property( null, AVERAGE_TEMPERATURE_OPTIONS ); // K
    }

    // @public
    reset() {
      this.numberOfParticles1Property.reset();
      this.numberOfParticles2Property.reset();
      this.averageTemperatureProperty.reset();
    }

    /**
     * Gets the total number of particles represented by the data.
     * @returns {number}
     * @public
     */
    get numberOfParticles() {
      return this.numberOfParticles1Property.value + this.numberOfParticles2Property.value;
    }
  }

  return gasProperties.register( 'DiffusionData', DiffusionData );
} );