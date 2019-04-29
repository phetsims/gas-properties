// Copyright 2018, University of Colorado Boulder

/**
 * Button that toggles between 'play' and 'reset' icons, used for the Collision Counter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanRectangularToggleButton = require( 'SUN/buttons/BooleanRectangularToggleButton' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  const PlayIconShape = require( 'SCENERY_PHET/PlayIconShape' );
  const UTurnArrowShape = require( 'SCENERY_PHET/UTurnArrowShape' );

  // constants
  const PLAY_COLOR = 'rgb( 0, 179, 0 )';
  const RESET_COLOR = PhetColorScheme.RED_COLORBLIND;

  class PlayResetButton extends BooleanRectangularToggleButton {

    /**
     * @param {BooleanProperty} isPlayingProperty
     * @param {Object} [options]
     */
    constructor( isPlayingProperty, options ) {

      options = _.extend( {
        baseColor: '#DFE0E1'
      }, options );

      // reset icon
      const resetIconNode = new Path( new UTurnArrowShape( 10 ), {
        fill: 'black'
      } );

      // play icon
      const playIconNode = new Path( new PlayIconShape( 0.8 * resetIconNode.height, resetIconNode.height ), {
        fill: 'black'
      } );

      super( resetIconNode, playIconNode, isPlayingProperty, options );

      isPlayingProperty.link( isPlaying => {
        this.setBaseColor( isPlaying ? RESET_COLOR : PLAY_COLOR );
      } );
    }
  }

  return gasProperties.register( 'PlayResetButton', PlayResetButton );
} );