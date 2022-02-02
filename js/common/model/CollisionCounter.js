// Copyright 2018-2022, University of Colorado Boulder

/**
 * CollisionCounter counts collisions between particles and the walls of a container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import CollisionDetector from './CollisionDetector.js';

class CollisionCounter {

  /**
   * @param {CollisionDetector} collisionDetector - detects collisions between particles and the container
   * @param {Object} [options]
   */
  constructor( collisionDetector, options ) {
    assert && assert( collisionDetector instanceof CollisionDetector,
      `invalid collisionDetector: ${collisionDetector}` );

    options = merge( {
      position: Vector2.ZERO,
      visible: false,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // @private
    this.collisionDetector = collisionDetector;

    // @public position of the collision counter, in view coordinates
    this.positionProperty = new Vector2Property( options.position, {
      tandem: options.tandem.createTandem( 'positionProperty' )
    } );

    // @public (read-only) the number of particle-container collisions
    this.numberOfCollisionsProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      isValidValue: value => ( value >= 0 ),
      tandem: options.tandem.createTandem( 'numberOfCollisionsProperty' )
    } );

    // @public whether the collision counter is running
    this.isRunningProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isRunningProperty' )
    } );

    // @private time that the counter has been running, in ps
    this.timeRunning = 0;

    // @public whether the collision counter is visible
    this.visibleProperty = new BooleanProperty( options.visible, {
      tandem: options.tandem.createTandem( 'visibleProperty' )
    } );

    // @public (read-only) valid values for samplePeriodProperty, in ps
    this.samplePeriods = [ 5, 10, 20 ];

    // @public sample period for counting collisions
    // Actual sample period will be close to this value, but not exact (confirmed OK with @arouifar).
    this.samplePeriodProperty = new NumberProperty( this.samplePeriods[ 1 ], {
      numberType: 'Integer',
      validValues: this.samplePeriods,
      units: 'ps',
      tandem: options.tandem.createTandem( 'samplePeriodProperty' )
    } );

    // Changing the running state resets the collision count.
    this.isRunningProperty.link( () => this.resetCount() );

    // Changing visibility or sample period stops the counter and resets the collision count.
    this.visibleProperty.link( () => this.stopAndResetCount() );
    this.samplePeriodProperty.link( () => this.stopAndResetCount() );
  }

  /**
   * Resets the collision counter.
   * @public
   */
  reset() {
    this.positionProperty.reset();
    this.numberOfCollisionsProperty.reset();
    this.isRunningProperty.reset();
    this.visibleProperty.reset();
    this.samplePeriodProperty.reset();
  }

  /**
   * Resets the collision count and set its run-time to zero.
   * @private
   */
  resetCount() {
    this.numberOfCollisionsProperty.value = 0;
    this.timeRunning = 0;
  }

  /**
   * Stops the collision counter and does resetCount.
   * @private
   */
  stopAndResetCount() {
    this.isRunningProperty.value = false;
    this.resetCount();
  }

  /**
   * Steps the collision counter.
   * @param {number} dt - time step, in ps
   * @public
   */
  step( dt ) {
    assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );
    if ( this.isRunningProperty.value ) {

      // record the number of collisions for this time step
      this.numberOfCollisionsProperty.value += this.collisionDetector.numberOfParticleContainerCollisions;

      // If we've come to the end of the sample period, stop the counter.
      // isRunningProperty is used by the Play/Reset toggle button, and changing its state resets the count.
      // So we need to save and restore the count here when modifying isRunningProperty.  This was simpler
      // than other solutions that were investigated.
      this.timeRunning += dt;
      if ( this.timeRunning >= this.samplePeriodProperty.value ) {
        phet.log && phet.log( `CollisionCounter sample period: desired=${this.samplePeriodProperty.value} actual=${this.timeRunning}` );
        const numberOfCollisions = this.numberOfCollisionsProperty.value;
        this.isRunningProperty.value = false;
        this.numberOfCollisionsProperty.value = numberOfCollisions;
      }
    }
  }
}

gasProperties.register( 'CollisionCounter', CollisionCounter );
export default CollisionCounter;