// Copyright 2019, University of Colorado Boulder

/**
 * Displays a region in the 2D grid that spatially partitions the collision detection space.
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

  class RegionNode extends Node {

    /**
     * @param {Region} region
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options]
     */
    constructor( region, modelViewTransform, options ) {

      options = options || {};

      const viewBounds = modelViewTransform.modelToViewBounds( region.bounds );

      // Cell in the 2D grid
      const cellNode = new Rectangle( viewBounds.minX, viewBounds.minY, viewBounds.width, viewBounds.height, {
        fill: 'rgba( 0, 255, 0, 0.1 )' // use translucent color so that additive opacity shows overlap of Regions
      } );

      // Displays the number of particles in the Region
      const countNode = new Text( region.numberOfParticles, {
        fill: 'green',
        font: FONT,
        center: cellNode.center
      } );

      assert && assert( !options.children, 'RegionNode sets children' );
      options.children = [ cellNode, countNode ];

      super( options );

      // @private
      this.region = region;
      this.cellNode = cellNode;
      this.countNode = countNode;
    }

    /**
     * Displays the number of particles in the region.
     * @param {number} dt
     */
    step( dt ) {
      this.countNode.text = this.region.numberOfParticles;
      this.countNode.center = this.cellNode.center;
    }
  }

  return gasProperties.register( 'RegionNode', RegionNode );
} );