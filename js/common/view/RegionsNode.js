// Copyright 2019, University of Colorado Boulder

/**
 * Shows how the collision detection space is partitioned into a 2D grid of Regions.
 * A number in the center of the region indicates how many particles are in that region.
 * Used for debugging, not visible to the user, see GasPropertiesQueryParameters.regions.
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

      // {RegionNode[]}
      const regionNodes = [];
      for ( let i = 0; i < regions.length; i++ ) {
        const regionNode = new RegionNode( regions[ i ], modelViewTransform );
        regionNodes.push( regionNode );
      }

      assert && assert( !options.children, 'RegionsNode sets children' );
      options = _.extend( {
        children: regionNodes
      }, options );

      super( options );

      // @private
      this.regionNodes = regionNodes;
    }

    /**
     * Updates each RegionNode.
     * @param {number} dt - time delta, in ps
     */
    step( dt ) {
      for ( let i = 0; i < this.regionNodes.length; i++ ) {
        this.regionNodes[ i ].step( dt );
      }
    }
  }

  return gasProperties.register( 'RegionsNode', RegionsNode );
} );