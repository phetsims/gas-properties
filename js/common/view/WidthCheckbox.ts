// Copyright 2022, University of Colorado Boulder

/**
 * WidthCheckbox is a checkbox to show/hide the width of the container.
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

type WidthCheckboxOptions = SelfOptions & StrictOmit<GasPropertiesCheckboxOptions, 'textStringProperty' | 'icon'>;

export default class WidthCheckbox extends GasPropertiesCheckbox {

  public constructor( widthVisibleProperty: Property<boolean>, providedOptions: WidthCheckboxOptions ) {

    const options = optionize<WidthCheckboxOptions, SelfOptions, GasPropertiesCheckboxOptions>()( {

      // GasPropertiesCheckboxOptions
      textStringProperty: GasPropertiesStrings.widthStringProperty,
      icon: GasPropertiesIconFactory.createContainerWidthIcon()
    }, providedOptions );

    super( widthVisibleProperty, options );
  }
}

gasProperties.register( 'WidthCheckbox', WidthCheckbox );