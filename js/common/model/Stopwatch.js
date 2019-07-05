// Copyright 2018-2019, University of Colorado Boulder

/**
 * Stopwatch is the model for the stopwatch. It is responsible for time, location, and visibility.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );

  class Stopwatch {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = _.extend( {
        location: Vector2.ZERO,
        visible: false
      }, options );

      // @public location of the stopwatch, in view coordinates
      this.locationProperty = new Vector2Property( options.location );

      // @public whether the stopwatch is visible
      this.visibleProperty = new BooleanProperty( options.visible );

      // @public whether the stopwatch is running
      this.isRunningProperty = new BooleanProperty( false );

      // @public (read-only) time displayed on the stopwatch, in ps
      this.timeProperty = new NumberProperty( 0, {
        isValidValue: value => ( value >= 0 ),
        units: 'ps'
      } );

      // When the stopwatch visibility changes, stop it and reset its value.
      // REVIEW: visible param is unused, can be removed
      this.visibleProperty.link( visible => {
        this.isRunningProperty.value = false;
        this.timeProperty.value = 0;
      } );
    }

    /**
     * Resets the stopwatch.
     * @public
     */
    reset() {
      this.locationProperty.reset();
      this.visibleProperty.reset();
      this.isRunningProperty.reset();
      this.timeProperty.reset();
    }

    /**
     * Steps the stopwatch.
     * @param {number} dt - time delta, in ps
     * @public
     */
    step( dt ) {
      assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );

      if ( this.isRunningProperty.value ) {
        this.timeProperty.value += dt;
      }
    }
  }

  return gasProperties.register( 'Stopwatch', Stopwatch );
} );