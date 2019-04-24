// Copyright 2018-2019, University of Colorado Boulder

/**
 * Model for the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const DiffusionContainer = require( 'GAS_PROPERTIES/diffusion/model/DiffusionContainer' );
  const DiffusionExperiment = require( 'GAS_PROPERTIES/diffusion/model/DiffusionExperiment' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesModel = require( 'GAS_PROPERTIES/common/model/GasPropertiesModel' );
  const NormalTimeTransform = require( 'GAS_PROPERTIES/common/model/NormalTimeTransform' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const SlowTimeTransform = require( 'GAS_PROPERTIES/common/model/SlowTimeTransform' );
  const Timescale = require( 'GAS_PROPERTIES/diffusion/model/Timescale' );
  const Vector2 = require( 'DOT/Vector2' );

  class DiffusionModel extends GasPropertiesModel {

    constructor() {

      super( {
        stopwatchLocation: new Vector2( 35, 15 ) // in view coordinates! determined empirically
      } );

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
      this.container = new DiffusionContainer( {
        location: new Vector2( 0, -1.5 ) //TODO better to shift the MVT?
      } );

      // @public parameters that control the experiment
      this.experiment = new DiffusionExperiment();

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

      // components
      this.container.reset();

      // Properties
      this.timescaleProperty.reset();
      this.experiment.reset();
      this.leftNumberOfParticles1Property.reset();
      this.leftNumberOfParticles2Property.reset();
      this.leftAverageTemperatureProperty.reset();
      this.rightNumberOfParticles1Property.reset();
      this.rightNumberOfParticles2Property.reset();
      this.rightAverageTemperatureProperty.reset();
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