// Copyright 2018, University of Colorado Boulder

//TODO DESIGN: When should collision counter stop?
//TODO DESIGN: When should collision counter reset time to zero?
/**
 * Model for the collision counter.
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

  class CollisionCounter {

    /**
     * @param {CollisionDetector} collisionDetector
     * @param {Object} [options]
     */
    constructor( collisionDetector, options ) {

      options = _.extend( {
        location: Vector2.ZERO,
        visible: false
      }, options );

      // @private
      this.collisionDetector = collisionDetector;

      // @public location of the collision counter, in view coordinates
      this.locationProperty = new Vector2Property( options.location );

      // @public the number of collisions between the particles and the container walls
      this.numberOfCollisionsProperty = new NumberProperty( 0, {
        numberType: 'Integer',
        isValidValue: value => ( value >= 0 )
      } );

      // @public whether the collision counter is running
      this.isRunningProperty = new BooleanProperty( false );

      // @private time that the counter has been running
      this.timeRunning = 0;

      // Reset when the counter starts
      this.isRunningProperty.link( isRunning => {
        if ( isRunning ) {
          this.timeRunning = 0;
          this.numberOfCollisionsProperty.value = 0;
        }
      } );

      // @public whether the collision counter is visible
      this.visibleProperty = new BooleanProperty( options.visible );

      // When the counter visibility changes, stop the counter and reset its value.
      this.visibleProperty.link( visible => {
        this.isRunningProperty.value = false;
        this.numberOfCollisionsProperty.value = 0;
      } );

      // @public (read-only) valid values for samplePeriodProperty, in ps
      this.samplePeriods = [ 10, 25, 50, 100 ];

      // @public collision averaging time, in ps
      this.samplePeriodProperty = new NumberProperty( 10, {
        numberType: 'Integer',
        validValues: this.samplePeriods
      } );

      // Changing the sample period stops the counter and sets the count to zero.
      this.samplePeriodProperty.link( samplePeriodProperty => {
        this.isRunningProperty.value = false;
        this.numberOfCollisionsProperty.value = 0;
      } );
    }

    // @public
    reset() {
      this.locationProperty.reset();
      this.numberOfCollisionsProperty.reset();
      this.isRunningProperty.reset();
      this.visibleProperty.reset();
      this.samplePeriodProperty.reset();
    }

    step( dt ) {
      if ( this.isRunningProperty.value ) {
        this.numberOfCollisionsProperty.value += this.collisionDetector.numberOfParticleContainerCollisions;
        this.timeRunning += dt;
        if ( this.timeRunning >= this.samplePeriodProperty.value ) {
          this.isRunningProperty.value = false;
          phet.log && phet.log( `CollisionCounter: actual sample period was ${this.timeRunning} ps` );
        }
      }
    }
  }

  return gasProperties.register( 'CollisionCounter', CollisionCounter );
} );