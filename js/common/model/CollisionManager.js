// Copyright 2019, University of Colorado Boulder

/**
 * Manages collision detection and response.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const ParticleContainerCollider = require( 'GAS_PROPERTIES/common/model/ParticleContainerCollider' );
  const ParticleParticleCollider = require( 'GAS_PROPERTIES/common/model/ParticleParticleCollider' );
  const Property = require( 'AXON/Property' );
  const Region = require( 'GAS_PROPERTIES/common/model/Region' );

  class CollisionManager {

    /**
     * @param {IdealModel} model TODO more general type
     * @param {Object} [options]
     */
    constructor( model, options ) {

      options = _.extend( {
        regionLength: 2, // Regions are square, length of one side, nm
        regionOverlap: 0.5 // overlap of Regions, in nm
      }, options );

      assert && assert( options.regionLength > 0, `invalid regionLength: ${options.regionLength}` );
      assert && assert( options.regionOverlap > 0, `invalid regionOverlap: ${options.regionOverlap}` );
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

        this.clearRegions();

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

      // @private
      this.particleParticleCollider = new ParticleParticleCollider();
      this.particleContainerCollider = new ParticleContainerCollider();

      // @private fields needed by methods
      this.model = model;
    }

    /**
     * @param {number} dt - time delta, in seconds
     * @public
     */
    step( dt ) {

      // put particles and container in regions
      this.clearRegions();
      this.assignParticlesToRegions( this.model.heavyParticles );
      this.assignParticlesToRegions( this.model.lightParticles );
      this.assignContainerToRegions( this.model.container );

      // detect and handle particle-particle collisions within each region
      this.doParticleParticleCollisions();

      // detect and handle particle-container collisions
      this.doParticleContainerCollisions();

      this.keepParticlesInContainer( this.model.heavyParticles );
      this.keepParticlesInContainer( this.model.lightParticles );
    }

    /**
     * Assigns each particle to the Regions that it intersects.
     * @param {Particle[]} particles
     * @private
     */
    assignParticlesToRegions( particles ) {
      const regions = this.regionsProperty.value;
      for ( let i = 0; i < particles.length; i++ ) {
        for ( let j = 0; j < regions.length; j++ ) {
          if ( regions[ j ].intersectsParticle( particles[ i ] ) ) {
            regions[ j ].addParticle( particles[ i ] );
          }
        }
      }
    }

    /**
     * Assigns a container to the Regions that it intersects.
     * @param {Container} container
     * @private
     */
    assignContainerToRegions( container ) {
      const regions = this.regionsProperty.value;
      for ( let i = 0; i < regions.length; i++ ) {
        if ( regions[ i ].intersectsContainer( container ) ) {
          regions[ i ].setContainer( container );
        }
      }
    }

    /**
     * Clears objects from all regions.
     * @private
     */
    clearRegions() {
      const regions = this.regionsProperty.value;
      for ( let i = 0; i < regions.length; i++ ) {
        regions[ i ].clear();
      }
    }

    /**
     * Detects and handles particle-particle collisions within a Region.
     * @private
     */
    doParticleParticleCollisions() {
      const regions = this.regionsProperty.value;
      for ( let i = 0; i < regions.length; i++ ) {
        const particles = regions[ i ].particles;
        for ( let j = 0; j < particles.length - 1; j++ ) {
          for ( let k = j + 1; k < particles.length; k++ ) {
            this.particleParticleCollider.doCollision( particles[ j ], particles[ k ] );
          }
        }
      }
    }

    /**
     * Detects and handles particle-container collisions within a Region.
     * @private
     */
    doParticleContainerCollisions() {
      const regions = this.regionsProperty.value;
      for ( let i = 0; i < regions.length; i++ ) {
        const container = regions[ i ].container;
        if ( container ) {
          const particles = regions[ i ].particles;
          for ( let j = 0; j < particles.length - 1; j++ ) {
            this.particleContainerCollider.doCollision( particles[ j ], container );
          }
        }
      }
    }

    //TODO CollisionGod.keepMoleculesInBox hack from the Java version, is there a better way?
    /**
     * Prevents particles from overshooting the walls of the container, which effectively makes the container leak.
     * @param {Particle[]} particles
     * @private
     */
    keepParticlesInContainer( particles ) {
      const container = this.model.container;
      for ( let i = 0; i < particles.length; i++ ) {
        const particle = particles[ i ];

        // adjust x
        if ( particle.location.x - particle.radius < container.left ) {
          particle.setLocation( container.left + particle.radius, particle.location.y );
        }
        else if ( particle.location.x + particle.radius > container.right) {
          particle.setLocation( container.right - particle.radius, particle.location.y );
        }

        // adjust y
        if ( particle.location.y + particle.radius > container.top ) {
          particle.setLocation( particle.location.x, container.top - particle.radius );
        }
        else if ( particle.location.y - particle.radius < container.bottom) {
          particle.setLocation( particle.location.x, container.bottom + particle.radius );
        }
      }
    }
  }

  return gasProperties.register( 'CollisionManager', CollisionManager );
} );