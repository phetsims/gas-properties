// Copyright 2019-2022, University of Colorado Boulder

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
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import gasProperties from '../../gasProperties.js';
import Particle from './Particle.js';

type SelfOptions = {
  position?: Vector2; // position of the container's bottom right corner, in pm
  widthRange?: RangeWithValue; // range and initial value of the container's width, in pm
};

export type BaseContainerOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class BaseContainer {

  public readonly position: Vector2; // position of the container's bottom right corner, in pm
  public readonly widthRange: RangeWithValue; // range and initial value of the container's width, in pm
  public readonly widthProperty: NumberProperty; // width of the container, in pm
  public readonly height: number; // height of the container, in pm
  public readonly depth: number; // depth of the container, in pm
  public readonly wallThickness: number; // wall thickness, in pm
  public readonly volumeProperty: TReadOnlyProperty<number>; // volume of the container, in pm^3
  public readonly boundsProperty: TReadOnlyProperty<Bounds2>; // inside bounds, in pm

  // maximum inside bounds, in pm. Used for sizing the CanvasNode that draws the particle system inside the container.
  public readonly maxBounds: Bounds2;

  // velocity of the left (movable) wall, pm/ps. This vector will be MUTATED!
  public readonly leftWallVelocity: Vector2;

  // Indicates whether the user is adjusting widthProperty. The width will also change automatically in
  // HoldConstant 'pressureV' mode. This is used to suppress model updates in the Ideal screen, when the user
  // is resizing the container with the sim paused.  See #125.
  public readonly userIsAdjustingWidthProperty: Property<boolean>;

  public constructor( providedOptions: BaseContainerOptions ) {

    const options = optionize<BaseContainerOptions, SelfOptions>()( {

      // SelfOptions
      position: Vector2.ZERO,
      widthRange: new RangeWithValue( 5000, 15000, 10000 )
    }, providedOptions );

    this.position = options.position;
    this.widthRange = options.widthRange;

    this.widthProperty = new NumberProperty( this.widthRange.defaultValue, {
      range: this.widthRange,
      units: 'pm',
      reentrant: true, // Occurring in PhET-iO State setting
      tandem: options.tandem.createTandem( 'widthProperty' ),
      phetioReadOnly: true
    } );

    this.height = 8750;
    this.depth = 4000;
    this.wallThickness = 75;

    this.volumeProperty = new DerivedProperty( [ this.widthProperty ],
      width => width * this.height * this.depth, {
        units: 'pm^3',
        isValidValue: value => ( value > 0 ),
        tandem: options.tandem.createTandem( 'volumeProperty' ),
        phetioValueType: NumberIO
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

    this.leftWallVelocity = new Vector2( 0, 0 );

    this.userIsAdjustingWidthProperty = new BooleanProperty( false );
  }

  public reset(): void {
    this.widthProperty.reset();
  }

  /**
   * Convenience getter for width, in pm
   */
  public get width(): number { return this.widthProperty.value; }

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

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }
}

gasProperties.register( 'BaseContainer', BaseContainer );