// Copyright 2018-2019, University of Colorado Boulder

/**
 * A digital stopwatch
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Circle = require( 'SCENERY/nodes/Circle' );
  const DragBoundsProperty = require( 'GAS_PROPERTIES/common/view/DragBoundsProperty' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const Stopwatch = require( 'GAS_PROPERTIES/common/model/Stopwatch' );
  const Text = require( 'SCENERY/nodes/Text' );
  const TimerNode = require( 'SCENERY_PHET/TimerNode' );
  const TimerReadoutNode = require( 'SCENERY_PHET/TimerReadoutNode' );

  // strings
  const picosecondsString = require( 'string!GAS_PROPERTIES/picoseconds' );

  class StopwatchNode extends TimerNode {

    /**
     * @param {Stopwatch} stopwatch
     * @param {Property.<Bounds2>} visibleBoundsProperty - visible bounds of the ScreenView
     * @param {Object} [options]
     */
    constructor( stopwatch, visibleBoundsProperty, options ) {
      assert && assert( stopwatch instanceof Stopwatch, `invalid stopwatch: ${stopwatch}` );

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
      if ( GasPropertiesQueryParameters.origin ) {
        this.addChild( new Circle( 3, { fill: 'red' } ) );
      }

      // visibility
      stopwatch.visibleProperty.link( visible => {
        this.interruptSubtreeInput(); // interrupt user interactions
        this.visible = visible;
      } );
      
      // Move to the stopwatch's location
      stopwatch.locationProperty.link( location => {
        this.translation = location;
      } );

      // drag bounds, adjusted to keep this entire Node inside visible bounds
      const dragBoundsProperty = new DragBoundsProperty( this, visibleBoundsProperty );

      // If the stopwatch is outside the drag bounds, move it inside.
      dragBoundsProperty.link( dragBounds => {
        this.interruptSubtreeInput(); // interrupt user interactions
        if ( !dragBounds.containsPoint( stopwatch.locationProperty ) ) {
          stopwatch.locationProperty.value = dragBounds.closestPointTo( stopwatch.locationProperty.value );
        }
      } );

      // dragging, added to background so that other UI components get input events on touch devices
      this.dragTarget.addInputListener( new DragListener( {
        targetNode: this,
        locationProperty: stopwatch.locationProperty,
        dragBoundsProperty: dragBoundsProperty
      } ) );
    }
  }

  return gasProperties.register( 'StopwatchNode', StopwatchNode );
} );
 