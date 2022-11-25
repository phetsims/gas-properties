// Copyright 2022, University of Colorado Boulder

/**
 * StopwatchCheckbox is the 'Stopwatch' check box, used to control visibility of the stopwatch.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import GasPropertiesCheckbox, { GasPropertiesCheckboxOptions } from './GasPropertiesCheckbox.js';
import GasPropertiesIconFactory from './GasPropertiesIconFactory.js';

type SelfOptions = EmptySelfOptions;

type StopwatchCheckboxOptions = SelfOptions & StrictOmit<GasPropertiesCheckboxOptions, 'textStringProperty' | 'icon'>;

export default class StopwatchCheckbox extends GasPropertiesCheckbox {

  public constructor( stopwatchVisibleProperty: Property<boolean>, providedOptions: StopwatchCheckboxOptions ) {

    const options = optionize<StopwatchCheckboxOptions, SelfOptions, GasPropertiesCheckboxOptions>()( {

      // GasPropertiesCheckboxOptions
      textStringProperty: GasPropertiesStrings.stopwatchStringProperty,
      icon: GasPropertiesIconFactory.createStopwatchIcon()
    }, providedOptions );

    super( stopwatchVisibleProperty, options );
  }
}

gasProperties.register( 'StopwatchCheckbox', StopwatchCheckbox );