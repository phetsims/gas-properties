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
     * @param {IdealModel} model
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

      //TODO flatten this array if we don't need to compare adjacent Regions
      //TODO do we need separate grids for inside vs outside the container?
      // @public (read-only) {Property.<Region[][]>} 2D grid of Regions, in row-major order
      this.regionsProperty = new Property( [] );

      // Partition the collision detection bounds into overlapping Regions.
      // This algorithm builds the grid right-to-left, bottom-to-top, so that it's aligned with the right and bottom
      // edges of the container.
      //TODO generalize this or add assertions for assumptions.
      this.particleBoundsProperty.link( bounds => {

        this.clearRegions();

        const regions = []; // {Region[][]} in row-major order
        let maxX = bounds.maxX;
        while ( maxX > bounds.minX ) {
          const row = []; // {Region[]}
          let minY = bounds.minY;
          while ( minY < bounds.maxY ) {
            const regionBounds = new Bounds2( maxX - options.regionLength, minY, maxX, minY + options.regionLength );
            row.push( new Region( regionBounds ) );
            minY = minY + options.regionLength - options.regionOverlap;
          }
          maxX = maxX - options.regionLength + options.regionOverlap;
          regions.push( row );
        }

        this.regionsProperty.value = regions;
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

      // put particles in region(s)
      this.clearRegions();
      this.assignParticlesToRegions( this.model.heavyParticles );
      this.assignParticlesToRegions( this.model.lightParticles );

      //TODO determine which regions are intersected by the container walls

      // detect and handle particle-particle collisions within each region
      this.doParticleParticleCollisions();

      // detect and handle particle-container collisions
      this.doParticleContainerCollisions( this.model.heavyParticles, this.model.container );
      this.doParticleContainerCollisions( this.model.lightParticles, this.model.container );
    }

    /**
     * Puts each particle in the Region (or Regions) that contain its location.
     * @param {Particle[]} particles
     * @private
     */
    assignParticlesToRegions( particles ) {
      const regions = this.regionsProperty.value;
      for ( let i = 0; i < particles.length; i++ ) {
        for ( let row = 0; row < regions.length; row++ ) {
          for ( let column = 0; column < regions[ row ].length; column++ ) {
            if ( regions[ row ][ column ].containsPoint( particles[ i ].location ) ) {
              regions[ row ][ column ].addParticle( particles[ i ] );
            }
          }
        }
      }
    }

    /**
     * Clears particles from all regions.
     * @private
     */
    clearRegions() {
      const regions = this.regionsProperty.value;
      for ( let row = 0; row < regions.length; row++ ) {
        for ( let column = 0; column < regions[ row ].length; column++ ) {
          regions[ row ][ column ].clear();
        }
      }
    }

    /**
     * Detects and handles particle-particle collisions within a Region.
     * @private
     */
    doParticleParticleCollisions() {
      const regions = this.regionsProperty.value;
      for ( let row = 0; row < regions.length; row++ ) {
        for ( let column = 0; column < regions[ row ].length; column++ ) {
          const region = regions[ row ][ column ];
          const particles = region.particles;
          for ( let i = 0; i < particles.length - 1; i++ ) {
            for ( let j = i + 1; j < particles.length; j++ ) {
              this.particleParticleCollider.doCollision( particles[ i ], particles[ j ] );
            }
          }
        }
      }
    }

    //TODO leverage Regions here, compare only with particles that are intersected by the container walls
    /**
     * Detects and handles particle-container collisions.
     * @param {Particle[]} particles
     * @param {Container} container
     * @private
     */
    doParticleContainerCollisions( particles, container ) {
      for ( let i = 0; i < particles.length - 1; i++ ) {
        this.particleContainerCollider.doCollision( particles[ i ], container );
      }
    }
  }

  return gasProperties.register( 'CollisionManager', CollisionManager );
} );