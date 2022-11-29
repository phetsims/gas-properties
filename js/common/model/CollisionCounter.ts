// Copyright 2018-2022, University of Colorado Boulder

/**
 * CollisionCounter counts collisions between particles and the walls of a container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import gasProperties from '../../gasProperties.js';
import CollisionDetector from './CollisionDetector.js';

type SelfOptions = {
  position?: Vector2;
  visible?: boolean;
};

type CollisionCounterOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class CollisionCounter {

  private readonly collisionDetector: CollisionDetector;

  // position of the collision counter, in view coordinates
  public readonly positionProperty: Property<Vector2>;

  // the number of particle-container collisions
  public readonly numberOfCollisionsProperty: Property<number>;

  // whether the collision counter is running
  public readonly isRunningProperty: Property<boolean>;

  // time that the counter has been running, in ps
  private timeRunning: number;

  // whether the collision counter is visible
  public readonly visibleProperty: Property<boolean>;

  // valid values for samplePeriodProperty, in ps
  public readonly samplePeriods: number[];

  // Sample period for counting collisions
  // Actual sample period will be close to this value, but not exact (confirmed OK with @arouinfar).
  public readonly samplePeriodProperty: Property<number>;

  public constructor( collisionDetector: CollisionDetector, providedOptions: CollisionCounterOptions ) {

    const options = optionize<CollisionCounterOptions, SelfOptions>()( {

      // SelfOptions
      position: Vector2.ZERO,
      visible: false
    }, providedOptions );

    this.collisionDetector = collisionDetector;

    this.positionProperty = new Vector2Property( options.position, {
      tandem: options.tandem.createTandem( 'positionProperty' )
    } );

    this.numberOfCollisionsProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      isValidValue: value => ( value >= 0 ),
      tandem: options.tandem.createTandem( 'numberOfCollisionsProperty' )
    } );

    this.isRunningProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isRunningProperty' )
    } );

    this.timeRunning = 0;

    this.visibleProperty = new BooleanProperty( options.visible, {
      tandem: options.tandem.createTandem( 'visibleProperty' )
    } );

    this.samplePeriods = [ 5, 10, 20 ];

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

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  public reset(): void {
    this.positionProperty.reset();
    this.numberOfCollisionsProperty.reset();
    this.isRunningProperty.reset();
    this.visibleProperty.reset();
    this.samplePeriodProperty.reset();
  }

  /**
   * Resets the collision count and set its run-time to zero.
   */
  private resetCount(): void {
    this.numberOfCollisionsProperty.value = 0;
    this.timeRunning = 0;
  }

  /**
   * Stops the collision counter and does resetCount.
   */
  private stopAndResetCount(): void {
    this.isRunningProperty.value = false;
    this.resetCount();
  }

  /**
   * Steps the collision counter.
   * @param dt - time step, in ps
   */
  public step( dt: number ): void {
    assert && assert( dt > 0, `invalid dt: ${dt}` );
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