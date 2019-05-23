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
  const BaseContainer = require( 'GAS_PROPERTIES/common/model/BaseContainer' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const Region = require( 'GAS_PROPERTIES/common/model/Region' );
  const Vector2 = require( 'DOT/Vector2' );

  class CollisionDetector {

    /**
     * @param {BaseContainer} container
     * @param {Particle[][]} particleArrays
     * @param {Object} [options]
     */
    constructor( container, particleArrays, options ) {
      assert && assert( container instanceof BaseContainer, `invalid container: ${container}` );
      assert && assert( Array.isArray( particleArrays ), `invalid particleArrays: ${particleArrays}` );

      options = _.extend( {

        // {number|null} Regions are square, length of one side, pm. If null, default will be set below.
        regionLength: null

      }, options );

      // If regionLength is not provided, the default is based on container height.
      const regionLength = options.regionLength || container.height / 4;
      assert && assert( regionLength > 0, `invalid regionLength: ${regionLength}` );

      // @public (read-only) {Region[]} 2D grid of Regions
      this.regions = createRegions( container, regionLength );

      // @public (read-only) number of wall collisions on the most recent call to step.
      // This is used to delay pressure computation until at least 1 particle has collided with the container.
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

      // @private
      this.container = container;
      this.particleArrays = particleArrays;
      this.numberOfParticleContainerCollisions = 0;
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
      assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );

      clearRegions( this.regions );

      // Use regions that intersect the container, since collisions only occur inside the container.
      const containerRegions = _.filter( this.regions, region => this.container.bounds.intersectsBounds( region.bounds ) );

      // put particles in regions
      for ( let i = 0; i < this.particleArrays.length; i++ ) {
        assignParticlesToRegions( this.particleArrays[ i ], containerRegions );
      }

      // particle-particle collisions, within each region
      if ( this.particleParticleCollisionsEnabledProperty.value ) {
        for ( let i = 0; i < containerRegions.length; i++ ) {
          doParticleParticleCollisions( containerRegions[ i ].particles, this.mutableVectors );
        }
      }

      // particle-container collisions
      this.numberOfParticleContainerCollisions = this.stepParticleContainerCollisions( dt );

      // Verify that particles are fully inside in the container.
      assert && assertParticlesInsideContainer( this.container, this.particleArrays );
    }

    /**
     * Detects and handles particle-container collisions for the system for one time step.
     * @param {number} dt
     * @returns {number} the number of collisions
     * @protected
     */
    stepParticleContainerCollisions( dt ) {
      let numberOfParticleContainerCollisions = 0;
      for ( let i = 0; i < this.particleArrays.length; i++ ) {
        numberOfParticleContainerCollisions +=
          doParticleContainerCollisions( this.particleArrays[ i ], this.container.bounds, this.container.leftWallVelocity );
      }
      return numberOfParticleContainerCollisions;
    }
  }

  /**
   * Partitions the collision detection bounds into Regions.  Since collisions only occur inside the container,
   * the maximum collision detection bounds is the container at its max width.  This algorithm builds the grid
   * right-to-left, bottom-to-top, so that it's aligned with the right and bottom edges of the container.
   * Regions along the top and left edges may be outside the container, and that's OK.
   * @param {BaseContainer} container
   * @param {number} regionLength - regions are square, length of one side, in pm
   * @returns {Region[]}
   */
  function createRegions( container, regionLength ) {
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
   * Clears all regions.
   * @param {Region[]} regions
   */
  function clearRegions( regions ) {
    for ( let i = 0; i < regions.length; i++ ) {
      regions[ i ].clear();
    }
  }

  /**
   * Assigns each particle to the Regions that it intersects, accounting for particle radius.
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
   * @param {Vector2} leftWallVelocity - velocity of the container's left (movable) wall
   * @returns {number} number of collisions
   */
  function doParticleContainerCollisions( particles, containerBounds, leftWallVelocity ) {

    let numberOfCollisions = 0;
    for ( let i = 0; i < particles.length; i++ ) {

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

  /**
   * Verifies that all particles are fully inside the container.
   * @param {Particle[][]} particleArrays
   * @param {BaseContainer} container
   */
  function assertParticlesInsideContainer( container, particleArrays ) {
    for ( let i = 0; i < particleArrays.length; i++ ) {
      const particles = particleArrays[ i ];
      for ( let j = 0; j < particles.length; j++ ) {
        const particle = particles[ j ];
        assert && assert( container.containsParticle( particle ),
          `container does not enclose particle: ${particle.toString()}, container bounds: ${container.bounds}` );
      }
    }
  }

  // @protected
  CollisionDetector.doParticleContainerCollisions = doParticleContainerCollisions;

  return gasProperties.register( 'CollisionDetector', CollisionDetector );
} );