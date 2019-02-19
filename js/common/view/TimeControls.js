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
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  const StepButton = require( 'SCENERY_PHET/buttons/StepButton' );

  class TimeControls extends HBox {
    /**
     * @param {IdealModel} model
     * @param {Object} [options]
     * @constructor
     */
    constructor( model, options ) {

      options = _.extend( {
        // HBox options
        spacing: 15,
        scale: 0.75
      }, options );

      const playPauseButton = new PlayPauseButton( model.isPlayingProperty );

      const stepButton = new StepButton( {
        isPlayingProperty: model.isPlayingProperty,
        listener: () => {
                  model.isPlayingProperty.value = true;
          model.step( GasPropertiesConstants.MODEL_TIME_STEP );
                  model.isPlayingProperty.value = false;
                }
      } );

      assert && assert( !options.children, 'TimeControls sets children' );
      options.children = [ playPauseButton, stepButton ];

      super( options );

      // Disable time controls
      model.isTimeControlsEnabledProperty.link( enabled => {
        playPauseButton.enabled = enabled;
        stepButton.enabled = enabled && !model.isPlayingProperty.value;
      } );
    }
  }

  return gasProperties.register( 'TimeControls', TimeControls );
} );