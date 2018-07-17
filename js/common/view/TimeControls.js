// Copyright 2018, University of Colorado Boulder

/**
 * Controls related to time: play, pause and step.
 * 
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var StepButton = require( 'SCENERY_PHET/buttons/StepButton' );

  /**
   * @param {BooleanProperty} playingProperty
   * @param {function} stepCallback - called when the step button is pressed
   * @param {Object} [options]
   * @constructor
   */
  function TimeControls( playingProperty, stepCallback, options ) {

    options = _.extend( {
      // HBox options
      spacing: 10
    }, options );

    var playPauseButton = new PlayPauseButton( playingProperty );

    var stepButton = new StepButton( {
      playingProperty: playingProperty,
      listener: stepCallback
    });

    assert && assert( !options.children, 'TimeControls sets children' );
    options.children = [ playPauseButton, stepButton ];

    HBox.call( this, options );
  }

  gasProperties.register( 'TimeControls', TimeControls );

  return inherit( HBox, TimeControls );
} );