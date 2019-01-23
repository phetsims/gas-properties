// Copyright 2018, University of Colorado Boulder

/**
 * TODO Port of Java class CollisionGod
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const Region = require( 'GAS_PROPERTIES/port/model/Region' );
  const Util = require( 'DOT/Util' );

  class CollisionManager {

    /**
     * @param {IdealGasModel} model
     * @param {CollisionExpert[]} collisionExperts
     * @param {Bounds2} bounds
     * @param {Object} [options]
     */
    constructor( model, collisionExperts, bounds, options ) {

      options = _.extend( {
        numberOfRegionsX: 10,
        numberOfRegionsY: 10,
        regionOverlap: 10  //TODO JAVA is this value appropriate for HTML5? units?
      }, options );

      assert && assert( Util.isInteger( options.numberOfRegionsX ),
        'invalid numberOfRegionsX: ' + options.numberOfRegionsX );
      assert && assert( Util.isInteger( options.numberOfRegionsY ),
        'invalid numberOfRegionsY: ' + options.numberOfRegionsY );
      assert && assert( options.regionOverlap > 0,
        'invalid regionOverlap: ' + options.regionOverlap );

      // Divide the total bounds into overlapping regions
      const regionWidth = bounds.getWidth() / options.numberOfRegionsX;
      const regionHeight = bounds.getHeight() / options.numberOfRegionsY;
      this.regions = new Region[ options.numberOfRegionsX ][ options.numberOfRegionsY ];
      for ( let i = 0; i < options.numberOfRegionsX; i++ ) {
        for ( let j = 0; j < options.numberOfRegionsY; j++ ) {
          const minX = bounds.minX + ( i * regionWidth );
          const minY = bounds.minY + ( j * regionHeight );
          const maxX = minX + regionWidth + options.regionOverlap;
          const maxY = minY + regionHeight + options.regionOverlap;
          const regionBounds = new Bounds2( minX, minY, maxX, maxY );
          this.regions[ i ][ j ] = new Region( regionBounds );
        }
      }

      // @private fields needed by methods
      this.model = model;
      this.collisionExperts = collisionExperts;
      this.bounds = bounds;
      this.numberOfRegionsX = options.numberOfRegionsX;
      this.numberOfRegionsY = options.numberOfRegionsY;
    }

    /**
     * @param {number} dt - time delta in seconds
     * @public
     */
    step( dt ) {

      const particles = this.model.getParticles();
      this.adjustRegionMembership( particles );
      this.adjustMoleculeWallRelations( particles );

      // Do the miscellaneous collisions after the gas to gas collisions. This
      // seems to help keep things more graphically accurate. Note that gas-gas collisions
      // must be detected, even if they aren't executed, because otherwise performance will
      // be different when they are switched off.
      this.doGasToGasCollisions();
      this.doMiscCollisions( particles );

      // should this be done by adjustRegionMembership?
      this.clearRegions();

      this.keepMoleculesInBox( particles );
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

    /**
     * Makes sure all gas molecules are in the correct regions.
     * @param {Particle[]} particles
     * @private
     */
    adjustRegionMembership( particles ) {

      this.clearRegions();

      // Put all particles in the proper Region
      for ( let i = 0; i < particles.size(); i++ ) {
        this.assignRegions( particles[ i ] );
      }

      // // Remove any gas molecules from our internal structures that
      // // are no longer in the physical system
      // const particlesToRemove = [];
      // Set placedBodies = elementToRegionMap.keySet();
      // for( Iterator iterator = placedBodies.iterator(); iterator.hasNext(); ) {
      //     Object o = iterator.next();
      //     if( o instanceof GasMolecule ) {
      //         if( !particles.contains( o ) ) {
      //             removalList.add( o );
      //         }
      //     }
      // }
      // while( !removalList.isEmpty() ) {
      //     Body body = (Body)removalList.remove( 0 );
      //     removeBody( body );
      // }
    }

    assignRegions( particle ) {
      //TODO
    }

    /**
     * TODO no doc in Java
     * @param {Particles[]} particles
     * @param {Container} container
     * @private
     */
    adjustParticleContainerRelations( particles, container ) {
      //TODO
    }

    //TODO why not also to the left and above?
    /**
     * Do collisions with other particles. Each Region collides with itself and the Regions to the right and below.
     * @private
     */
    doParticleCollisions() {
      //TODO
    }

    /**
     * Do collisions with the container.
     * @param {Particle[]} particles
     * @param {Container} container
     * @private
     */
    doContainerCollisions( particles, container ) {
      //TODO
    }

    //TODO make this go away
    /**
     * TOTAL HACK!! This code is here simply to keep particles in the box
     * @param {Particle[] particles}
     */
    keepParticlesInBox( particles ) {
      //TODO
    }
  }

  return gasProperties.register( 'CollisionManager', CollisionManager );
} );