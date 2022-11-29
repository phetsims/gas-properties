// Copyright 2018-2022, University of Colorado Boulder

/**
 * PlayResetButton is a button that toggles between 'play' and 'reset' icons. It is used for the Collision Counter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import PlayIconShape from '../../../../scenery-phet/js/PlayIconShape.js';
import UTurnArrowShape from '../../../../scenery-phet/js/UTurnArrowShape.js';
import { Path, PathOptions } from '../../../../scenery/js/imports.js';
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

    super( isPlayingProperty, resetIconNode, playIconNode, options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

gasProperties.register( 'PlayResetButton', PlayResetButton );