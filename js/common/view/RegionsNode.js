// Copyright 2019, University of Colorado Boulder

/**
 * Shows how the collision detection space is partitioned into a 2D grid of Regions.
 * Used for debugging, not visible to the user, see GasPropertiesQueryParameters.regions.
 *
 * Regions that the container walls intersect are filled with red, other regions are filled with green.
 * Fill colors are translucent, so that additive opacity shows overlaps.
 * A number in the center of the region indicates how many particles are in that region.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const Node = require( 'SCENERY/nodes/Node' );
  const RegionNode = require( 'GAS_PROPERTIES/common/view/RegionNode' );

  class RegionsNode extends Node {

    /**
     * @param {Region[]} regions
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options]
     */
    constructor( regions, modelViewTransform, options ) {

      options = _.extend( {
        pickable: false
      }, options );

      // {RegionNode[]} Draw each region in the grid.  Additive opacity shows overlap.
      const regionNodes = [];
      for ( let i = 0; i < regions.length; i++ ) {
        const regionNode = new RegionNode( regions[ i ], modelViewTransform );
        regionNodes.push( regionNode );
      }

      assert && assert( !options.hasOwnProperty( 'children' ), 'RegionsNode sets children' );
      options = _.extend( {
        children: regionNodes
      }, options );

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