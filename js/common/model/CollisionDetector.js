// Copyright 2019, University of Colorado Boulder

/**
 * CollisionDetector handles collision detection and response for all screens. Our collision model involves
 * rigid bodies. It is a perfectly-elastic collision model, where there is no net loss of kinetic energy.
 *
 * The algorithms for particle-particle collisions and particle-container collisions were adapted from the Java
 * implementation of Gas Properties. They differs from the standard rigid-body collision model as described in (e.g.)
 * http://web.mst.edu/~reflori/be150/Dyn%20Lecture%20Videos/Impact%20Particles%201/Impact%20Particles%201.pdf.
 * For historical background on how the Java implementation informed this implementation, see:
 * https://github.com/phetsims/gas-properties/issues/37
 * https://github.com/phetsims/gas-properties/issues/40
 *
 * While code comments attempt to describe this implementation clearly, fully understanding the implementation may
 * require some general backgriound in collisions detection and response. Some useful references include:
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
  const GasPropertiesUtils = require( 'GAS_PROPERTIES/common/GasPropertiesUtils' );
  const Particle = require( 'GAS_PROPERTIES/common/model/Particle' );
  const Region = require( 'GAS_PROPERTIES/common/model/Region' );
  const Vector2 = require( 'DOT/Vector2' );

  class CollisionDetector {

    /**
     * @param {BaseContainer} container - the container inside which collision occur
     * @param {Particle[][]} particleArrays - collections of particles inside the container
     * @param {BooleanProperty} particleParticleCollisionsEnabledProperty - whether particle-particle collisions occur
     * @param {Object} [options]
     */
    constructor( container, particleArrays, particleParticleCollisionsEnabledProperty, options ) {
      assert && assert( container instanceof BaseContainer, `invalid container: ${container}` );
      assert && assert( particleParticleCollisionsEnabledProperty instanceof BooleanProperty,
        `invalid particleParticleCollisionsEnabledProperty: ${particleParticleCollisionsEnabledProperty}` );
      assert && assert( Array.isArray( particleArrays ) && particleArrays.length > 0,
        `invalid particleArrays: ${particleArrays}` );

      options = _.extend( {

        // {number|null} Regions are square, length of one side, pm. If null, default will be set below.
        regionLength: null

      }, options );

      // If regionLength is not provided, the default is based on container height.
      const regionLength = options.regionLength || container.height / 4;
      assert && assert( regionLength > 0, `invalid regionLength: ${regionLength}` );

      // @private
      this.particleParticleCollisionsEnabledProperty = particleParticleCollisionsEnabledProperty;

      // @public (read-only) {Region[]} 2D grid of Regions
      this.regions = createRegions( container, regionLength );

      // @public (read-only) number of wall collisions on the most recent call to update
      this.numberOfParticleContainerCollisions = 0;

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

    /**
     * Clears all regions.
     * @private
     */
    clearRegions() {
      for ( let i = 0; i < this.regions.length; i++ ) {
        this.regions[ i ].clear();
      }
    }

    /**
     * Performs collision detection and response for the current state of the particle system.
     * @public
     */
    update() {

      this.clearRegions();

      // Use regions that intersect the container, since collisions only occur inside the container.
      const containerRegions = _.filter( this.regions,
        region => this.container.bounds.intersectsBounds( region.bounds ) );

      // put particles in regions
      assignParticlesToRegions( this.particleArrays, containerRegions );

      // particle-particle collisions, within each region
      if ( this.particleParticleCollisionsEnabledProperty.value ) {
        for ( let i = 0; i < containerRegions.length; i++ ) {
          doParticleParticleCollisions( containerRegions[ i ].particles, this.mutableVectors );
        }
      }

      // particle-container collisions
      this.numberOfParticleContainerCollisions = this.updateParticleContainerCollisions();

      // Verify that all particles are fully inside the container.
      assert && assert( this.container.containsParticles( this.particleArrays ),
        'particles have leaked out of the container' );
    }

    /**
     * Detects and handles particle-container collisions for the system.
     * This is overridden by subclass DiffusionCollisionDetector to implement collision detection with the divider
     * that appears in the container in the 'Diffusion' screen.
     * @returns {number} the number of collisions
     * @protected
     */
    updateParticleContainerCollisions() {
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
   * right-to-left, bottom-to-top, so that the grid is aligned with the right and bottom edges of the container.
   * Regions along the top and left edges may be outside the container, and that's OK.  Regions outside the
   * container will be excluded from collision detection.
   * @param {BaseContainer} container
   * @param {number} regionLength - regions are square, length of one side, in pm
   * @returns {Region[]}
   */
  function createRegions( container, regionLength ) {
    assert && assert( container instanceof BaseContainer, `invalid container: ${container}` );
    assert && assert( typeof regionLength === 'number' && regionLength > 0, `invalid regionLength: ${regionLength}` );

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
   * @param {Particle[]} particleArrays - collections of particles
   * @param {Region[]} regions
   */
  function assignParticlesToRegions( particleArrays, regions ) {
    assert && assert( Array.isArray( particleArrays ), `invalid particleArrays: ${particleArrays}` );
    assert && assert( Array.isArray( regions ) && regions.length > 0, `invalid regions: ${regions}` );

    for ( let i = 0; i < particleArrays.length; i++ ) {
      const particles = particleArrays[ i ];
      for ( let j = 0; j < particles.length; j++ ) {
        const particle = particles[ j ];
        for ( let k = 0; k < regions.length; k++ ) {
          const region = regions[ k ];
          if ( particle.intersectsBounds( region.bounds ) ) {
            region.addParticle( particle );
          }
        }
      }
    }
  }

  /**
   * Detects and handles particle-particle collisions.
   * @param {Particle[]} particles
   * @param {*} mutableVectors - collection of mutable vectors, see this.mutableVectors in CollisionDetector constructor
   */
  function doParticleParticleCollisions( particles, mutableVectors ) {
    assert && assert( Array.isArray( particles ), `invalid particles: ${particles}` );

    for ( let i = 0; i < particles.length - 1; i++ ) {

      const particle1 = particles[ i ];

      for ( let j = i + 1; j < particles.length; j++ ) {

        const particle2 = particles[ j ];
        assert && assert( particle1 !== particle2, 'particle cannot collide with itself' );

        // Ignore collisions if the particles were in contact on the previous step. This results in more
        // natural behavior where the particles enter the container, and was adapted from the Java version.
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

          // Adjust locations
          adjustParticleLocation( particle1, contactPointX, contactPointY, lineAngle,
            mutableVectors.pointOnLine, mutableVectors.reflectedPoint );
          adjustParticleLocation( particle2, contactPointX, contactPointY, lineAngle,
            mutableVectors.pointOnLine, mutableVectors.reflectedPoint );

          //-----------------------------------------------------------------------------------------
          // Adjust particle velocities using impulse-based contact model.
          // See https://en.wikipedia.org/wiki/Collision_response#Impulse-based_contact_model
          //-----------------------------------------------------------------------------------------

          // Coefficient of restitution (e) is the ratio of the final to initial relative velocity between two objects
          // after they collide. It normally ranges from 0 to 1, where 1 is a perfectly elastic collision.
          // See https://en.wikipedia.org/wiki/Coefficient_of_restitution
          const e = 1;

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
   * Adjusts the location of a particle in response to a collision with another particle.
   * @param {Particle} particle
   * @param {number} contactPointX - x coordinate where collision occurred
   * @param {number} contactPointY - y coordinate where collision occurred
   * @param {number} lineAngle - angle of the plane of contact, in radians
   * @param {Vector2} pointOnLine - used to compute a point of line of contact, will be mutated!
   * @param {Vector2} reflectedPoint - used to compute reflected point, will be mutated!
   */
  function adjustParticleLocation( particle, contactPointX, contactPointY, lineAngle, pointOnLine, reflectedPoint ) {
    assert && assert( particle instanceof Particle, `invalid particle: ${particle}` );
    assert && assert( typeof contactPointX === 'number', `invalid contactPointX: ${contactPointX}` );
    assert && assert( typeof contactPointY === 'number', `invalid contactPointY: ${contactPointY}` );
    assert && assert( typeof lineAngle === 'number', `invalid lineAngle: ${lineAngle}` );
    assert && assert( pointOnLine instanceof Vector2, `invalid pointOnLine: ${pointOnLine}` );
    assert && assert( reflectedPoint instanceof Vector2, `invalid reflectedPoint: ${reflectedPoint}` );

    const previousDistance = particle.previousLocation.distanceXY( contactPointX, contactPointY );
    const locationRatio = particle.radius / previousDistance;
    pointOnLine.setXY(
      contactPointX - ( contactPointX - particle.previousLocation.x ) * locationRatio,
      contactPointY - ( contactPointY - particle.previousLocation.y ) * locationRatio
    );
    GasPropertiesUtils.reflectPointAcrossLine( particle.location, pointOnLine, lineAngle, reflectedPoint );
    particle.setLocationXY( reflectedPoint.x, reflectedPoint.y );
  }

  /**
   * Adjusts the speed of a particle in response to a collision with another particle.
   * @param {Particle} particle
   * @param {number} scale
   * @param {Vector2} normalVector
   */
  function adjustParticleSpeed( particle, scale, normalVector ) {
    assert && assert( particle instanceof Particle, `invalid particle: ${particle}` );
    assert && assert( typeof scale === 'number', `invalid scale: ${scale}` );
    assert && assert( normalVector instanceof Vector2, `invalid normalVector: ${normalVector}` );

    const vx = normalVector.x * scale;
    const vy = normalVector.y * scale;
    particle.setVelocityXY( particle.velocity.x + vx, particle.velocity.y + vy );
  }

  /**
   * Detects and handles particle-container collisions.
   * @param {Particle[]} particles
   * @param {Bounds2} containerBounds
   * @param {Vector2} leftWallVelocity - velocity of the container's left (movable) wall
   * @returns {number} number of collisions
   */
  function doParticleContainerCollisions( particles, containerBounds, leftWallVelocity ) {
    assert && assert( Array.isArray( particles ), `invalid particles: ${particles}` );
    assert && assert( containerBounds instanceof Bounds2, `invalid containerBounds: ${containerBounds}` );
    assert && assert( leftWallVelocity instanceof Vector2, `invalid leftWallVelocity: ${leftWallVelocity}` );

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

  // @protected for uses in subclasses
  CollisionDetector.doParticleContainerCollisions = doParticleContainerCollisions;

  return gasProperties.register( 'CollisionDetector', CollisionDetector );
} );