// Copyright 2018, University of Colorado Boulder

/**
 * Controls related to time: play, pause and step.
 * 
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  const StepButton = require( 'SCENERY_PHET/buttons/StepButton' );

  /**
   * @param {BooleanProperty} isPlayingProperty
   * @param {function} stepCallback - called when the step button is pressed
   * @param {Object} [options]
   * @constructor
   */
  function TimeControls( isPlayingProperty, stepCallback, options ) {

    options = _.extend( {
      // HBox options
      spacing: 10
    }, options );

    const playPauseButton = new PlayPauseButton( isPlayingProperty );

    const stepButton = new StepButton( {
      isPlayingProperty: isPlayingProperty,
      listener: stepCallback
    });

    assert && assert( !options.children, 'TimeControls sets children' );
    options.children = [ playPauseButton, stepButton ];

    HBox.call( this, options );
  }

  gasProperties.register( 'TimeControls', TimeControls );

  return inherit( HBox, TimeControls );
} );