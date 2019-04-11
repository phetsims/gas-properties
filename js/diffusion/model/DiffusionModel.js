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
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const LinearFunction = require( 'DOT/LinearFunction' );
  const Stopwatch = require( 'GAS_PROPERTIES/common/model/Stopwatch' );
  const Vector2 = require( 'DOT/Vector2' );

  class DiffusionModel {

    constructor() {

      // @public (read-only) transform between real time and sim time
      // 1 second of real time is 2.5 picoseconds of sim time.
      this.timeTransform = new LinearFunction( 0, 1, 0, 2.5 );

      // @public is the sim playing?
      this.isPlayingProperty = new BooleanProperty( true );

      // @public (read-only)
      this.stopwatch = new Stopwatch( {
        location: new Vector2( 25, 15 ) // view coordinates! determined empirically
      } );
    }

    reset() {
      this.stopwatch.reset();
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
      if ( this.isPlayingProperty.value ) {

        // Advance the stopwatch
        this.stopwatch.step( dt );
      }
    }
  }

  return gasProperties.register( 'DiffusionModel', DiffusionModel );
} );