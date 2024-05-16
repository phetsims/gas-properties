// Copyright 2019-2024, University of Colorado Boulder

/**
 * BaseContainer is the base class for containers in all screens. This is a rectangular container for particles,
 * with fixed position, fixed height and depth, and mutable width. The origin is at the bottom-right corner, and
 * width expands to the left.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import gasProperties from '../../gasProperties.js';
import Particle from './Particle.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';

type SelfOptions = {
  position?: Vector2; // position of the container's bottom right corner, in pm
  widthRange?: RangeWithValue; // range and initial value of the container's width, in pm
};

export type BaseContainerOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class BaseContainer extends PhetioObject {

  public readonly position: Vector2; // position of the container's bottom right corner, in pm
  public readonly widthRange: RangeWithValue; // range and initial value of the container's width, in pm
  public readonly widthProperty: NumberProperty; // width of the container, in pm
  public readonly height: number; // height of the container, in pm
  public readonly depth: number; // depth of the container, in pm
  public readonly wallThickness: number; // wall thickness, in pm
  public readonly volumeProperty: TReadOnlyProperty<number>; // volume of the container, in pm^3
  public readonly boundsProperty: TReadOnlyProperty<Bounds2>; // inside bounds, in pm

  // maximum inside bounds, in pm. Used for canvasBounds for the particle system inside the container.
  public readonly maxBounds: Bounds2;

  // Velocity x-component of the left (movable) wall, pm/ps. Since the wall only moves horizontally, velocity is all
  // x-component, and we do not need a velocity vector. This quantity does not need to be PhET-iO stateful because it
  // is recomputed on each call to step (for containers where the left wall does work), then used by CollisionDetector
  // to do container-particle collisions.
  private leftWallVelocityX: number;

  // Indicates whether the user is adjusting widthProperty. The width will also change automatically in
  // HoldConstant 'pressureV' mode. This is used to suppress model updates in the Ideal screen, when the user
  // is resizing the container with the sim paused.  See #125.
  public readonly userIsAdjustingWidthProperty: Property<boolean>;

  protected constructor( providedOptions: BaseContainerOptions ) {

    const options = optionize<BaseContainerOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      position: Vector2.ZERO,
      widthRange: GasPropertiesConstants.DEFAULT_CONTAINER_WIDTH,

      // PhetioObjectOptions
      isDisposable: false,
      phetioState: false,
      phetioFeatured: true
    }, providedOptions );

    super( options );

    this.position = options.position;
    this.widthRange = options.widthRange;

    this.widthProperty = new NumberProperty( this.widthRange.defaultValue, {
      range: this.widthRange,
      units: 'pm',
      reentrant: true, // Occurring in PhET-iO State setting
      tandem: options.tandem.createTandem( 'widthProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true,
      phetioDocumentation: 'Width of the container.'
    } );

    this.height = 8750;
    this.depth = 4000;
    this.wallThickness = 75;

    this.volumeProperty = new DerivedProperty( [ this.widthProperty ],
      width => width * this.height * this.depth, {
        units: 'pm^3',
        isValidValue: value => ( value > 0 ),
        tandem: options.tandem.createTandem( 'volumeProperty' ),
        phetioFeatured: true,
        phetioValueType: NumberIO,
        phetioDocumentation: 'Volume of the container.'
      } );

    this.boundsProperty = new DerivedProperty( [ this.widthProperty ],
      width => new Bounds2(
        this.position.x - width, this.position.y,
        this.position.x, this.position.y + this.height
      ), {
        valueType: Bounds2
      } );

    this.maxBounds = new Bounds2(
      this.position.x - this.widthRange.max, this.position.y,
      this.position.x, this.position.y + this.height
    );

    this.leftWallVelocityX = 0;

    this.userIsAdjustingWidthProperty = new BooleanProperty( false, {
      tandem: this.isFixedWidth ? Tandem.OPT_OUT : options.tandem.createTandem( 'userIsAdjustingWidthProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only.'
    } );
  }

  public reset(): void {
    this.widthProperty.reset();
  }

  /**
   * Convenience getter for width, in pm
   */
  public get width(): number { return this.widthProperty.value; }

  /**
   * Does the container have a fixed width?
   */
  public get isFixedWidth(): boolean {
    return this.widthProperty.range.getLength() === 0;
  }

  /**
   * Convenience getter for inside bounds, in pm.
   */
  public get bounds(): Bounds2 { return this.boundsProperty.value; }

  /**
   * Convenience getters for inside bounds of the container, in model coordinate frame (pm).
   * Bounds2 has similar getters, but uses a view coordinate frame, where 'top' is minY and 'bottom' is maxY.
   */
  public get left(): number { return this.bounds.minX; }

  public get right(): number { return this.bounds.maxX; }

  public get bottom(): number { return this.bounds.minY; }

  public get top(): number { return this.bounds.maxY; }

  public get centerY(): number { return this.bounds.centerY; }

  /**
   * Sets the velocity x-component of the left wall, in pm/ps.
   */
  public setLeftWallVelocityX( speed: number ): void {
    this.leftWallVelocityX = speed;
  }

  /**
   * Gets the velocity x-component of the left wall, in pm/ps.
   */
  public getLeftWallVelocityX(): number {
    return this.leftWallVelocityX;
  }

  /**
   * Determines whether the container fully contains a particle.
   */
  public containsParticle( particle: Particle ): boolean {
    return particle.left >= this.bounds.minX &&
           particle.right <= this.bounds.maxX &&
           particle.bottom >= this.bounds.minY &&
           particle.top <= this.bounds.maxY;
  }

  /**
   * Determines whether the container fully contains one or more collections of particles.
   */
  public containsParticles( particleArrays: Particle[][] ): boolean {
    assert && assert( Array.isArray( particleArrays ), `invalid particlesArray: ${particleArrays}` );

    for ( let i = particleArrays.length - 1; i >= 0; i-- ) {
      const particles = particleArrays[ i ];
      for ( let j = particles.length - 1; j >= 0; j-- ) {
        const particle = particles[ j ];
        if ( !this.containsParticle( particle ) ) {
          return false;
        }
      }
    }
    return true;
  }
}

gasProperties.register( 'BaseContainer', BaseContainer );