// Copyright 2018-2019, University of Colorado Boulder

/**
 * Controls to play, pause and step the simulation clock.
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

  class PlayPauseStepControl extends HBox {

    /**
     * @param {BaseModel} model
     * @param {Object} [options]
     * @constructor
     */
    constructor( model, options ) {

      options = _.extend( {

        enabledProperty: null, // {null|BooleanProperty}

        // HBox options
        spacing: 15,
        scale: 0.75
      }, options );

      const playPauseButton = new PlayPauseButton( model.isPlayingProperty );

      const stepButton = new StepButton( {
        isPlayingProperty: model.isPlayingProperty,
        listener: () => {
          model.isPlayingProperty.value = true;
          const seconds = model.timeTransform.inverse( GasPropertiesConstants.MODEL_TIME_STEP );
          model.step( seconds );
          model.isPlayingProperty.value = false;
        }
      } );

      assert && assert( !options.children, 'PlayPauseStepControl sets children' );
      options = _.extend( {
        children: [ playPauseButton, stepButton ]
      }, options );

      super( options );

      // Disable time controls
      if ( options.enabledProperty ) {
        options.enabledProperty.link( enabled => {
          playPauseButton.enabled = enabled;
          stepButton.enabled = enabled && !model.isPlayingProperty.value;
        } );
      }
    }
  }

  return gasProperties.register( 'PlayPauseStepControl', PlayPauseStepControl );
} );