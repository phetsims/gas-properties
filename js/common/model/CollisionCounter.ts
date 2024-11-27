// Copyright 2018-2024, University of Colorado Boulder

/**
 * CollisionCounter counts collisions between particles and the walls of a container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import gasProperties from '../../gasProperties.js';
import CollisionDetector from './CollisionDetector.js';

type SelfOptions = {
  position?: Vector2;
  visible?: boolean;
};

type CollisionCounterOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class CollisionCounter extends PhetioObject {

  private readonly collisionDetector: CollisionDetector;

  // position of the collision counter, in view coordinates
  public readonly positionProperty: Property<Vector2>;

  // the number of particle-container collisions
  public readonly numberOfCollisionsProperty: Property<number>;

  // whether the collision counter is running
  public readonly isRunningProperty: Property<boolean>;

  // time that the counter has been running, in ps
  private readonly timeRunningProperty: NumberProperty;

  // whether the collision counter is visible
  public readonly visibleProperty: Property<boolean>;

  // Sample period for counting collisions
  // Actual sample period will be close to this value, but not exact (confirmed OK with @arouinfar).
  public readonly samplePeriodProperty: Property<number>;

  // Valid values for samplePeriodProperty, in ps.
  public static readonly SAMPLE_PERIODS = [ 5, 10, 20 ];

  public constructor( collisionDetector: CollisionDetector, providedOptions: CollisionCounterOptions ) {

    const options = optionize<CollisionCounterOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      position: Vector2.ZERO,
      visible: false,

      // PhetioObjectOptions
      isDisposable: false,
      phetioState: false,
      phetioFeatured: true
    }, providedOptions );

    super( options );

    this.collisionDetector = collisionDetector;

    this.positionProperty = new Vector2Property( options.position, {
      tandem: options.tandem.createTandem( 'positionProperty' ),
      phetioFeatured: true
    } );

    this.numberOfCollisionsProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      isValidValue: value => ( value >= 0 ),
      tandem: options.tandem.createTandem( 'numberOfCollisionsProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true,
      phetioDocumentation: 'The number of collisions recorded, as shown on the collision counter.'
    } );

    this.isRunningProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isRunningProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Whether the collision counter is running.'
    } );

    this.timeRunningProperty = new NumberProperty( 0, {
      units: 'ps',
      tandem: options.tandem.createTandem( 'timeRunningProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only.'
    } );

    this.visibleProperty = new BooleanProperty( options.visible, {
      tandem: options.tandem.createTandem( 'visibleProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Whether the collision counter is visible.'
    } );

    this.samplePeriodProperty = new NumberProperty( CollisionCounter.SAMPLE_PERIODS[ 1 ], {
      numberType: 'Integer',
      validValues: CollisionCounter.SAMPLE_PERIODS,
      units: 'ps',
      tandem: options.tandem.createTandem( 'samplePeriodProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'The period over which collisions will be recorded.'
    } );

    // Changing visibility or sample period stops the counter, and resets the count and time.
    Multilink.multilink( [ this.visibleProperty, this.samplePeriodProperty ], () => {
      if ( !isSettingPhetioStateProperty.value ) {
        this.isRunningProperty.reset();
        this.numberOfCollisionsProperty.reset();
        this.timeRunningProperty.reset();
      }
    } );

    // Starting the counter resets the count and time.
    this.isRunningProperty.link( isRunning => {
      if ( isRunning && !isSettingPhetioStateProperty.value ) {
        this.numberOfCollisionsProperty.reset();
        this.timeRunningProperty.reset();
      }
    } );
  }

  public reset(): void {
    this.positionProperty.reset();
    this.numberOfCollisionsProperty.reset();
    this.isRunningProperty.reset();
    this.visibleProperty.reset();
    this.samplePeriodProperty.reset();
    this.timeRunningProperty.reset();
  }

  /**
   * Steps the collision counter.
   * @param dt - time step, in ps
   */
  public step( dt: number ): void {
    assert && assert( dt > 0, `invalid dt: ${dt}` );
    if ( this.isRunningProperty.value ) {

      // Record the number of collisions for this time step.
      this.numberOfCollisionsProperty.value += this.collisionDetector.numberOfParticleContainerCollisions;

      // Increment the time running.
      this.timeRunningProperty.value += dt;

      // If we've come to the end of the sample period, stop the counter.
      if ( this.timeRunningProperty.value >= this.samplePeriodProperty.value ) {
        phet.log && phet.log( `CollisionCounter sample period: desired=${this.samplePeriodProperty.value} actual=${this.timeRunningProperty.value}` );
        this.isRunningProperty.value = false;
        this.timeRunningProperty.value = this.samplePeriodProperty.value; // To make these match in PhET-iO.
      }
    }
  }
}

gasProperties.register( 'CollisionCounter', CollisionCounter );