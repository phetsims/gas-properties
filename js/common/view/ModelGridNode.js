// Copyright 2019, University of Colorado Boulder

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
  const Vector2 = require( 'DOT/Vector2' );

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

        // lower-left of model coordinate frame
        let modelPosition = modelViewTransform.viewToModelPosition( new Vector2( visibleBounds.minX, visibleBounds.maxY ) );
        const minX = Math.ceil( modelPosition.x );
        const minY = Math.ceil( modelPosition.y );

        // upper-right of model coordinate frame
        modelPosition = modelViewTransform.viewToModelPosition( new Vector2( visibleBounds.maxX, visibleBounds.minY ) );
        const maxX = Math.ceil( modelPosition.x );
        const maxY = Math.ceil( modelPosition.y );

        const gridShape = new Shape();

        // vertical grid lines
        for ( let x = minX; x < maxX; x += options.cellLength ) {
          const viewPosition = modelViewTransform.modelToViewXY( x, 0 );
          gridShape.moveTo( viewPosition.x, visibleBounds.minY );
          gridShape.lineTo( viewPosition.x, visibleBounds.maxY, );
        }

        // horizontal grid lines
        for ( let y = minY; y < maxY; y += options.cellLength ) {
          const viewPosition = modelViewTransform.modelToViewXY( 0, y );
          gridShape.moveTo( visibleBounds.minX, viewPosition.y );
          gridShape.lineTo( visibleBounds.maxX, viewPosition.y, );
        }

        this.shape = gridShape;
      } );
    }
  }

  return gasProperties.register( 'ModelGridNode', ModelGridNode );
} );