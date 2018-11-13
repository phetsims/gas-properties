// Copyright 2018, University of Colorado Boulder

/**
 * A digital stopwatch
 * 
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TimerNode = require( 'SCENERY_PHET/TimerNode' );

  // strings
  const picosecondsString = require( 'string!GAS_PROPERTIES/picoseconds' );

  class StopwatchNode extends TimerNode {

    /**
     * @param {NumberProperty} stopwatchTimeProperty
     * @param {BooleanProperty} stopwatchIsRunningProperty
     * @param {Object} [options]
     */
    constructor( stopwatchTimeProperty, stopwatchIsRunningProperty, options ) {

      options = _.extend( {
        unitsNode: new Text( picosecondsString, {
          font: new PhetFont( 15 )
        } )
      }, options );

      super( stopwatchTimeProperty, stopwatchIsRunningProperty, options );
    }
  }

  return gasProperties.register( 'StopwatchNode', StopwatchNode );
} );
 