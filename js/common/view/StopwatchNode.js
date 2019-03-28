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
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const Text = require( 'SCENERY/nodes/Text' );
  const TimerNode = require( 'SCENERY_PHET/TimerNode' );
  const TimerReadoutNode = require( 'SCENERY_PHET/TimerReadoutNode' );
  const ToolDragListener = require( 'GAS_PROPERTIES/common/view/ToolDragListener' );

  // strings
  const picosecondsString = require( 'string!GAS_PROPERTIES/picoseconds' );

  class StopwatchNode extends TimerNode {

    /**
     * @param {Stopwatch} stopwatch
     * @param {Object} [options]
     */
    constructor( stopwatch, options ) {

      options = _.extend( {

        dragBoundsProperty: null, // {Property.<Bounds2>|null} in view coordinates

        // TimerNode options
        maxValue: 999.99,
        timerReadoutNodeOptions: {
          unitsNode: new Text( picosecondsString, {
            font: TimerReadoutNode.DEFAULT_SMALL_FONT
          } )
        }
      }, options );

      super( stopwatch.timeProperty, stopwatch.isRunningProperty, options );

      // Put a red dot at the origin, for debugging layout.
      if ( phet.chipper.queryParameters.dev ) {
        this.addChild( new Circle( 3, { fill: 'red' } ) );
      }

      // dragging
      this.addInputListener( new ToolDragListener( this, stopwatch.visibleProperty, {
        locationProperty: stopwatch.locationProperty,
        dragBoundsProperty: options.dragBoundsProperty
      } ) );
    }
  }

  return gasProperties.register( 'StopwatchNode', StopwatchNode );
} );
 