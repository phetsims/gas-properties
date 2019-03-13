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
        doParticleParticleCollisions( regions[ i ].particles );
      }

      // detect and handle particle-container collisions
      doParticleContainerCollisions( this.model.heavyParticles, this.model.container );
      doParticleContainerCollisions( this.model.lightParticles, this.model.container );
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
   * Detects and handles particle-particle collisions.
   * @param {Particle[]} particles
   */
  function doParticleParticleCollisions( particles ) {
    for ( let i = 0; i < particles.length - 1; i++ ) {
      const particle1 = particles[ i ];
      for ( let j = i + 1; j < particles.length; j++ ) {
        const particle2 = particles[ j ];
        if ( !particle1.contactedParticle( particle2 ) && particle1.contactsParticle( particle2 ) ) {

          //TODO temporary, see Java SphereSphereCollision.doCollision
          particle1.setVelocityPolar( particle1.velocity.magnitude, phet.joist.random.nextDouble() * 2 * Math.PI );
          particle2.setVelocityPolar( particle2.velocity.magnitude, phet.joist.random.nextDouble() * 2 * Math.PI );
        }
      }
    }
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