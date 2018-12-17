// Copyright 2018, University of Colorado Boulder

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
  const Property = require( 'AXON/Property' );
  const Vector2 = require( 'DOT/Vector2' );

  class Stopwatch {

    /**
     * @param {LinearFunction} timeTransform
     * @param {Object} options
     */
    constructor( timeTransform, options ) {

      options = _.extend( {
        location: Vector2.ZERO,
        visible: false
      }, options );

      // @private
      this.timeTransform = timeTransform;

      // @public location of the stopwatch, in view coordinates
      this.locationProperty = new Property( options.location, {
        valueType: Vector2
      } );

      // @public whether the stopwatch is visible
      this.visibleProperty = new BooleanProperty( options.visible );

      // @public whether the stopwatch is running
      this.isRunningProperty = new BooleanProperty( false );

      // @public time displayed on the stopwatch, in ps
      this.timeProperty = new NumberProperty( 0, {
        isValidValue: value => ( value >= 0 )
      } );

      // When the stopwatch becomes invisible, stop it and reset its value.
      this.visibleProperty.link( visible => {
        if ( !visible ) {
          this.isRunningProperty.value = false;
          this.timeProperty.value = 0;
        }
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
     * Update the stopwatch. 1 second of real time is displayed as 2.5 picoseconds
     * @param {number} dt - time delta, in seconds
     */
    step( dt ) {
      if ( this.isRunningProperty.value ) {
        this.timeProperty.value += this.timeTransform( dt );
      }
    }
  }

  return gasProperties.register( 'Stopwatch', Stopwatch );
} );