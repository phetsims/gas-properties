// Copyright 2019, University of Colorado Boulder

/**
 * Handles collision detection and response. Our collision model involves rigid bodies. It is a perfectly elastic
 * collision model, where there is no net loss of kinetic energy.
 *
 * References:
 * https://en.wikipedia.org/wiki/Collision_detection
 * https://en.wikipedia.org/wiki/Collision_response
 * https://en.wikipedia.org/wiki/Elastic_collision
 * https://en.wikipedia.org/wiki/Collision_response#Impulse-based_contact_model
 * https://en.wikipedia.org/wiki/Coefficient_of_restitution
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const Region = require( 'GAS_PROPERTIES/common/model/Region' );
  const Vector2 = require( 'DOT/Vector2' );

  class CollisionDetector {

    /**
     * @param {Container} container
     * @param {Particle[][]} particleArrays
     * @param {Object} [options]
     */
    constructor( container, particleArrays, options ) {

      options = _.extend( {
        regionLength: 1 // Regions are square, length of one side, nm
      }, options );

      assert && assert( options.regionLength > 0, `invalid regionLength: ${options.regionLength}` );

      // @public (read-only) {Region[]} 2D grid of Regions
      // Partition the collision detection bounds into Regions.
      // This algorithm builds the grid right-to-left, bottom-to-top, so that it's aligned with the right and bottom
      // edges of the container.
      //TODO generalize this or add assertions for assumptions.
      //TODO make this cover inside of box and recreate when box width changes?
      this.regions = [];
      let maxX = container.right;
      while ( maxX > container.right - container.widthRange.max ) {
        let minY = container.bottom;
        while ( minY < container.top ) {
          const regionBounds = new Bounds2( maxX - options.regionLength, minY, maxX, minY + options.regionLength );
          this.regions.push( new Region( regionBounds ) );
          minY = minY + options.regionLength;
        }
        maxX = maxX - options.regionLength;
      }
      phet.log && phet.log( `created ${this.regions.length} regions of ${options.regionLength}nm each` );

      // @public (read-only) number of wall collisions on the most recent call to step
      this.numberOfParticleContainerCollisions = 0;

      // @public determines whether particle-particle collisions occur
      this.particleParticleCollisionsEnabledProperty = new BooleanProperty( true );

      // @private mutable vectors, reused in critical code
      this.mutableVectors = {
        normal: new Vector2( 0, 0 ),
        tangent: new Vector2( 0, 0 ),
        relativeVelocity: new Vector2( 0, 0 ),
        pointOnLine: new Vector2( 0, 0 ),
        reflectedPoint: new Vector2( 0, 0 )
      };

      // @private fields needed by methods
      this.container = container;
      this.particleArrays = particleArrays;
    }

    // @public
    reset() {
      this.particleParticleCollisionsEnabledProperty.reset();
    }

    /**
     * Handles collision detection and response for one time step.
     * @param {number} dt - time step, in ps
     * @public
     */
    step( dt ) {

      // put particles in regions
      clearRegions( this.regions );
      for ( let i = 0; i < this.particleArrays.length; i++ ) {
        assignParticlesToRegions( this.particleArrays[ i ], this.regions );
      }

      // particle-particle collisions, within each region
      if ( this.particleParticleCollisionsEnabledProperty.value ) {
        for ( let i = 0; i < this.regions.length; i++ ) {
          doParticleParticleCollisions( this.regions[ i ].particles, this.mutableVectors );
        }
      }

      //TODO hasDivider case is a temporary hack
      // particle-container collisions
      this.numberOfParticleContainerCollisions = 0;
      if ( this.container.hasDividerProperty && this.container.hasDividerProperty.value ) {

        // If there is a divider, use bounds for subsets of the container
        this.numberOfParticleContainerCollisions += doParticleContainerCollisions( this.particleArrays[ 0 ], this.container.leftBounds );
        this.numberOfParticleContainerCollisions += doParticleContainerCollisions( this.particleArrays[ 1 ], this.container.rightBounds );
      }
      else {

        // If there is no divider, use bounds of the entire container
        for ( let i = 0; i < this.particleArrays.length; i++ ) {
          this.numberOfParticleContainerCollisions += doParticleContainerCollisions( this.particleArrays[ i ], this.container.bounds );
        }
      }
    }
  }

  /**
   * Clears all regions.
   * @param {Region[]} regions
   */
  function clearRegions( regions ) {
    for ( let i = 0; i < regions.length; i++ ) {
      regions[ i ].clear();
    }
  }

  /**
   * Assigns each particle to the Regions that it intersects.
   * @param {Particle[]} particles
   * @param {Region[]} regions
   */
  function assignParticlesToRegions( particles, regions ) {
    for ( let i = 0; i < particles.length; i++ ) {
      for ( let j = 0; j < regions.length; j++ ) {
        if ( particles[ i ].intersectsBounds( regions[ j ].bounds ) ) {
          regions[ j ].addParticle( particles[ i ] );
        }
      }
    }
  }

  /**
   * Determines the position of a point that is the reflection of a specified point across a line.
   * @param {Vector2} p - the point to reflect
   * @param {Vector2} pointOnLine - point on the line
   * @param {number} lineAngle - angle of the line, in radians
   * @param {Vector2} reflectedPoint - the point to be mutated with the return value
   * @returns {Vector2} reflectedPoint mutated
   */
  function reflectPointAcrossLine( p, pointOnLine, lineAngle, reflectedPoint ) {
    const alpha = lineAngle % ( Math.PI * 2 );
    const gamma = Math.atan2( ( p.y - pointOnLine.y ), ( p.x - pointOnLine.x ) ) % ( Math.PI * 2 );
    const theta = ( 2 * alpha - gamma ) % ( Math.PI * 2 );
    const d = p.distance( pointOnLine );
    reflectedPoint.setXY( pointOnLine.x + d * Math.cos( theta ), pointOnLine.y + d * Math.sin( theta ) );
    return reflectedPoint;
  }

  /**
   * Detects and handles particle-particle collisions.
   * @param {Particle[]} particles
   * @param {*} mutableVectors - collection of mutable vectors, see this.mutableVectors in CollisionDetector constructor
   * @private
   */
  function doParticleParticleCollisions( particles, mutableVectors ) {
    for ( let i = 0; i < particles.length - 1; i++ ) {

      const particle1 = particles[ i ];

      for ( let j = i + 1; j < particles.length; j++ ) {

        const particle2 = particles[ j ];
        assert && assert( particle1 !== particle2, 'particle cannot collide with itself' );

        // Ignore collisions if the particles were in contact on the previous step.
        // This results in more natural behavior, and was adopted from the Java version.
        if ( !particle1.contactedParticle( particle2 ) && particle1.contactsParticle( particle2 ) ) {

          //-----------------------------------------------------------------------------------------
          // Determine where the particles made contact.
          //-----------------------------------------------------------------------------------------

          const dx = particle1.location.x - particle2.location.x;
          const dy = particle1.location.y - particle2.location.y;
          const contactRatio = particle1.radius / particle1.location.distance( particle2.location );
          const contactPointX = particle1.location.x - dx * contactRatio;
          const contactPointY = particle1.location.y - dy * contactRatio;

          //-----------------------------------------------------------------------------------------
          // Adjust particle locations by reflecting across the line of impact.
          //-----------------------------------------------------------------------------------------

          // Normal vector, aka 'line of impact'
          mutableVectors.normal.setXY( dx, dy ).normalize();

          // Tangent vector, perpendicular to the line of impact, aka 'plane of contact'
          mutableVectors.tangent.setXY( dy, -dx );

          // Angle of the plane of contact
          const lineAngle = Math.atan2( mutableVectors.tangent.y, mutableVectors.tangent.x );

          // Adjust location of particle1
          const previousDistance1 = particle1.previousLocation.distanceXY( contactPointX, contactPointY );
          const locationRatio1 = particle1.radius / previousDistance1;
          mutableVectors.pointOnLine.setXY(
            contactPointX - ( contactPointX - particle1.previousLocation.x ) * locationRatio1,
            contactPointY - ( contactPointY - particle1.previousLocation.y ) * locationRatio1
          );
          reflectPointAcrossLine( particle1.location, mutableVectors.pointOnLine, lineAngle, mutableVectors.reflectedPoint );
          particle1.setLocationXY( mutableVectors.reflectedPoint.x, mutableVectors.reflectedPoint.y );

          //TODO in Java version, particle2 algorithm was very different than particle1. Does making them same cause any problems?
          // Adjust location of particle2
          const previousDistance2 = particle2.previousLocation.distanceXY( contactPointX, contactPointY );
          const locationRatio2 = particle2.radius / previousDistance2;
          mutableVectors.pointOnLine.setXY(
            contactPointX - ( contactPointX - particle2.previousLocation.x ) * locationRatio2,
            contactPointY - ( contactPointY - particle2.previousLocation.y ) * locationRatio2
          );
          reflectPointAcrossLine( particle2.location, mutableVectors.pointOnLine, lineAngle, mutableVectors.reflectedPoint );
          particle2.setLocationXY( mutableVectors.reflectedPoint.x, mutableVectors.reflectedPoint.y );

          //-----------------------------------------------------------------------------------------
          // Adjust particle velocities using impulse-based contact model.
          // See https://en.wikipedia.org/wiki/Collision_response#Impulse-based_contact_model
          //-----------------------------------------------------------------------------------------

          // Coefficient of restitution (e) is the ratio of the final to initial relative velocity between two objects
          // after they collide. It normally ranges from 0 to 1 where 1 is a perfectly elastic collision.
          // See https://en.wikipedia.org/wiki/Coefficient_of_restitution
          const e = 1;

          // Compute the impulse, j.
          // There is no angular velocity in our model, so the denominator involves only mass.
          mutableVectors.relativeVelocity.set( particle1.velocity ).subtract( particle2.velocity );
          const vr = mutableVectors.relativeVelocity.dot( mutableVectors.normal );
          const numerator = -vr * ( 1 + e );
          const denominator = ( 1 / particle1.mass + 1 / particle2.mass );
          const j = numerator / denominator;

          const vScale1 = j / particle1.mass;
          const vx1 = mutableVectors.normal.x * vScale1;
          const vy1 = mutableVectors.normal.y * vScale1;
          particle1.setVelocityXY( particle1.velocity.x + vx1, particle1.velocity.y + vy1 );

          const vScale2 = -j / particle2.mass;
          const vx2 = mutableVectors.normal.x * vScale2;
          const vy2 = mutableVectors.normal.y * vScale2;
          particle2.setVelocityXY( particle2.velocity.x + vx2, particle2.velocity.y + vy2 );
        }
      }
    }
  }

  /**
   * Detects and handles particle-container collisions.
   * Handles x and y directions separately in case a particle hits the container diagonally at a corner.
   * @param {Particle[]} particles
   * @param {Bounds2} containerBounds
   * @returns {number} number of collisions
   */
  function doParticleContainerCollisions( particles, containerBounds ) {
    let numberOfCollisions = 0;
    for ( let i = 0; i < particles.length; i++ ) {

      const particle = particles[ i ];
      let collided = false;

      // adjust x
      if ( particle.left <= containerBounds.minX ) {
        particle.left = containerBounds.minX;
        particle.invertDirectionX();
        collided = true;
        //TODO handle kinetic energy if the left wall is moving
      }
      else if ( particle.right >= containerBounds.maxX ) {
        particle.right = containerBounds.maxX;
        particle.invertDirectionX();
        collided = true;
      }

      // adjust y
      if ( particle.top >= containerBounds.maxY ) {
        particle.top = containerBounds.maxY;
        particle.invertDirectionY();
        collided = true;
      }
      else if ( particle.bottom <= containerBounds.minY ) {
        particle.bottom = containerBounds.minY;
        particle.invertDirectionY();
        collided = true;
      }

      if ( collided ) {
        numberOfCollisions++;
      }
    }
    return numberOfCollisions;
  }

  return gasProperties.register( 'CollisionDetector', CollisionDetector );
} );