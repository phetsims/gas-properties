// Copyright 2019, University of Colorado Boulder

/**
 * Derives drag bounds that will keep an entire Node inside the visible bounds of a ScreenView.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );

  class DragBoundsProperty extends DerivedProperty {

    /**
     * @param {Node} targetNode - the Node that is to be constrained to the drag bounds
     * @param {Property.<Bounds2|null>} visibleBoundsProperty - visible bounds of the ScreenView
     */
    constructor( targetNode, visibleBoundsProperty ) {

      super( [ visibleBoundsProperty ], visibleBounds => {
        if ( visibleBounds ) {
          return new Bounds2( visibleBounds.minX, visibleBounds.minY,
            visibleBounds.maxX - targetNode.width, visibleBounds.maxY - targetNode.height );
        }
        else {
          return null;
        }
      } );
    }
  }

  return gasProperties.register( 'DragBoundsProperty', DragBoundsProperty );
} );