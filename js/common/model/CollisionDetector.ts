// Copyright 2019-2022, University of Colorado Boulder

/**
 * CollisionDetector handles collision detection and response for all screens. Our collision model involves
 * rigid bodies. It is a perfectly-elastic collision model, where there is no net loss of kinetic energy.
 *
 * The algorithms for particle-particle collisions and particle-container collisions were adapted from the Java
 * implementation of Gas Properties. They differ from the standard rigid-body collision model as described in (e.g.)
 * http://web.mst.edu/~reflori/be150/Dyn%20Lecture%20Videos/Impact%20Particles%201/Impact%20Particles%201.pdf.
 * For historical background on how the Java implementation informed this implementation, see:
 * https://github.com/phetsims/gas-properties/issues/37
 * https://github.com/phetsims/gas-properties/issues/40
 *
 * While code comments attempt to describe this implementation clearly, fully understanding the implementation may
 * require some general background in collisions detection and response. Some useful references include:
 * https://en.wikipedia.org/wiki/Collision_detection
 * https://en.wikipedia.org/wiki/Collision_response
 * https://en.wikipedia.org/wiki/Elastic_collision
 * https://en.wikipedia.org/wiki/Collision_response#Impulse-based_contact_model
 * https://en.wikipedia.org/wiki/Coefficient_of_restitution
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesUtils from '../GasPropertiesUtils.js';
import BaseContainer from './BaseContainer.js';
import Particle from './Particle.js';
import Region from './Region.js';

// Coefficient of restitution (e) is the ratio of the final to initial relative velocity between two objects
// after they collide. It normally ranges from 0 to 1, where 1 is a perfectly elastic collision.
// See https://en.wikipedia.org/wiki/Coefficient_of_restitution
const e = 1;

type MutableVectors = {
  normal: Vector2;
  tangent: Vector2;
  relativeVelocity: Vector2;
  pointOnLine: Vector2;
  reflectedPoint: Vector2;
};

export default class CollisionDetector {

  private readonly container: BaseContainer;
  protected readonly particleArrays: Particle[][];
  public readonly particleParticleCollisionsEnabledProperty: Property<boolean>;

  // 2D grid of Regions
  public readonly regions: Region[];

  // number of wall collisions on the most recent call to update
  private _numberOfParticleContainerCollisions: number;

  // mutable vectors, reused in critical code
  private readonly mutableVectors: MutableVectors;

  /**
   * @param container - the container inside which collision occur
   * @param particleArrays - collections of particles inside the container
   * @param particleParticleCollisionsEnabledProperty - whether particle-particle collisions occur
   */
  public constructor( container: BaseContainer,
                      particleArrays: Particle[][],
                      particleParticleCollisionsEnabledProperty: Property<boolean> ) {
    assert && assert( particleArrays.length > 0, `invalid particleArrays: ${particleArrays}` );

    this.container = container;
    this.particleArrays = particleArrays;
    this.particleParticleCollisionsEnabledProperty = particleParticleCollisionsEnabledProperty;

    // Regions are square So this is the length of one side, pm.
    const regionLength = container.height / 4;
    assert && assert( regionLength > 0, `invalid regionLength: ${regionLength}` );
    this.regions = createRegions( container, regionLength );

    this._numberOfParticleContainerCollisions = 0;

    this.mutableVectors = {
      normal: new Vector2( 0, 0 ),
      tangent: new Vector2( 0, 0 ),
      relativeVelocity: new Vector2( 0, 0 ),
      pointOnLine: new Vector2( 0, 0 ),
      reflectedPoint: new Vector2( 0, 0 )
    };
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  public get numberOfParticleContainerCollisions(): number {
    return this._numberOfParticleContainerCollisions;
  }

  /**
   * Clears all regions.
   */
  private clearRegions(): void {
    for ( let i = this.regions.length - 1; i >= 0; i-- ) {
      this.regions[ i ].clear();
    }
  }

  /**
   * Performs collision detection and response for the current state of the particle system.
   */
  public update(): void {

    this.clearRegions();

    // Use regions that intersect the container, since collisions only occur inside the container.
    const containerRegions = _.filter( this.regions,
      region => this.container.bounds.intersectsBounds( region.bounds ) );

    // put particles in regions
    assignParticlesToRegions( this.particleArrays, containerRegions );

    // particle-particle collisions, within each region
    if ( this.particleParticleCollisionsEnabledProperty.value ) {
      for ( let i = containerRegions.length - 1; i >= 0; i-- ) {
        doParticleParticleCollisions( containerRegions[ i ].particles, this.mutableVectors );
      }
    }

    // particle-container collisions
    this._numberOfParticleContainerCollisions = this.updateParticleContainerCollisions();

    // Verify that all particles are fully inside the container.
    assert && assert( this.container.containsParticles( this.particleArrays ),
      'particles have leaked out of the container' );
  }

  /**
   * Detects and handles particle-container collisions for the system.
   * This is overridden by subclass DiffusionCollisionDetector to implement collision detection with the divider
   * that appears in the container in the 'Diffusion' screen.
   * @returns the number of collisions
   */
  protected updateParticleContainerCollisions(): number {
    let numberOfParticleContainerCollisions = 0;
    for ( let i = this.particleArrays.length - 1; i >= 0; i-- ) {
      numberOfParticleContainerCollisions += CollisionDetector.doParticleContainerCollisions( this.particleArrays[ i ],
        this.container.bounds, this.container.leftWallVelocity );
    }
    return numberOfParticleContainerCollisions;
  }

  /**
   * Detects and handles particle-container collisions. These collisions occur if a particle contacted a wall on
   * its way to its current position.
   * @param particles
   * @param containerBounds
   * @param leftWallVelocity - velocity of the container's left (movable) wall
   * @returns number of collisions
   */
  protected static doParticleContainerCollisions( particles: Particle[], containerBounds: Bounds2, leftWallVelocity: Vector2 ): number {

    let numberOfCollisions = 0;

    for ( let i = particles.length - 1; i >= 0; i-- ) {

      const particle = particles[ i ];
      let collided = false;

      // adjust x
      if ( particle.left <= containerBounds.minX ) {
        particle.left = containerBounds.minX;

        // If the left wall is moving, it will do work.
        particle.setVelocityXY( -( particle.velocity.x - leftWallVelocity.x ), particle.velocity.y );
        collided = true;
      }
      else if ( particle.right >= containerBounds.maxX ) {
        particle.right = containerBounds.maxX;
        particle.setVelocityXY( -particle.velocity.x, particle.velocity.y );
        collided = true;
      }

      // adjust y
      if ( particle.top >= containerBounds.maxY ) {
        particle.top = containerBounds.maxY;
        particle.setVelocityXY( particle.velocity.x, -particle.velocity.y );
        collided = true;
      }
      else if ( particle.bottom <= containerBounds.minY ) {
        particle.bottom = containerBounds.minY;
        particle.setVelocityXY( particle.velocity.x, -particle.velocity.y );
        collided = true;
      }

      if ( collided ) {
        numberOfCollisions++;
      }
    }

    return numberOfCollisions;
  }
}

