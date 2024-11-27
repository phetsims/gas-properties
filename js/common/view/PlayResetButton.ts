// Copyright 2018-2024, University of Colorado Boulder

/**
 * PlayResetButton is a button that toggles between 'play' and 'reset' icons. It is used for the Collision Counter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import PlayIconShape from '../../../../scenery-phet/js/PlayIconShape.js';
import UTurnArrowShape from '../../../../scenery-phet/js/UTurnArrowShape.js';
import { Path, PathOptions } from '../../../../scenery/js/imports.js';
import BooleanRectangularToggleButton from '../../../../sun/js/buttons/BooleanRectangularToggleButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';

export default class PlayResetButton extends BooleanRectangularToggleButton {

  public constructor( isPlayingProperty: Property<boolean>, tandem: Tandem ) {

    const iconOptions: PathOptions = {
      stroke: 'black',
      lineWidth: 0.5
    };

    // reset icon
    const resetIconNode = new Path( new UTurnArrowShape( 10 ),
      combineOptions<PathOptions>( {}, iconOptions, {
        fill: PhetColorScheme.RED_COLORBLIND
      } ) );

    // play icon
    const playIconNode = new Path( new PlayIconShape( 0.8 * resetIconNode.height, resetIconNode.height ),
      combineOptions<PathOptions>( {}, iconOptions, {
        fill: 'rgb( 0, 179, 0 )'
      } )
    );

    super( isPlayingProperty, resetIconNode, playIconNode, {

      // BooleanRectangularToggleButtonOptions
      isDisposable: false,
      baseColor: '#DFE0E1',
      tandem: tandem,
      phetioVisiblePropertyInstrumented: false,
      phetioEnabledPropertyInstrumented: false
    } );
  }
}

gasProperties.register( 'PlayResetButton', PlayResetButton );