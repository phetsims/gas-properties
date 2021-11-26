// Copyright 2018-2021, University of Colorado Boulder

/**
 * PlayResetButton is a button that toggles between 'play' and 'reset' icons. It is used for the Collision Counter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import PlayIconShape from '../../../../scenery-phet/js/PlayIconShape.js';
import UTurnArrowShape from '../../../../scenery-phet/js/UTurnArrowShape.js';
import { Path } from '../../../../scenery/js/imports.js';
import BooleanRectangularToggleButton from '../../../../sun/js/buttons/BooleanRectangularToggleButton.js';
import gasProperties from '../../gasProperties.js';

class PlayResetButton extends BooleanRectangularToggleButton {

  /**
   * @param {BooleanProperty} isPlayingProperty
   * @param {Object} [options]
   */
  constructor( isPlayingProperty, options ) {
    assert && assert( isPlayingProperty instanceof BooleanProperty,
      `invalid isPlayingProperty: ${isPlayingProperty}` );

    options = merge( {

      // superclass options
      baseColor: '#DFE0E1'
    }, options );

    const iconOptions = {
      stroke: 'black',
      lineWidth: 0.5
    };

    // reset icon
    const resetIconNode = new Path( new UTurnArrowShape( 10 ), merge( {}, iconOptions, {
      fill: PhetColorScheme.RED_COLORBLIND
    } ) );

    // play icon
    const playIconNode = new Path( new PlayIconShape( 0.8 * resetIconNode.height, resetIconNode.height ),
      merge( {}, iconOptions, {
        fill: 'rgb( 0, 179, 0 )'
      } )
    );

    super( resetIconNode, playIconNode, isPlayingProperty, options );
  }
}

gasProperties.register( 'PlayResetButton', PlayResetButton );
export default PlayResetButton;