/**
 * Partitions the collision detection bounds into Regions.  Since collisions only occur inside the container,
 * the maximum collision detection bounds is the container at its max width.  This algorithm builds the grid
 * right-to-left, bottom-to-top, so that the grid is aligned with the right and bottom edges of the container.
 * Regions along the top and left edges may be outside the container, and that's OK.  Regions outside the
 * container will be excluded from collision detection.
 * @param container
 * @param regionLength - regions are square, length of one side, in pm
 */
function createRegions( container: BaseContainer, regionLength: number ): Region[] {
  assert && assert( regionLength > 0, `invalid regionLength: ${regionLength}` );

  const regions = [];
  let maxX = container.right;
  while ( maxX > container.right - container.widthRange.max ) {
    const minX = maxX - regionLength;
    let minY = container.bottom;
    while ( minY < container.top ) {
      const maxY = minY + regionLength;
      const regionBounds = new Bounds2( minX, minY, maxX, maxY );
      regions.push( new Region( regionBounds ) );
      minY = minY + regionLength;
    }
    maxX = maxX - regionLength;
  }
  phet.log && phet.log( `created ${regions.length} regions of ${regionLength} pm each` );
  return regions;
}

/**
 * Assigns each particle to the Regions that it intersects, accounting for particle radius.
 */
function assignParticlesToRegions( particleArrays: Particle[][], regions: Region[] ): void {
  assert && assert( regions.length > 0, `invalid regions: ${regions}` );

  for ( let i = particleArrays.length - 1; i >= 0; i-- ) {
    const particles = particleArrays[ i ];
    for ( let j = particles.length - 1; j >= 0; j-- ) {
      const particle = particles[ j ];
      for ( let k = regions.length - 1; k >= 0; k-- ) {
        const region = regions[ k ];
        if ( particle.intersectsBounds( region.bounds ) ) {
          region.addParticle( particle );
        }
      }
    }
  }
}

/**
 * Detects and handles particle-particle collisions. Particle-particle collision are based solely whether they
 * intersect at their current positions. It is possible (and acceptable) for two particles to pass through the
 * same point on the way to those position and not collide.
 */
