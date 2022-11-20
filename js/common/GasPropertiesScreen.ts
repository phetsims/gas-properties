// Copyright 2018-2022, University of Colorado Boulder

/**
 * GasPropertiesScreen is the base class for all Screens in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import ScreenView from '../../../joist/js/ScreenView.js';
import TModel from '../../../joist/js/TModel.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import gasProperties from '../gasProperties.js';
import GasPropertiesColors from './GasPropertiesColors.js';

type SelfOptions = EmptySelfOptions;

export type GasPropertiesScreenOptions = SelfOptions & PickRequired<ScreenOptions, 'name' | 'homeScreenIcon' | 'tandem'>;

export default class GasPropertiesScreen<M extends TModel, V extends ScreenView> extends Screen<M, V> {

  public constructor( createModel: () => M, createView: ( model: M ) => V, providedOptions: GasPropertiesScreenOptions ) {

    const options = optionize<GasPropertiesScreenOptions, SelfOptions, ScreenOptions>()( {

      // ScreenOptions
      backgroundColorProperty: GasPropertiesColors.screenBackgroundColorProperty,
      showUnselectedHomeScreenIconFrame: true, // put a gray border around unselected icons on the home screen
      showScreenIconFrameForNavigationBarFill: 'black' // put a gray border around screen icons when the navigation bar is black
    }, providedOptions );

    super( createModel, createView, options );
  }
}

gasProperties.register( 'GasPropertiesScreen', GasPropertiesScreen );