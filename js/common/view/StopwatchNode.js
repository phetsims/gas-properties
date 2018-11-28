// Copyright 2018, University of Colorado Boulder

/**
 * A digital stopwatch
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesDragListener = require( 'GAS_PROPERTIES/common/view/GasPropertiesDragListener' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Text = require( 'SCENERY/nodes/Text' );
  const TimerNode = require( 'SCENERY_PHET/TimerNode' );
  const TimerReadoutNode = require( 'SCENERY_PHET/TimerReadoutNode' );

  // strings
  const picosecondsString = require( 'string!GAS_PROPERTIES/picoseconds' );

  class StopwatchNode extends TimerNode {

    /**
     * @param {Stopwatch} stopwatch
     * @param {Property.<Bounds2|null>} dragBoundsProperty
     * @param {Object} [options]
     */
    constructor( stopwatch, dragBoundsProperty, options ) {

      options = _.extend( {

        // TimerNode options
        maxValue: 999.99,
        unitsNode: new Text( picosecondsString, {
          font: TimerReadoutNode.DEFAULT_SMALL_FONT
        } )
      }, options );

      super( stopwatch.timeProperty, stopwatch.isRunningProperty, options );

      // Put a red dot at the origin, for debugging layout.
      if ( phet.chipper.queryParameters.dev ) {
        this.addChild( new Circle( 3, { fill: 'red' } ) );
      }

      // dragging
      this.addInputListener( new GasPropertiesDragListener( this, stopwatch.locationProperty,
        stopwatch.visibleProperty, dragBoundsProperty ) );
    }
  }

  /**
   * Creates an icon for the stopwatch, used to label check boxes.
   * @param {Object} [options]
   * @returns {Node}
   * @public
   * @static
   */
  StopwatchNode.createIcon = ( options ) => {

    options = options || {};

    assert && assert( !options.children, 'StopwatchNode.createIcon sets children' );
    options.children = [
      new TimerNode( new NumberProperty( 0 ), new BooleanProperty( false ), {
        pickable: false
      } )
    ];

    return new Node( options );
  };

  return gasProperties.register( 'StopwatchNode', StopwatchNode );
} );
 