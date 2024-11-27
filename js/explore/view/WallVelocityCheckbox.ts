// Copyright 2022-2024, University of Colorado Boulder

/**
 * WallVelocityCheckbox is a checkbox to show/hide the velocity vector for the container's left wall.
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

type WallVelocityCheckboxOptions = SelfOptions & StrictOmit<GasPropertiesCheckboxOptions, 'textStringProperty' | 'icon'>;

export default class WallVelocityCheckbox extends GasPropertiesCheckbox {

  public constructor( wallVelocityVisibleProperty: Property<boolean>, providedOptions: WallVelocityCheckboxOptions ) {

    const options = optionize<WallVelocityCheckboxOptions, SelfOptions, GasPropertiesCheckboxOptions>()( {

      // GasPropertiesCheckboxOptions
      textStringProperty: GasPropertiesStrings.wallVelocityStringProperty,
      icon: GasPropertiesIconFactory.createWallVelocityIcon()
    }, providedOptions );

    super( wallVelocityVisibleProperty, options );
  }
}

gasProperties.register( 'WallVelocityCheckbox', WallVelocityCheckbox );