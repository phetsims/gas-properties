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
  const merge = require( 'PHET_CORE/merge' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );

  class Stopwatch {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = merge( {
        location: Vector2.ZERO,
        visible: false,

        // phet-io
        tandem: Tandem.required
      }, options );

      // @public location of the stopwatch, in view coordinates
      this.locationProperty = new Vector2Property( options.location, {
        tandem: options.tandem.createTandem( 'locationProperty' )
      } );

      // @public whether the stopwatch is visible
      this.visibleProperty = new BooleanProperty( options.visible, {
        tandem: options.tandem.createTandem( 'visibleProperty' )
      } );

      // @public whether the stopwatch is running
      this.isRunningProperty = new BooleanProperty( false, {
        tandem: options.tandem.createTandem( 'isRunningProperty' )
      } );

      // @public (read-only) time displayed on the stopwatch, in ps
      this.timeProperty = new NumberProperty( 0, {
        isValidValue: value => ( value >= 0 ),
        units: 'ps',
        tandem: options.tandem.createTandem( 'timeProperty' ),
        phetioReadOnly: true
      } );

      // When the stopwatch visibility changes, stop it and reset its value.
      this.visibleProperty.link( () => {
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