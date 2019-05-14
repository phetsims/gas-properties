// Copyright 2018-2019, University of Colorado Boulder

/**
 * A digital stopwatch
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const Text = require( 'SCENERY/nodes/Text' );
  const TimerNode = require( 'SCENERY_PHET/TimerNode' );
  const TimerReadoutNode = require( 'SCENERY_PHET/TimerReadoutNode' );

  // strings
  const picosecondsString = require( 'string!GAS_PROPERTIES/picoseconds' );

  class StopwatchNode extends TimerNode {

    /**
     * @param {Stopwatch} stopwatch
     * @param {Property.<Bounds2|null>} visibleBoundsProperty - visible bounds of the ScreenView
     * @param {Object} [options]
     */
    constructor( stopwatch, visibleBoundsProperty, options ) {

      options = _.extend( {

        // TimerNode options
        backgroundBaseColor: GasPropertiesColorProfile.stopwatchBackgroundColorProperty,
        maxValue: 999.99,
        timerReadoutNodeOptions: {
          unitsNode: new Text( picosecondsString, {
            font: TimerReadoutNode.DEFAULT_SMALL_FONT,
            maxWidth: 30 // determined empirically
          } )
        }
      }, options );

      super( stopwatch.timeProperty, stopwatch.isRunningProperty, options );

      // Put a red dot at the origin, for debugging layout.
      if ( phet.chipper.queryParameters.dev ) {
        this.addChild( new Circle( 3, { fill: 'red' } ) );
      }

      // Move to the stopwatch's location
      stopwatch.locationProperty.link( location => {
        this.translation = location;
      } );

      // {DerivedProperty.<Bounds2|null>} drag bounds, adjusted to keep this entire Node inside visible bounds
      const dragBoundsProperty = new DerivedProperty( [ visibleBoundsProperty ], visibleBounds => {
        if ( visibleBounds ) {
          return new Bounds2( visibleBounds.minX, visibleBounds.minY,
            visibleBounds.maxX - this.width, visibleBounds.maxY - this.height );
        }
        else {
          return null;
        }
      } );

      // If the stopwatch is outside the drag bounds, move it inside.
      dragBoundsProperty.link( dragBounds => {
        this.interruptSubtreeInput(); // interrupt user interactions
        if ( !dragBounds.containsBounds( this.bounds ) ) {
          stopwatch.locationProperty.value = dragBounds.closestPointTo( stopwatch.locationProperty.value );
        }
      } );

      // dragging
      this.addInputListener( new DragListener( {
        targetNode: this,
        locationProperty: stopwatch.locationProperty,
        dragBoundsProperty: dragBoundsProperty
      } ) );

      // show/hide
      stopwatch.visibleProperty.link( visible => {
        this.interruptSubtreeInput(); // interrupt user interactions
        this.visible = visible;
      } );
    }
  }

  return gasProperties.register( 'StopwatchNode', StopwatchNode );
} );
 