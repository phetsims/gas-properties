// Copyright 2022, University of Colorado Boulder

/**
 * ScaleCheckbox is the checkbox used to show/hide the scale on the Diffusion container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import GasPropertiesCheckbox, { GasPropertiesCheckboxOptions } from '../../common/view/GasPropertiesCheckbox.js';
import GasPropertiesIconFactory from '../../common/view/GasPropertiesIconFactory.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';

type SelfOptions = EmptySelfOptions;

type ScaleCheckboxOptions = SelfOptions & StrictOmit<GasPropertiesCheckboxOptions, 'textStringProperty' | 'icon'>;

export default class ScaleCheckbox extends GasPropertiesCheckbox {

  public constructor( scaleVisibleProperty: Property<boolean>, providedOptions: ScaleCheckboxOptions ) {

    const options = optionize<ScaleCheckboxOptions, SelfOptions, GasPropertiesCheckboxOptions>()( {

      // GasPropertiesCheckboxOptions
      textStringProperty: GasPropertiesStrings.scaleStringProperty,
      icon: GasPropertiesIconFactory.createScaleIcon()
    }, providedOptions );

    super( scaleVisibleProperty, options );
  }
}

gasProperties.register( 'ScaleCheckbox', ScaleCheckbox );