function doParticleParticleCollisions( particles: Particle[], mutableVectors: MutableVectors ): void {

  for ( let i = particles.length - 1; i >= 1; i-- ) {

    const particle1 = particles[ i ];

    for ( let j = i - 1; j >= 0; j-- ) {

      const particle2 = particles[ j ];
      assert && assert( particle1 !== particle2, 'particle cannot collide with itself' );

      // Ignore collisions if the particles were in contact on the previous step. This results in more
      // natural behavior where the particles enter the container, and was adapted from the Java version.
      if ( !particle1.contactedParticle( particle2 ) && particle1.contactsParticle( particle2 ) ) {

        //-----------------------------------------------------------------------------------------
        // Determine where the particles made contact.
        //-----------------------------------------------------------------------------------------

        const dx = particle1.position.x - particle2.position.x;
        const dy = particle1.position.y - particle2.position.y;
        const contactRatio = particle1.radius / particle1.position.distance( particle2.position );
        const contactPointX = particle1.position.x - dx * contactRatio;
        const contactPointY = particle1.position.y - dy * contactRatio;

        //-----------------------------------------------------------------------------------------
        // Adjust particle positions by reflecting across the line of impact.
        //-----------------------------------------------------------------------------------------

        // Normal vector, aka 'line of impact'
        mutableVectors.normal.setXY( dx, dy ).normalize();

        // Tangent vector, perpendicular to the line of impact, aka 'plane of contact'
        mutableVectors.tangent.setXY( dy, -dx );

        // Angle of the plane of contact
        const lineAngle = Math.atan2( mutableVectors.tangent.y, mutableVectors.tangent.x );

        // Adjust positions
        adjustParticlePosition( particle1, contactPointX, contactPointY, lineAngle,
          mutableVectors.pointOnLine, mutableVectors.reflectedPoint );
        adjustParticlePosition( particle2, contactPointX, contactPointY, lineAngle,
          mutableVectors.pointOnLine, mutableVectors.reflectedPoint );

        //-----------------------------------------------------------------------------------------
        // Adjust particle velocities using impulse-based contact model.
        // See https://en.wikipedia.org/wiki/Collision_response#Impulse-based_contact_model
        //-----------------------------------------------------------------------------------------

        // Compute the impulse, j.
        // There is no angular velocity in our model, so the denominator involves only mass.
        mutableVectors.relativeVelocity.set( particle1.velocity ).subtract( particle2.velocity );
        const vr = mutableVectors.relativeVelocity.dot( mutableVectors.normal );
        const numerator = -vr * ( 1 + e );
        const denominator = ( 1 / particle1.mass + 1 / particle2.mass );
        const j = numerator / denominator;

        adjustParticleSpeed( particle1, j / particle1.mass, mutableVectors.normal );
        adjustParticleSpeed( particle2, -j / particle2.mass, mutableVectors.normal );
      }
    }
  }
}

/**
 * Adjusts the position of a particle in response to a collision with another particle.
 * @param particle
 * @param contactPointX - x coordinate where collision occurred
 * @param contactPointY - y coordinate where collision occurred
 * @param lineAngle - angle of the plane of contact, in radians
 * @param pointOnLine - used to compute a point of line of contact, will be mutated!
 * @param reflectedPoint - used to compute reflected point, will be mutated!
 */
function adjustParticlePosition( particle: Particle, contactPointX: number, contactPointY: number,
                                 lineAngle: number, pointOnLine: Vector2, reflectedPoint: Vector2 ): void {

  const previousDistance = particle.previousPosition.distanceXY( contactPointX, contactPointY );
  const positionRatio = particle.radius / previousDistance;
  pointOnLine.setXY(
    contactPointX - ( contactPointX - particle.previousPosition.x ) * positionRatio,
    contactPointY - ( contactPointY - particle.previousPosition.y ) * positionRatio
  );
  GasPropertiesUtils.reflectPointAcrossLine( particle.position, pointOnLine, lineAngle, reflectedPoint );
  particle.setPositionXY( reflectedPoint.x, reflectedPoint.y );
}

/**
 * Adjusts the speed of a particle in response to a collision with another particle.
 */
function adjustParticleSpeed( particle: Particle, scale: number, normalVector: Vector2 ): void {
  const vx = normalVector.x * scale;
  const vy = normalVector.y * scale;
  particle.setVelocityXY( particle.velocity.x + vx, particle.velocity.y + vy );
}

gasProperties.register( 'CollisionDetector', CollisionDetector );