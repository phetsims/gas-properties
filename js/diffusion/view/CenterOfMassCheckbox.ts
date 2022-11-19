// Copyright 2019-2022, University of Colorado Boulder

/**
 * CenterOfMassCheckbox is the checkbox used to show/hide the center-of-mass indicators on the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import GasPropertiesCheckbox, { GasPropertiesCheckboxOptions } from '../../common/view/GasPropertiesCheckbox.js';
import GasPropertiesIconFactory from '../../common/view/GasPropertiesIconFactory.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';

type SelfOptions = EmptySelfOptions;

type CenterOfMassCheckboxOptions = SelfOptions & PickRequired<GasPropertiesCheckboxOptions, 'tandem'>;

export default class CenterOfMassCheckbox extends GasPropertiesCheckbox {

  public constructor( centerOfMassVisibleProperty: Property<boolean>, providedOptions: CenterOfMassCheckboxOptions ) {

    const options = optionize<CenterOfMassCheckboxOptions, SelfOptions, GasPropertiesCheckboxOptions>()( {

      // GasPropertiesCheckboxOptions
      stringProperty: GasPropertiesStrings.centerOfMassStringProperty,
      icon: GasPropertiesIconFactory.createCenterOfMassIcon(),
      textIconSpacing: 12
    }, providedOptions );

    super( centerOfMassVisibleProperty, options );
  }
}

gasProperties.register( 'CenterOfMassCheckbox', CenterOfMassCheckbox );