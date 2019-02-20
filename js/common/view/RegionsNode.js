// Copyright 2019, University of Colorado Boulder

/**
 * Displays the 2D grid of Regions that spatially partitions the model bounds for collision detection.
 * This is intended for use in debugging, and is not visible to the user.
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
     * @param {Region[][]} regions
     * @param {Bounds2} bounds
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options]
     */
    constructor( regions, bounds, modelViewTransform, options ) {

      options = _.extend( {
        pickable: false
      }, options );

      let children = [];

      // @private {RegionNode[]} Draw each region in the grid.  Use additive opacity to show overlap.
      const regionNodes = [];
      for ( let i = 0; i < regions.length; i++ ) {
        const row = regions[ i ]; // {Region[]}
        for ( let j = 0; j < row.length; j++ ) {
          regionNodes.push( new RegionNode( row[ j ], modelViewTransform ) );
        }
      }
      children = children.concat( regionNodes );

      // Stroke the bounds of the collision detection space, to verify that the grid fills it.
      const viewBounds = modelViewTransform.modelToViewBounds( bounds );
      children.push( new Rectangle( viewBounds.minX, viewBounds.minY, viewBounds.width, viewBounds.height, {
        stroke: 'green'
      } ) );

      assert && assert( !options.children, 'RegionsNode sets children' );
      options.children = children;

      super( options );

      // @private
      this.regionNodes = regionNodes;
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