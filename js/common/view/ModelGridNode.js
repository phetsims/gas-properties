// Copyright 2019, University of Colorado Boulder

//TODO migrate to scenery-phet
/**
 * Shows a 2D grid for the model coordinate frame.
 * Moving the pointer over the grid displays the location of the pointer in model & view coordinates.
 * Used exclusively for debugging, see GasPropertiesQueryParameters.grid.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );
  const Util = require( 'DOT/Util' );

  class ModelGridNode extends Path {

    /**
     * @param {Property.<Bounds2>} visibleBoundsProperty - visible bounds of the parent ScreenView
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options]
     */
    constructor( visibleBoundsProperty, modelViewTransform, options ) {

      options = _.extend( {
        cellLength: 1, // length of each cell in the grid, in model units
        stroke: 'black',
        opacity: 0.3,
        pickable: false
      }, options );

      super( null, options );

      // Update the grid when the visibleBounds change.
      visibleBoundsProperty.link( visibleBounds => {

        //TODO this assumes that y is inverted by modelViewTransform
        // lower-left of model coordinate frame
        const minX = Util.roundToInterval( modelViewTransform.viewToModelX( visibleBounds.minX ), options.cellLength );
        const minY = Util.roundToInterval( modelViewTransform.viewToModelY( visibleBounds.maxY ), options.cellLength );

        // upper-right of model coordinate frame
        const maxX = Util.roundToInterval( modelViewTransform.viewToModelX( visibleBounds.maxX ), options.cellLength );
        const maxY = Util.roundToInterval( modelViewTransform.viewToModelY( visibleBounds.minY ), options.cellLength );

        const gridShape = new Shape();

        // vertical grid lines
        for ( let x = minX; x < maxX; x += options.cellLength ) {
          const viewX = modelViewTransform.modelToViewX( x );
          gridShape.moveTo( viewX, visibleBounds.minY );
          gridShape.lineTo( viewX, visibleBounds.maxY, );
        }

        // horizontal grid lines
        for ( let y = minY; y < maxY; y += options.cellLength ) {
          const viewY = modelViewTransform.modelToViewY( y );
          gridShape.moveTo( visibleBounds.minX, viewY );
          gridShape.lineTo( visibleBounds.maxX, viewY, );
        }

        this.shape = gridShape;
      } );
    }
  }

  return gasProperties.register( 'ModelGridNode', ModelGridNode );
} );