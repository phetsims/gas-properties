// Copyright 2019, University of Colorado Boulder

/**
 * Displays the Regions that spatially partition the model bounds for collision detection.
 * This is intended for use in debugging, and is not visible to the user.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );

  class RegionsNode extends Path {

    /**
     * @param {Region[][]} regions
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options]
     */
    constructor( regions, modelViewTransform, options ) {

      options = _.extend( {
        stroke: 'green',
        lineWidth: 1
      }, options );

      const shape = new Shape();
      for ( let i = 0; i < regions.length; i++ ) {
        const row = regions[ i ]; // {Region[]}
        for ( let j = 0; j < row.length; j++ ) {
          const viewBounds = modelViewTransform.modelToViewBounds( row[ j ].bounds );
          shape.rect( viewBounds.minX, viewBounds.minY, viewBounds.width, viewBounds.height );
        }
      }

      super( shape, options );
    }
  }

  return gasProperties.register( 'RegionsNode', RegionsNode );
} );