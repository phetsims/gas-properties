// Copyright 2018-2019, University of Colorado Boulder

//TODO DESIGN Why do we want to show stopwatch time to NN.nn ps?
//TODO DESIGN When should stopwatch reset time to zero?
//TODO DESIGN What is the max time at which stopwatch should stop?
/**
 * Model for the stopwatch.
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
     * @param {Object} options
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

      // @public time displayed on the stopwatch, in ps
      this.timeProperty = new NumberProperty( 0, {
        isValidValue: value => ( value >= 0 ),
        units: 'ps'
      } );

      // When the stopwatch visibility changes, stop it and reset its value.
      this.visibleProperty.link( visible => {
        this.isRunningProperty.value = false;
        this.timeProperty.value = 0;
      } );
    }

    // @public
    reset() {
      this.locationProperty.reset();
      this.visibleProperty.reset();
      this.isRunningProperty.reset();
      this.timeProperty.reset();
    }

    /**
     * Steps the stopwatch.
     * @param {number} dt - time step, in ps
     * @public
     */
    step( dt ) {
      if ( this.isRunningProperty.value ) {
        this.timeProperty.value += dt;
      }
    }
  }

  return gasProperties.register( 'Stopwatch', Stopwatch );
} );