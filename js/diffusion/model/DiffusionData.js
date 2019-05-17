// Copyright 2019, University of Colorado Boulder

/**
 * Values shown for one side of the container in the 'Data' accordion box in the 'Diffusion' screen.
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
  const NUMBER_OF_PARTICLES_PROPERTY_OPTIONS = {
    numberType: 'Integer',
    isValidValue: value => ( value >= 0 )
  };
  const AVERAGE_TEMPERATURE_PROPERTY_OPTIONS = {
    isValidValue: value => ( value === null || ( typeof value === 'number' && value > 0 ) ),
    units: 'K'
  };

  class DiffusionData {

    constructor() {

      // @public number of DiffusionParticle1 in this side of the container
      this.numberOfParticles1Property = new NumberProperty( 0, NUMBER_OF_PARTICLES_PROPERTY_OPTIONS );

      // @public number of DiffusionParticle2 in this side of the container
      this.numberOfParticles2Property = new NumberProperty( 0, NUMBER_OF_PARTICLES_PROPERTY_OPTIONS );

      // @public {Property.<number|null>} average temperature in this side of the container, in K
      // null when there are no particles in this side of the container.
      this.averageTemperatureProperty = new Property( null, AVERAGE_TEMPERATURE_PROPERTY_OPTIONS );
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
    getNumberOfParticles() {
      return this.numberOfParticles1Property.value + this.numberOfParticles2Property.value;
    }
  }

  return gasProperties.register( 'DiffusionData', DiffusionData );
} );