// Copyright 2019, University of Colorado Boulder

/**
 *
 * Shows how the collision detection space is partitioned into a 2D grid of Regions.
 * Used for debugging, not visible to the user, see GasPropertiesQueryParameters.regions.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RegionNode = require( 'GAS_PROPERTIES/common/view/RegionNode' );

  class RegionsNode extends Node {

    /**
     * @param {CollisionManager} collisionManager
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options]
     */
    constructor( collisionManager, modelViewTransform, options ) {

      options = _.extend( {
        pickable: false
      }, options );

      // The complete collision detection bounds
      const boundsNode = new Rectangle( 0, 0, 1, 1, {
        stroke: 'red'
      } );

      // The regions that fill the collision detection bounds.
      const regionsParent = new Node();

      assert && assert( !options.children, 'RegionsNode sets children' );
      options.children = [ regionsParent, boundsNode ];

      super( options );

      // Stroke the collision detection bounds, to verify that the grid fills it.
      collisionManager.particleBoundsProperty.link( bounds => {
        const viewBounds = modelViewTransform.modelToViewBounds( bounds );
        boundsNode.setRect( viewBounds.minX, viewBounds.minY, viewBounds.width, viewBounds.height );
      } );

      // @private {RegionNode[]} Draw each region in the grid.  Additive opacity shows overlap.
      this.regionNodes = [];
      collisionManager.regionsProperty.link( regions => {
        this.regionNodes.length = 0; // clear array
        for ( let i = 0; i < regions.length; i++ ) {
          this.regionNodes.push( new RegionNode( regions[ i ], modelViewTransform ) );
        }
        regionsParent.children = this.regionNodes;
      } );
    }

    /**
     * Updates each RegionNode.
     * @param {number} dt
     */
    step( dt ) {
      for ( let i = 0; i < this.regionNodes.length; i++ ) {
        this.regionNodes[ i ].step( dt );
      }
    }
  }

  return gasProperties.register( 'RegionsNode', RegionsNode );
} );