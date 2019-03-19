// Copyright 2018-20189, University of Colorado Boulder

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

      // @public the number of particle-container collisions
      this.numberOfCollisionsProperty = new NumberProperty( 0, {
        numberType: 'Integer',
        isValidValue: value => ( value >= 0 )
      } );

      // @public whether the collision counter is running
      this.isRunningProperty = new BooleanProperty( false );

      // @private time that the counter has been running, in ps
      this.timeRunning = 0;

      // @public whether the collision counter is visible
      this.visibleProperty = new BooleanProperty( options.visible );

      // @public (read-only) valid values for samplePeriodProperty, in ps
      this.samplePeriods = [ 10, 25, 50, 100 ];

      // @public sample period for counting collisions, in ps
      this.samplePeriodProperty = new NumberProperty( 10, {
        numberType: 'Integer',
        validValues: this.samplePeriods
      } );

      this.isRunningProperty.link( isRunning => {
        if ( isRunning ) {
          this.timeRunning = 0;
          this.numberOfCollisionsProperty.value = 0;
        }
      } );

      // Changing visibility or sample period stops the counter and resets the count.
      this.visibleProperty.link( visible => this.stopAndResetCount() );
      this.samplePeriodProperty.link( samplePeriodProperty => this.stopAndResetCount() );
    }

    // @public
    reset() {
      this.locationProperty.reset();
      this.numberOfCollisionsProperty.reset();
      this.isRunningProperty.reset();
      this.visibleProperty.reset();
      this.samplePeriodProperty.reset();
    }

    // @private
    stopAndResetCount() {
      this.isRunningProperty.value = false;
      this.numberOfCollisionsProperty.value = 0;
    }

    /**
     * Steps the collision counter.
     * @param {number} dt - time step, in ps
     */
    step( dt ) {
      if ( this.isRunningProperty.value ) {

        // record the number of collisions for this time step
        this.numberOfCollisionsProperty.value += this.collisionDetector.numberOfParticleContainerCollisions;

        // if we've come to the end of the sample period, stop the counter
        this.timeRunning += dt;
        if ( this.timeRunning >= this.samplePeriodProperty.value ) {
          this.isRunningProperty.value = false;
          phet.log && phet.log( `CollisionCounter sample period, desired=${this.samplePeriodProperty.value} actual=${this.timeRunning}` );
        }
      }
    }
  }

  return gasProperties.register( 'CollisionCounter', CollisionCounter );
} );