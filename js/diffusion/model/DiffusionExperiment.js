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
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const RangeWithValue = require( 'DOT/RangeWithValue' );

  class DiffusionExperiment {

    constructor() {

      // @public (read-only)
      this.initialNumberRange = new RangeWithValue( 0, GasPropertiesQueryParameters.maxInitialNumber, 0 );
      this.initialNumberDelta = 10;

      // @public initial number of particles of each type
      this.initialNumber1Property = new NumberProperty( this.initialNumberRange.defaultValue );
      this.initialNumber2Property = new NumberProperty( this.initialNumberRange.defaultValue );

      // @public (read-only)
      this.massRange = new RangeWithValue( 4, 32, 28 ); // AMU
      this.massDelta = 1; // AMU

      // @public mass of each particle type
      this.mass1Property = new NumberProperty( this.massRange.defaultValue ); // AMU
      this.mass2Property = new NumberProperty( this.massRange.defaultValue ); // AMU

      // @public (read-only)
      this.initialTemperatureRange = new RangeWithValue( 50, 500, 300 ); // K
      this.initialTemperatureDelta = 50; // K

      // @public initial temperature for each particle type, used to compute initial velocity
      this.initialTemperature1Property = new NumberProperty( this.initialTemperatureRange.defaultValue ); // K
      this.initialTemperature2Property = new NumberProperty( this.initialTemperatureRange.defaultValue ); // K
    }

    /**
     * Resets the experiment.
     * @public
     */
    reset() {
      this.initialNumber1Property.reset();
      this.initialNumber2Property.reset();
      this.mass1Property.reset();
      this.mass2Property.reset();
      this.initialTemperature1Property.reset();
      this.initialTemperature2Property.reset();
    }
  }

  return gasProperties.register( 'DiffusionExperiment', DiffusionExperiment );
} );