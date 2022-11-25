// Copyright 2018-2022, University of Colorado Boulder

/**
 * PlayResetButton is a button that toggles between 'play' and 'reset' icons. It is used for the Collision Counter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import PlayIconShape from '../../../../scenery-phet/js/PlayIconShape.js';
import UTurnArrowShape from '../../../../scenery-phet/js/UTurnArrowShape.js';
import { Path } from '../../../../scenery/js/imports.js';
import BooleanRectangularToggleButton, { BooleanRectangularToggleButtonOptions } from '../../../../sun/js/buttons/BooleanRectangularToggleButton.js';
import gasProperties from '../../gasProperties.js';

type SelfOptions = EmptySelfOptions;

type PlayResetButtonOptions = SelfOptions & PickRequired<BooleanRectangularToggleButtonOptions, 'tandem'>;

export default class PlayResetButton extends BooleanRectangularToggleButton {

  public constructor( isPlayingProperty: Property<boolean>, providedOptions: PlayResetButtonOptions ) {

    const options = optionize<PlayResetButtonOptions, SelfOptions, BooleanRectangularToggleButtonOptions>()( {

      // BooleanRectangularToggleButtonOptions
      baseColor: '#DFE0E1'
    }, providedOptions );

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

    super( isPlayingProperty, resetIconNode, playIconNode, options );
  }
}

gasProperties.register( 'PlayResetButton', PlayResetButton );