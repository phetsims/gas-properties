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
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );

  // constants
  const FONT = new PhetFont( 14 );

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

      // Draw each cell in the grid.  Use additive opacity to show overlap.
      const cellNodes = [];
      const countNodes = [];
      for ( let i = 0; i < regions.length; i++ ) {
        const row = regions[ i ]; // {Region[]}
        for ( let j = 0; j < row.length; j++ ) {

          const viewBounds = modelViewTransform.modelToViewBounds( row[ j ].bounds );
          const isCorner = ( i === 0 || i === regions.length - 1 ) && ( j === 0 || j === row.length - 1 );

          const cellNode = new Rectangle( viewBounds.minX, viewBounds.minY, viewBounds.width, viewBounds.height, {
            fill: 'rgba( 0, 255, 0, 0.1 )',
            stroke: isCorner ? 'green' : null // stroke cells in the corners of the grid
          } );
          cellNodes.push( cellNode );

          const countNode = new Text( '0', {
            fill: 'green',
            font: FONT,
            center: cellNode.center
          } );
          countNodes.push( countNode );
        }
      }
      children = children.concat( cellNodes );
      children = children.concat( countNodes );

      // Stroke the bounds of the collision detection space, to verify that the grid fills it.
      const viewBounds = modelViewTransform.modelToViewBounds( bounds );
      children.push( new Rectangle( viewBounds.minX, viewBounds.minY, viewBounds.width, viewBounds.height, {
        stroke: 'green'
      } ) );

      assert && assert( !options.children, 'RegionsNode sets children' );
      options.children = children;

      super( options );

      // @private
      this.regions = regions;
      this.countNodes = countNodes;
    }

    /**
     * Displays the number of particles in each region.
     * @param dt
     */
    step( dt ) {
      let index = 0;
      for ( let i = 0; i < this.regions.length; i++ ) {
        const row = this.regions[ i ]; // {Region[]}
        for ( let j = 0; j < row.length; j++ ) {
          this.countNodes[ index++ ].text = row[ j ].numberOfParticles;
        }
      }
    }
  }

  return gasProperties.register( 'RegionsNode', RegionsNode );
} );