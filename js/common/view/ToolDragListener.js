// Copyright 2018-2019, University of Colorado Boulder

/**
 * DragListener for the 'tools' (Stopwatch, CollisionCounter) in this sim.
 * It adds the following features to DragListener:
 *
 * - moves targetNode when location changes
 * - keeps the entire targetNode inside dragBounds while dragging
 * - keeps the entire targetNode inside dragBounds when dragBounds changes
 * - controls visibility of targetNode
 * - interrupts interaction when visibility or dragBounds changes
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
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );

  class ToolDragListener extends DragListener {

    /**
     * @param {Node} targetNode
     * @param {BooleanProperty} visibleProperty
     * @param {Object} [options]
     */
    constructor( targetNode, visibleProperty, options ) {

      options = _.extend( {
        locationProperty: new Vector2Property( Vector2.ZERO ),
        dragBoundsProperty: null // {Property.<Bounds2>|null}
      }, options );

      // move targetNode
      options.locationProperty.linkAttribute( targetNode, 'translation' );

      if ( options.dragBoundsProperty ) {

        const originalDragBounds = options.dragBoundsProperty;

        // {DerivedProperty.<Bounds2>|null>} adjust the drag bounds to keep this entire Node in bounds
        options.dragBoundsProperty = new DerivedProperty( [ originalDragBounds ], dragBounds => {
            if ( dragBounds ) {
              return new Bounds2( dragBounds.minX, dragBounds.minY,
                dragBounds.maxX - targetNode.width, dragBounds.maxY - targetNode.height );
            }
            else {
              return null;
            }
          }
        );

        options.dragBoundsProperty.link( dragBounds => {

          // interrupt user interactions
          targetNode.interruptSubtreeInput();

          // Ensure that location remains inside the drag bounds.
          if ( !dragBounds.containsBounds( targetNode.bounds ) ) {
            options.locationProperty.value = dragBounds.closestPointTo( options.locationProperty.value );
          }
        } );
      }

      // show/hide targetNode
      visibleProperty.link( visible => {
        targetNode.interruptSubtreeInput(); // interrupt user interactions
        targetNode.visible = visible;
      } );

      super( options );
    }
  }

  return gasProperties.register( 'ToolDragListener', ToolDragListener );
} );