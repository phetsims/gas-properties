// Copyright 2018, University of Colorado Boulder

//TODO too many responsibilities? misplaced responsibilities?
/**
 * DragListener subclass that adds the following features:
 *
 * - keeps the entire targetNode inside dragBounds while dragging
 * - keeps the entire targetNode inside dragBounds when dragBounds changes
 * - moves targetNode when location changes
 * - interrupts interaction when visibility or dragBounds changes
 *
 * This is code that was common to CollisionCounterNode and StopwatchNode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );

  class GasPropertiesDragListener extends DragListener {

    /**
     * @param {Node} targetNode
     * @param {Property.<Vector2>} locationProperty - location, in view coordinates
     * @param {Property.<Bounds2|null>} dragBoundsProperty - drag bounds, in view coordinates
     * @param {BooleanProperty} visibleProperty
     * @param {Object} [options]
     */
    constructor( targetNode, locationProperty, dragBoundsProperty, visibleProperty, options ) {

      // {DerivedProperty.<Bounds2>|null>} adjust the drag bounds to keep this entire Node in bounds
      const adjustedDragBoundsProperty = new DerivedProperty( [ dragBoundsProperty ], dragBounds => {
          if ( dragBounds ) {
            return new Bounds2( dragBounds.minX, dragBounds.minY,
              dragBounds.maxX - targetNode.width, dragBounds.maxY - targetNode.height );
          }
          else {
            return null;
          }
        }
      );

      super( {
        locationProperty: locationProperty,
        dragBoundsProperty: adjustedDragBoundsProperty
      } );

      adjustedDragBoundsProperty.link( adjustedDragBounds => {

        // interrupt user interactions
        targetNode.interruptSubtreeInput();

        // Ensure that location remains inside the drag bounds.
        if ( adjustedDragBounds && !adjustedDragBounds.containsBounds( targetNode.bounds ) ) {
          locationProperty.value = adjustedDragBounds.closestPointTo( locationProperty.value );
        }
      } );

      // move targetNode
      locationProperty.linkAttribute( targetNode, 'translation' );

      // show/hide targetNode
      visibleProperty.link( visible => {
        targetNode.interruptSubtreeInput(); // interrupt user interactions
        targetNode.visible = visible;
      } );
    }
  }

  return gasProperties.register( 'GasPropertiesDragListener', GasPropertiesDragListener );
} );