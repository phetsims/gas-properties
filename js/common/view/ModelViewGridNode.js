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
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const COLOR = GasPropertiesColorProfile.gridColorProperty;
  const FONT = new PhetFont( 14 );
  const CELL_LENGTH = 1; // length of a square cell in the grid, in nm

  class ModelViewGridNode extends Node {

    /**
     * @param {Property.<Bounds2>} visibleBoundsProperty - visible bounds of the parent ScreenView
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options] - options are NOT propagated to the supertype
     */
    constructor( visibleBoundsProperty, modelViewTransform, options ) {

      const coordinatesNode = new Text( '', {
        font: FONT,
        fill: COLOR,
        pickable: false
      } );

      const gridNode = new Path( null, {
        stroke: COLOR,
        opacity: 0.3,
        pickable: false
      } );

      const boundsRectangle = new Rectangle( 0, 0, 1, 1, {
        fill: 'transparent'
      } );

      super( {
        children: [ gridNode, coordinatesNode, boundsRectangle ]
      } );

      // Update the grid when the visibleBounds change.
      visibleBoundsProperty.link( visibleBounds => {

        boundsRectangle.setRect( visibleBounds.minX, visibleBounds.minY, visibleBounds.width, visibleBounds.height );

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
        for ( let x = minX; x < maxX; x += CELL_LENGTH ) {
          const viewPosition = modelViewTransform.modelToViewXY( x, 0 );
          gridShape.moveTo( viewPosition.x, visibleBounds.minY );
          gridShape.lineTo( viewPosition.x, visibleBounds.maxY, );
        }
        
        // horizontal grid lines
        for ( let y = minY; y < maxY; y += CELL_LENGTH ) {
          const viewPosition = modelViewTransform.modelToViewXY( 0, y );
          gridShape.moveTo( visibleBounds.minX, viewPosition.y );
          gridShape.lineTo( visibleBounds.maxX, viewPosition.y, );
        }

        gridNode.shape = gridShape;
      } );

      // Update the coordinates to match the pointer location.
      phet.joist.display.addInputListener( {
         move: event => {

           // (x,y) in view coordinates
           const viewPoint = this.globalToLocalPoint( event.pointer.point );
           const xView = Util.toFixed( viewPoint.x, 0 );
           const yView = Util.toFixed( viewPoint.y, 0 );

           // (x,y) in model coordinates
           const modelPoint = modelViewTransform.viewToModelPosition( viewPoint );
           const xModel = Util.toFixed( modelPoint.x, 1 );
           const yModel = Util.toFixed( modelPoint.y, 1 );

           // Update coordinates display.
           coordinatesNode.text = `(${xView},${yView}) \u2192 (${xModel},${yModel}) nm`;

           // Center the coordinates above the cursor.
           coordinatesNode.centerX = viewPoint.x;
           coordinatesNode.bottom = viewPoint.y - 3;
         }
      } );
    }
  }

  return gasProperties.register( 'ModelViewGridNode', ModelViewGridNode );
} );