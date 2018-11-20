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
  const Shape = require( 'KITE/Shape' );
  const UTurnArrowShape = require( 'SCENERY_PHET/UTurnArrowShape' );

  class PlayResetButton extends BooleanRectangularToggleButton {

    /**
     * @param {BooleanProperty} isPlayingProperty
     * @param {Object} [options]
     */
    constructor( isPlayingProperty, options ) {

      options = _.extend( {
        baseColor: '#DFE0E1'
      }, options );

      // play icon
      const playSize = 12;
      const playShape = new Shape()
        .moveTo( 0, 0 )
        .lineTo( playSize, playSize / 2 )
        .lineTo( 0, playSize )
        .close();
      const playIconNode = new Path( playShape, {
        fill: 'black'
      } );

      // reset icon
      const resetIconNode = new Path( new UTurnArrowShape( 10 ), {
        fill: 'black'
      } );

      super( resetIconNode, playIconNode, isPlayingProperty, options );
    }
  }

  return gasProperties.register( 'PlayResetButton', PlayResetButton );
} );