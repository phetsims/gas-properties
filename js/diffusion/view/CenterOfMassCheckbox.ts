// Copyright 2022-2024, University of Colorado Boulder

/**
 * CenterOfMassCheckbox is the checkbox used to show/hide the center-of-mass indicators on the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import GasPropertiesCheckbox, { GasPropertiesCheckboxOptions } from '../../common/view/GasPropertiesCheckbox.js';
import GasPropertiesIconFactory from '../../common/view/GasPropertiesIconFactory.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';

type SelfOptions = EmptySelfOptions;

type CenterOfMassCheckboxOptions = SelfOptions & StrictOmit<GasPropertiesCheckboxOptions, 'textStringProperty' | 'icon'>;

export default class CenterOfMassCheckbox extends GasPropertiesCheckbox {

  public constructor( centerOfMassVisibleProperty: Property<boolean>,
                      numberOfParticleTypesProperty: TReadOnlyProperty<number>,
                      providedOptions: CenterOfMassCheckboxOptions ) {

    const options = optionize<CenterOfMassCheckboxOptions, SelfOptions, GasPropertiesCheckboxOptions>()( {

      // GasPropertiesCheckboxOptions
      textStringProperty: GasPropertiesStrings.centerOfMassStringProperty,
      icon: GasPropertiesIconFactory.createCenterOfMassIcon( numberOfParticleTypesProperty ),
      textIconSpacing: 12
    }, providedOptions );

    super( centerOfMassVisibleProperty, options );
  }
}

gasProperties.register( 'CenterOfMassCheckbox', CenterOfMassCheckbox );