// Copyright 2019, University of Colorado Boulder

/**
 * DragBoundsProperty derives drag bounds that will keep an entire Node inside the visible bounds of a ScreenView.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );

  class DragBoundsProperty extends DerivedProperty {

    /**
     * @param {Node} targetNode - the Node that is to be constrained to the drag bounds
     * @param {Property.<Bounds2>} visibleBoundsProperty - visible bounds of the ScreenView
     */
    constructor( targetNode, visibleBoundsProperty ) {
      assert && assert( targetNode instanceof Node, `invalid targetNode: ${targetNode}` );
      assert && assert( visibleBoundsProperty instanceof Property,
        `invalid visibleBoundsProperty: ${visibleBoundsProperty}` );

      super( [ visibleBoundsProperty ], visibleBounds => {

        // account for the bounds of targetNode
        return new Bounds2( visibleBounds.minX, visibleBounds.minY,
          visibleBounds.maxX - targetNode.width, visibleBounds.maxY - targetNode.height );
      } );
    }
  }

  return gasProperties.register( 'DragBoundsProperty', DragBoundsProperty );
} );