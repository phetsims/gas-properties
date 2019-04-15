// Copyright 2018-2019, University of Colorado Boulder

/**
 * Model for the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesModel = require( 'GAS_PROPERTIES/common/model/GasPropertiesModel' );
  const NormalTimeTransform = require( 'GAS_PROPERTIES/common/model/NormalTimeTransform' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const RangeWithValue = require( 'DOT/RangeWithValue' );
  const SlowTimeTransform = require( 'GAS_PROPERTIES/common/model/SlowTimeTransform' );
  const Timescale = require( 'GAS_PROPERTIES/diffusion/model/Timescale' );

  class DiffusionModel extends GasPropertiesModel {

    constructor() {

      super();

      // @public
      this.timescaleProperty = new EnumerationProperty( Timescale, Timescale.NORMAL );

      // Change the time transform to match the timescale.
      this.timescaleProperty.link( timescale => {
        if ( timescale === Timescale.NORMAL ) {
          this.timeTransform = new NormalTimeTransform();
        }
        else {
          this.timeTransform = new SlowTimeTransform();
        }
      } );

      // @public
      this.hasDividerProperty = new BooleanProperty( true );

      // @public (read-only)
      this.initialNumberRange = new RangeWithValue( 0, 100, 0 );
      this.initialNumberDelta = 10;

      // @public
      this.initialNumber1Property = new NumberProperty( this.initialNumberRange.defaultValue );
      this.initialNumber2Property = new NumberProperty( this.initialNumberRange.defaultValue );

      // @public (read-only)
      this.massRange = new RangeWithValue( 4, 32, 28 );
      this.massDelta = 1;

      // @public
      this.mass1Property = new NumberProperty( this.massRange.defaultValue );
      this.mass2Property = new NumberProperty( this.massRange.defaultValue );

      // @public (read-only)
      this.initialTemperatureRange = new RangeWithValue( 50, 500, 300 );
      this.initialTemperatureDelta = 50;

      // @public
      this.initialTemperature1Property = new NumberProperty( this.initialTemperatureRange.defaultValue );
      this.initialTemperature2Property = new NumberProperty( this.initialTemperatureRange.defaultValue );

      // Data for the left half of the container
      this.leftNumberOfParticles1Property = new NumberProperty( 0 );
      this.leftNumberOfParticles2Property = new NumberProperty( 0 );
      this.leftAverageTemperatureProperty = new NumberProperty( 0 );

      // Data for the right half of the container
      this.rightNumberOfParticles1Property = new NumberProperty( 0 );
      this.rightNumberOfParticles2Property = new NumberProperty( 0 );
      this.rightAverageTemperatureProperty = new NumberProperty( 0 );
    }

    /**
     * Resets the model.
     * @public
     * @override
     */
    reset() {
      super.reset();

      this.timescaleProperty.reset();

      this.resetExperiment();

      this.leftNumberOfParticles1Property.reset();
      this.leftNumberOfParticles2Property.reset();
      this.leftAverageTemperatureProperty.reset();
      this.rightNumberOfParticles1Property.reset();
      this.rightNumberOfParticles2Property.reset();
      this.rightAverageTemperatureProperty.reset();
    }

    /**
     * Resets Properties related to the experiment.
     * @public
     */
    resetExperiment() {
      this.hasDividerProperty.reset();
      this.initialNumber1Property.reset();
      this.initialNumber2Property.reset();
      this.mass1Property.reset();
      this.mass2Property.reset();
      this.initialTemperature1Property.reset();
      this.initialTemperature2Property.reset();
    }

    /**
     * Steps the model using model time units.
     * @param {number} dt - time delta, in ps
     * @protected
     * @override
     */
    stepModelTime( dt ) {
      super.stepModelTime( dt );
      //TODO
    }
  }

  return gasProperties.register( 'DiffusionModel', DiffusionModel );
} );