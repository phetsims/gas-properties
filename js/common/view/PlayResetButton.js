// Copyright 2018-2019, University of Colorado Boulder

/**
 * PlayResetButton is a button that toggles between 'play' and 'reset' icons. It is used for the Collision Counter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const BooleanRectangularToggleButton = require( 'SUN/buttons/BooleanRectangularToggleButton' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  const PlayIconShape = require( 'SCENERY_PHET/PlayIconShape' );
  const UTurnArrowShape = require( 'SCENERY_PHET/UTurnArrowShape' );

  class PlayResetButton extends BooleanRectangularToggleButton {

    /**
     * @param {BooleanProperty} isPlayingProperty
     * @param {Object} [options]
     */
    constructor( isPlayingProperty, options ) {
      assert && assert( isPlayingProperty instanceof BooleanProperty,
        `invalid isPlayingProperty: ${isPlayingProperty}` );

      options = _.extend( {

        // superclass options
        baseColor: '#DFE0E1'
      }, options );

      const iconOptions = {
        stroke: 'black',
        lineWidth: 0.5
      };

      // reset icon
      const resetIconNode = new Path( new UTurnArrowShape( 10 ), _.extend( {}, iconOptions, {
        fill: PhetColorScheme.RED_COLORBLIND
      } ) );

      // play icon
      const playIconNode = new Path( new PlayIconShape( 0.8 * resetIconNode.height, resetIconNode.height ),
        _.extend( {}, iconOptions, {
          fill: 'rgb( 0, 179, 0 )'
        } ) );

      super( resetIconNode, playIconNode, isPlayingProperty, options );
    }
  }

  return gasProperties.register( 'PlayResetButton', PlayResetButton );
} );