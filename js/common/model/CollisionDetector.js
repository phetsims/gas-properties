// Copyright 2019, University of Colorado Boulder

/**
 * Handles collision detection and response.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const Property = require( 'AXON/Property' );
  const Region = require( 'GAS_PROPERTIES/common/model/Region' );
  const Vector2 = require( 'DOT/Vector2' );

  class CollisionDetector {

    /**
     * @param {IdealModel} model TODO more general type
     * @param {Object} [options]
     */
    constructor( model, options ) {

      options = _.extend( {
        regionLength: 2, // Regions are square, length of one side, nm

        //TODO this should probably be max particle radius
        regionOverlap: 0.125 // overlap of Regions, in nm
      }, options );

      assert && assert( options.regionLength > 0, `invalid regionLength: ${options.regionLength}` );
      assert && assert( options.regionOverlap >= 0, `invalid regionOverlap: ${options.regionOverlap}` );
      assert && assert( options.regionOverlap < options.regionLength / 2,
        `regionOverlap ${options.regionOverlap} is incompatible with regionLength ${options.regionLength}` );

      // @public {Property.<Bounds2>} collision detection bounds
      this.particleBoundsProperty = model.particleBoundsProperty;

      //TODO do we need separate grids for inside vs outside the container?
      // @public (read-only) {Property.<Region[]>} 2D grid of Regions
      this.regionsProperty = new Property( [] );

      // Partition the collision detection bounds into overlapping Regions.
      // This algorithm builds the grid right-to-left, bottom-to-top, so that it's aligned with the right and bottom
      // edges of the container.
      //TODO generalize this or add assertions for assumptions.
      this.particleBoundsProperty.link( bounds => {

        clearRegions( this.regionsProperty.value );

        const regions = []; // {Region[]}
        let maxX = bounds.maxX;
        while ( maxX > bounds.minX ) {
          let minY = bounds.minY;
          while ( minY < bounds.maxY ) {
            const regionBounds = new Bounds2( maxX - options.regionLength, minY, maxX, minY + options.regionLength );
            regions.push( new Region( regionBounds ) );
            minY = minY + options.regionLength - options.regionOverlap;
          }
          maxX = maxX - options.regionLength + options.regionOverlap;
        }

        this.regionsProperty.value = regions;

        phet.log && phet.log( `created ${regions.length} regions of ${options.regionLength}nm each, with ${options.regionOverlap}nm overlap` );
      } );

      // @private fields needed by methods
      this.model = model;

      // @private reusable (mutated) vectors
      this.normalVector = new Vector2( 0, 0 );
      this.relativeVelocity = new Vector2( 0, 0 );
      this.tangentVector = new Vector2( 0, 0 );
      this.linePoint = new Vector2( 0, 0 );
      this.relectedPoint = new Vector2( 0, 0 );
    }

    /**
     * @param {number} dt - time delta, in seconds
     * @public
     */
    step( dt ) {

      const regions = this.regionsProperty.value;

      // put particles in regions
      clearRegions( regions );
      assignParticlesToRegions( this.model.heavyParticles, regions );
      assignParticlesToRegions( this.model.lightParticles, regions );

      // detect and handle particle-particle collisions within each region
      for ( let i = 0; i < regions.length; i++ ) {
        this.doParticleParticleCollisions( regions[ i ].particles );
      }

      // detect and handle particle-container collisions
      doParticleContainerCollisions( this.model.heavyParticles, this.model.container );
      doParticleContainerCollisions( this.model.lightParticles, this.model.container );
    }

    //TODO Java - understand this, document it, clean it up
    //TODO Java - what do abbreviations stand for? s1, s2, linePoint, CM
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

          if ( !particle1.contactedParticle( particle2 ) && particle1.contactsParticle( particle2 ) ) {

            const dx = particle1.location.x - particle2.location.x;
            const dy = particle1.location.y - particle2.location.y;
            const distance = Math.sqrt( dx * dx + dy * dy );

            const ratio = particle1.radius / distance;
            const contactPointX = particle1.location.x + ( particle2.location.x - particle1.location.x ) * ratio;
            const contactPointY = particle1.location.y + ( particle2.location.y - particle1.location.y ) * ratio;

            // Get the unit vector along the line of action
            this.normalVector.setXY( dx, dy ).normalize();

            // If the relative velocity show the points moving apart, then there is no collision.
            // This is a key check to solve otherwise sticky collision problems
            this.relativeVelocity.set( particle1.velocity ).subtract( particle2.velocity );

            // Compute correct position of the bodies following the collision
            this.tangentVector.setXY( dy, -dx );

            // Determine the proper positions of the bodies following the collision
            const offset2 = ( particle2.previousLocation.distance( particle1.previousLocation ) < particle1.radius ) ?
                            -particle2.radius : particle2.radius;
            const offsetX2 = this.normalVector.x * offset2;
            const offsetY2 = this.normalVector.y * offset2;
            this.linePoint.setXY( contactPointX - offsetX2, contactPointY - offsetY2 );

            const lineAngle = Math.atan2( this.tangentVector.y, this.tangentVector.x );
            reflectPointAcrossLine( particle2.location, this.linePoint, lineAngle, this.relectedPoint );
            particle2.setLocation( this.relectedPoint.x, this.relectedPoint.y );

            // TODO Java says: The determination of the sign of the offset is wrong. It should be based on which side of the contact
            // tangent the CM was on in its previous position
            const previousDistance1 = particle1.previousLocation.distanceXY( contactPointX, contactPointY );
            const s1 = particle1.radius / previousDistance1;
            this.linePoint.setXY(
              contactPointX - ( contactPointX - particle1.previousLocation.x ) * s1,
              contactPointY - ( contactPointY - particle1.previousLocation.y ) * s1
            );
            reflectPointAcrossLine( particle1.location, this.linePoint, lineAngle, this.relectedPoint );
            particle1.setLocation( this.relectedPoint.x, this.relectedPoint.y );

            // Compute the relative velocities of the contact points
            const vr = this.relativeVelocity.dot( this.normalVector );

            // Assume the coefficient of restitution is 1
            const e = 1;

            //TODO show general form of this equation, add to model.md
            // Compute the impulse, j
            const numerator = -vr * ( 1 + e );
            const denominator = ( 1 / particle1.mass + 1 / particle2.mass );
            const j = numerator / denominator;

            // Compute the new velocities, based on the impulse
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
        if ( regions[ j ].intersectsParticle( particles[ i ] ) ) {
          regions[ j ].addParticle( particles[ i ] );
        }
      }
    }
  }

  /**
   * Determines the position of a point that is the reflection of a specified point across a line.
   * @param {Vector2} p
   * @param {Vector2} pointOnLine
   * @param {number} lineAngle angle of line in radians
   * @param {Vector2} returnPoint the point to be mutated with the return value
   * @returns {Vector2} returnPoint mutated
   */
  function reflectPointAcrossLine( p, pointOnLine, lineAngle, returnPoint ) {
    const alpha = lineAngle % ( Math.PI * 2 );
    const gamma = Math.atan2( ( p.y - pointOnLine.y ), ( p.x - pointOnLine.x ) ) % ( Math.PI * 2 );
    const theta = ( 2 * alpha - gamma ) % ( Math.PI * 2 );
    const d = p.distance( pointOnLine );
    returnPoint.setXY( pointOnLine.x + d * Math.cos( theta ), pointOnLine.y + d * Math.sin( theta ) );
    return returnPoint;
  }

  /**
   * Detects and handles particle-container collisions.
   * Handles x and y directions separately in case a particle hits the container diagonally at a corner.
   * @param {Particle[]} particles
   * @param {Container} container
   */
  function doParticleContainerCollisions( particles, container ) {
    for ( let i = 0; i < particles.length; i++ ) {

      const particle = particles[ i ];

      // adjust x
      if ( particle.left <= container.left ) {
        particle.left = container.left;
        particle.invertDirectionX();
        //TODO handle kinetic energy if the left wall is moving
      }
      else if ( particle.right >= container.right ) {
        particle.right = container.right;
        particle.invertDirectionX();
      }

      // adjust y
      if ( particle.top >= container.top ) {
        //TODO handle opening in top of container
        particle.top = container.top;
        particle.invertDirectionY();
      }
      else if ( particle.bottom <= container.bottom ) {
        particle.bottom = container.bottom;
        particle.invertDirectionY();
      }
    }
  }

  return gasProperties.register( 'CollisionDetector', CollisionDetector );
} );