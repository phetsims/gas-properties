// Copyright 2018-2019, University of Colorado Boulder

//TODO duplication with GasPropertiesModel herein
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
  const LinearFunction = require( 'DOT/LinearFunction' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Stopwatch = require( 'GAS_PROPERTIES/common/model/Stopwatch' );
  const Timescale = require( 'GAS_PROPERTIES/diffusion/model/Timescale' );
  const Vector2 = require( 'DOT/Vector2' );

  class DiffusionModel {

    constructor() {

      // @public
      this.timescaleProperty = new EnumerationProperty( Timescale, Timescale.NORMAL );

      // @private (read-only) 'normal' transform between real time and sim time
      // 1 second of real time is 2.5 picoseconds of sim time.
      this.normalTimeTransform = new LinearFunction( 0, 1, 0, 2.5 );

      // @private (read-only) 'slow' transform between real time and sim time
      // 1 second of real time is 2.5 picoseconds of sim time.
      this.slowTimeTransform = new LinearFunction( 0, 1, 0, 20 );

      // @public (read-only) transform between model and view coordinate frames
      const modelViewScale = 40; // number of pixels per nm
      this.modelViewTransform = ModelViewTransform2.createOffsetXYScaleMapping(
        new Vector2( 645, 475 ), // offset of the model's origin, in view coordinates
        modelViewScale,
        -modelViewScale // y is inverted
      );

      // @public is the sim playing?
      this.isPlayingProperty = new BooleanProperty( true );

      // @public (read-only)
      this.stopwatch = new Stopwatch( {
        location: new Vector2( 25, 15 ) // view coordinates! determined empirically
      } );

      //TODO
      this.hasDividerProperty = new BooleanProperty( true );
      this.leftNumberOfParticles1Property = new NumberProperty( 0 );
      this.leftNumberOfParticles2Property = new NumberProperty( 0 );
      this.leftAverageTemperatureProperty = new NumberProperty( 0 );
      this.rightNumberOfParticles1Property = new NumberProperty( 0 );
      this.rightNumberOfParticles2Property = new NumberProperty( 0 );
      this.rightAverageTemperatureProperty = new NumberProperty( 0 );
    }

    /**
     * Gets the time transform that's the related to the current timescale.
     * @returns {LinearFunction}
     * @public
     */
    get timeTransform() {
      if ( this.timescaleProperty.value === Timescale.NORMAL ) {
        return this.normalTimeTransform;
      }
      else {
        return this.slowTimeTransform;
      }
    }

    // @public
    reset() {
      this.timescaleProperty.reset();
      this.stopwatch.reset();
      this.hasDividerProperty.reset();
      this.leftNumberOfParticles1Property.reset();
      this.leftNumberOfParticles2Property.reset();
      this.leftAverageTemperatureProperty.reset();
      this.rightNumberOfParticles1Property.reset();
      this.rightNumberOfParticles2Property.reset();
      this.rightAverageTemperatureProperty.reset();
    }

    /**
     * Steps the model using real time units.
     * @param {number} dt - time delta, in seconds
     * @public
     */
    step( dt ) {
      if ( this.isPlayingProperty.value ) {
        this.stepModelTime( this.timeTransform( dt ) );
      }
    }

    /**
     * Steps the model using model time units.
     * @param {number} dt - time delta, in ps
     * @private
     */
    stepModelTime( dt ) {

      // Advance the stopwatch
      this.stopwatch.step( dt );
    }
  }

  return gasProperties.register( 'DiffusionModel', DiffusionModel );
} );