// Copyright 2018, University of Colorado Boulder

/**
 * TODO Port of Java class
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

  // constants
  const GAS_MOLECULE_RADIUS = 5;

  class CollisionGod {

    /**
     * @param {IdealGasModel} model
     * @param {number} dt
     * @param {Bounds2} bounds
     * @param {number} numberOfRegionsX
     * @param {number} numberOfRegionsY
     */
    constructor( model, dt, bounds, numberOfRegionsX, numberOfRegionsY ) {

      assert && assert( Util.isInteger( numberOfRegionsX ), 'invalid numberOfRegionsX: ' + numberOfRegionsX );
      assert && assert( Util.isInteger( numberOfRegionsY ), 'invalid numberOfRegionsY: ' + numberOfRegionsY );

      // @private
      this.model = model;
      this.dt = dt;
      this.bounds = bounds;
      this.numberOfRegionsX = numberOfRegionsX;
      this.numberOfRegionsY = numberOfRegionsY;

      // Divide the total bounds into overlapping regions
      const regionWidth = bounds.getWidth() / numberOfRegionsX;
      const regionHeight = bounds.getHeight() / numberOfRegionsY;
      const regionOverlap = 2 * GAS_MOLECULE_RADIUS;
      this.regions = new Region[ numberOfRegionsX ][ numberOfRegionsY ];
      for ( let i = 0; i < numberOfRegionsX; i++ ) {
        for ( let j = 0; j < numberOfRegionsY; j++ ) {
          const minX = bounds.minX + ( i * regionWidth );
          const minY = bounds.minY + ( j * regionHeight );
          const maxX = minX + regionWidth + regionOverlap;
          const maxY = minY + regionHeight + regionOverlap;
          const regionBounds = new Bounds2( minX, minY, maxX, maxY );
          this.regions[ i ][ j ] = new Region( regionBounds );
        }
      }
    }

    /**
     * @param {number} dt
     * @param {CollisionExpert[]} collisionExperts
     * @public
     */
    doYourThing( dt, collisionExperts ) {

      this.collisionExperts = collisionExperts;

      const bodies = this.model.getBodies();
      this.adjustRegionMembership( bodies );
      this.adjustMoleculeWallRelations( bodies );

      // Do the miscellaneous collisions after the gas to gas collisions. This
      // seems to help keep things more graphically accurate. Note that gas-gas collisions
      // must be detected, even if they aren't executed, because otherwise performance will
      // be different when they are switched off.
      this.doGasToGasCollisions();
      this.doMiscCollisions( bodies );

      // should this be done by adjustRegionMembership?
      this.clearRegions();

      this.keepMoleculesInBox( bodies );
    }

    /**
     * Clears bodies from all regions.
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
     * @param {Body[]} bodies
     * @private
     */
    adjustRegionMembership( bodies ) {

      // Put all the gas molecules in the model in the right regions
      for ( let i = 0; i < bodies.size(); i++ ) {
        const body = bodies[ i ];
        if ( body instanceof GasMolecule ) {
          this.assignRegions( body );
        }
      }

              // // Remove any gas molecules from our internal structures that
              // // are no longer in the physical system
              // const bodiesToRemove = [];
              // Set placedBodies = elementToRegionMap.keySet();
              // for( Iterator iterator = placedBodies.iterator(); iterator.hasNext(); ) {
              //     Object o = iterator.next();
              //     if( o instanceof GasMolecule ) {
              //         if( !bodies.contains( o ) ) {
              //             removalList.add( o );
              //         }
              //     }
              // }
              // while( !removalList.isEmpty() ) {
              //     Body body = (Body)removalList.remove( 0 );
              //     removeBody( body );
              // }
    }

    assignRegions( body ) {
      //TODO
    }

    /**
     * TODO no doc in Java
     * @param {Body[]} bodies
     * @private
     */
    adjustMoleculeWallRelations( bodies ) {
      //TODO
    }

    //TODO why not also to the left and above?
    /**
     * Do particle-particle collisions. Each region collides with itself and the regions to the right and below.
     * @private
     */
    doGasToGasCollisions() {
      //TODO
    }

    /**
     * Detects and performs collisions in which at least one of the bodies is not a gas molecule
     * @param {Body[]} bodies
     * @private
     */
    doMiscCollisions( bodies ) {
      //TODO
    }

    //TODO make this go away
    /**
     * TOTAL HACK!! This code is here simply to keep molecules in the box
     * @param {Body[] bodies}
     */
    keepMoleculesInBox( bodies ) {
      //TODO
    }

  }

  return gasProperties.register( 'CollisionGod', CollisionGod );
} );