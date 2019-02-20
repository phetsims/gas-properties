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
  const Region = require( 'GAS_PROPERTIES/common/model/Region' );
  const Util = require( 'DOT/Util' );

  class CollisionManager {

    /**
     * @param {IdealModel} model
     * @param {Bounds2} bounds - in model coordinates, nm
     * @param {Object} [options]
     */
    constructor( model, bounds, options ) {

      options = _.extend( {
        numberOfRegionsX: 10,
        numberOfRegionsY: 10,
        regionOverlap: 1 // overlap of Regions, in nm
      }, options );

      assert && assert( Util.isInteger( options.numberOfRegionsX ),
        'invalid numberOfRegionsX: ' + options.numberOfRegionsX );
      assert && assert( Util.isInteger( options.numberOfRegionsY ),
        'invalid numberOfRegionsY: ' + options.numberOfRegionsY );
      assert && assert( options.regionOverlap > 0,
        'invalid regionOverlap: ' + options.regionOverlap );

      // @private {Region[][]} Divide the total bounds into overlapping regions, in row-major order.
      this.regions = [];
      const regionWidth = bounds.getWidth() / options.numberOfRegionsX;
      const regionHeight = bounds.getHeight() / options.numberOfRegionsY;
      for ( let i = 0; i < options.numberOfRegionsX; i++ ) {
        const row = [];
        for ( let j = 0; j < options.numberOfRegionsY; j++ ) {
          const minX = bounds.minX + ( i * regionWidth );
          const minY = bounds.minY + ( j * regionHeight );
          const maxX = minX + regionWidth + options.regionOverlap;
          const maxY = minY + regionHeight + options.regionOverlap;
          const regionBounds = new Bounds2( minX, minY, maxX, maxY );
          row.push( new Region( regionBounds ) );
        }
        this.regions.push( row );
      }

      // @private fields needed by methods
      this.model = model;
      this.collisionExperts = []; //TODO populate collisionExperts
      this.bounds = bounds;
      this.numberOfRegionsX = options.numberOfRegionsX;
      this.numberOfRegionsY = options.numberOfRegionsY;
    }

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
     * Puts each particle in the Region (or Regions) that bound its location.
     * @param {Particle[]} particles
     * @private
     */
    assignParticlesToRegions( particles ) {

      this.clearRegions();

      for ( let i = 0; i < particles.length; i++ ) {
        //TODO
      }
    }

    /**
     * Clears particles from all regions.
     * @private
     */
    clearRegions() {
      for ( let i = 0; i < this.regions.length; i++ ) {
        for ( let j = 0; j < this.regions[ i ].length; j++ ) {
          this.regions[ i ][ j ].clear();
        }
      }
    }
  }

  return gasProperties.register( 'CollisionManager', CollisionManager );
} );