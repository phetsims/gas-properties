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

      const children = [];

      // Draw each cell in the grid.  Use additive opacity to show overlap.
      for ( let i = 0; i < regions.length; i++ ) {
        const row = regions[ i ]; // {Region[]}
        for ( let j = 0; j < row.length; j++ ) {

          const viewBounds = modelViewTransform.modelToViewBounds( row[ j ].bounds );
          const isCorner = ( i === 0 || i === regions.length - 1 ) && ( j === 0 || j === row.length - 1 );

          children.push( new Rectangle( viewBounds.minX, viewBounds.minY, viewBounds.width, viewBounds.height, {
            fill: 'rgba( 0, 255, 0, 0.1 )',
            stroke: isCorner ? 'green' : null // stroke cells in the corners of the grid
          } ) );
        }
      }

      // Stroke the bounds of the collision detection space, to verify that the grid fills it.
      const viewBounds = modelViewTransform.modelToViewBounds( bounds );
      children.push( new Rectangle( viewBounds.minX, viewBounds.minY, viewBounds.width, viewBounds.height, {
        stroke: 'yellow'
      } ) );

      assert && assert( !options.children, 'RegionsNode sets children' );
      options.children = children;

      super( options );
    }
  }

  return gasProperties.register( 'RegionsNode', RegionsNode );
} );