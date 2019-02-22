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
      this.boundsProperty = model.particleBoundsProperty;

      // @public (read-only) {Property.<Region[]>}
      this.regionsProperty = new Property( [] );

      // Partition the collision detection bounds into overlapping Regions
      this.boundsProperty.link( bounds => {

        this.clearRegions();

        const rows = Math.ceil( bounds.getHeight() / options.regionLength );
        const columns = Math.ceil( bounds.getWidth() / options.regionLength );

        const regions = [];
        for ( let i = 0; i < rows; i++ ) {
          for ( let j = 0; j < columns; j++ ) {

            const minX = bounds.minX + ( j * options.regionLength );
            const minY = bounds.minY + ( i * options.regionLength );
            const maxX = minX + options.regionLength + options.regionOverlap;
            const maxY = minY + options.regionLength + options.regionOverlap;
            const regionBounds = new Bounds2( minX, minY, maxX, maxY );

            regions.push( new Region( regionBounds ) );
          }
        }

        this.regionsProperty.value = regions;
      } );

      // @private fields needed by methods
      this.model = model;
      this.collisionExperts = []; //TODO populate collisionExperts
    }

    /**
     * Gets the Regions that partition the collision detection bounds.
     * @returns {Region[]}
     */
    get regions() { return this.regionsProperty.value; }

    /**
     * @param {number} dt - time delta, in seconds
     * @public
     */
    step( dt ) {

      const particles = this.model.getParticles();

      this.assignParticlesToRegions( particles );

      //TODO
    }

    /**
     * Puts each particle in the Region (or Regions) that contain its location.
     * @param {Particle[]} particles
     * @private
     */
    assignParticlesToRegions( particles ) {

      this.clearRegions();

      for ( let i = 0; i < particles.length; i++ ) {
        for ( let j = 0; j < this.regions.length; j++ ) {
          if ( this.regions[ j ].containsPoint( particles[ i ].location ) ) {
            this.regions[ j ].addParticle( particles[ i ] );
          }
        }
      }
    }

    /**
     * Clears particles from all regions.
     * @private
     */
    clearRegions() {
      for ( let i = 0; i < this.regions.length; i++ ) {
        this.regions[ i ].clear();
      }
    }
  }

  return gasProperties.register( 'CollisionManager', CollisionManager );
} );