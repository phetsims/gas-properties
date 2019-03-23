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
  const Bounds2 = require( 'DOT/Bounds2' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const Region = require( 'GAS_PROPERTIES/common/model/Region' );
  const Vector2 = require( 'DOT/Vector2' );

  class CollisionDetector {

    /**
     * @param {IdealModel} model TODO more general type
     * @param {Object} [options]
     */
    constructor( model, options ) {

      options = _.extend( {
        regionLength: 2 // Regions are square, length of one side, nm
      }, options );

      assert && assert( options.regionLength > 0, `invalid regionLength: ${options.regionLength}` );

      // @public (read-only) {Region[]} 2D grid of Regions
      // Partition the collision detection bounds into Regions.
      // This algorithm builds the grid right-to-left, bottom-to-top, so that it's aligned with the right and bottom
      // edges of the container.
      //TODO generalize this or add assertions for assumptions.
      this.regions = [];
      let maxX = model.container.right;
      while ( maxX > model.container.right - model.container.widthRange.max  ) {
        let minY = model.container.bottom;
        while ( minY < model.container.top ) {
          const regionBounds = new Bounds2( maxX - options.regionLength, minY, maxX, minY + options.regionLength );
          this.regions.push( new Region( regionBounds ) );
          minY = minY + options.regionLength;
        }
        maxX = maxX - options.regionLength;
      }
      phet.log && phet.log( `created ${this.regions.length} regions of ${options.regionLength}nm each` );

      // @public (read-only) number of wall collisions on the most recent call to step
      this.numberOfParticleContainerCollisions = 0;

      // @private fields needed by methods
      this.model = model;

      // @private reusable (mutated) vectors
      this.normalVector = new Vector2( 0, 0 );
      this.tangentVector = new Vector2( 0, 0 );
      this.relativeVelocity = new Vector2( 0, 0 );
      this.pointOnLine = new Vector2( 0, 0 );
      this.relectedPoint = new Vector2( 0, 0 );
    }

    /**
     * Handles collision detection and response for one time step.
     * @param {number} dt - time step, in ps
     * @public
     */
    step( dt ) {

      // allow particles to escape from the opening in the top of the container
      if ( this.model.container.openingWidth > 0 ) {
        this.escapeParticles( this.model.heavyParticles, this.model.numberOfHeavyParticlesProperty, this.model.heavyParticlesOutside );
        this.escapeParticles( this.model.lightParticles, this.model.numberOfLightParticlesProperty, this.model.lightParticlesOutside );
      }

      // put particles in regions
      clearRegions( this.regions );
      assignParticlesToRegions( this.model.heavyParticles, this.regions );
      assignParticlesToRegions( this.model.lightParticles, this.regions );

      // detect and handle particle-particle collisions within each region
      for ( let i = 0; i < this.regions.length; i++ ) {
        this.doParticleParticleCollisions( this.regions[ i ].particles );
      }

      // detect and handle particle-container collisions
      this.numberOfParticleContainerCollisions = 0;
      this.numberOfParticleContainerCollisions += doParticleContainerCollisions( this.model.heavyParticles, this.model.container );
      this.numberOfParticleContainerCollisions += doParticleContainerCollisions( this.model.lightParticles, this.model.container );
    }

    /**
     * Identify particles that have escaped via the opening in the top of the container.
     * Move them to the outsideParticles list.
     * @param {Particle[]} particles
     * @param {NumberProperty} numberOfParticlesProperty
     * @param {Particle[]} outsideParticles
     * @private
     */
    escapeParticles( particles, numberOfParticlesProperty, outsideParticles ) {
      const container = this.model.container;
      for ( let i = 0; i < particles.length; i++ ) {
        const particle = particles[ i ];
        if ( particle.top > container.top &&
             particle.left > container.openingLeft &&
             particle.right < container.openingRight ) {
          particles.splice( particles.indexOf( particle ), 1 );
          numberOfParticlesProperty.value--;
          outsideParticles.push( particle );
        }
      }
    }

    /**
     * Detects and handles particle-particle collisions.
     * @param {Particle[]} particles
     * @private
     */
    doParticleParticleCollisions( particles ) {
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
            this.normalVector.setXY( dx, dy ).normalize();

            // Tangent vector, perpendicular to the line of impact, aka 'plane of contact'
            this.tangentVector.setXY( dy, -dx );

            // Angle of the plane of contact
            const lineAngle =  Math.atan2( this.tangentVector.y, this.tangentVector.x );

            // Adjust location of particle1
            const previousDistance1 = particle1.previousLocation.distanceXY( contactPointX, contactPointY );
            const locationRatio1 = particle1.radius / previousDistance1;
            this.pointOnLine.setXY(
              contactPointX - ( contactPointX - particle1.previousLocation.x ) * locationRatio1,
              contactPointY - ( contactPointY - particle1.previousLocation.y ) * locationRatio1
            );
            reflectPointAcrossLine( particle1.location, this.pointOnLine, lineAngle, this.relectedPoint );
            particle1.setLocationXY( this.relectedPoint.x, this.relectedPoint.y );

            //TODO in Java version, particle2 algorithm was very different than particle1. Does making them same cause any problems?
            // Adjust location of particle2
            const previousDistance2 = particle2.previousLocation.distanceXY( contactPointX, contactPointY );
            const locationRatio2 = particle2.radius / previousDistance2;
            this.pointOnLine.setXY(
              contactPointX - ( contactPointX - particle2.previousLocation.x ) * locationRatio2,
              contactPointY - ( contactPointY - particle2.previousLocation.y ) * locationRatio2
            );
            reflectPointAcrossLine( particle2.location, this.pointOnLine, lineAngle, this.relectedPoint );
            particle2.setLocationXY( this.relectedPoint.x, this.relectedPoint.y );

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
            this.relativeVelocity.set( particle1.velocity ).subtract( particle2.velocity );
            const vr = this.relativeVelocity.dot( this.normalVector );
            const numerator = -vr * ( 1 + e );
            const denominator = ( 1 / particle1.mass + 1 / particle2.mass );
            const j = numerator / denominator;

            const vScale1 = j / particle1.mass;
            const vx1 = this.normalVector.x * vScale1;
            const vy1 = this.normalVector.y * vScale1;
            particle1.setVelocityXY( particle1.velocity.x + vx1, particle1.velocity.y + vy1 );

            const vScale2 = -j / particle2.mass;
            const vx2 = this.normalVector.x * vScale2;
            const vy2 = this.normalVector.y * vScale2;
            particle2.setVelocityXY( particle2.velocity.x + vx2, particle2.velocity.y + vy2 );
          }
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
   * Detects and handles particle-container collisions.
   * Handles x and y directions separately in case a particle hits the container diagonally at a corner.
   * @param {Particle[]} particles
   * @param {Container} container
   * @returns {number} number of collisions
   */
  function doParticleContainerCollisions( particles, container ) {
    let numberOfCollisions = 0;
    for ( let i = 0; i < particles.length; i++ ) {

      const particle = particles[ i ];
      let collided = false;

      // adjust x
      if ( particle.left <= container.left ) {
        particle.left = container.left;
        particle.invertDirectionX();
        collided = true;
        //TODO handle kinetic energy if the left wall is moving
      }
      else if ( particle.right >= container.right ) {
        particle.right = container.right;
        particle.invertDirectionX();
        collided = true;
      }

      // adjust y
      if ( particle.top >= container.top ) {
        //TODO handle opening in top of container
        particle.top = container.top;
        particle.invertDirectionY();
        collided = true;
      }
      else if ( particle.bottom <= container.bottom ) {
        particle.bottom = container.bottom;
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