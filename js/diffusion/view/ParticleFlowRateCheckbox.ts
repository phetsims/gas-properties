// Copyright 2022, University of Colorado Boulder

/**
 * ParticleFlowRateCheckbox is the checkbox used to show/hide the particle flow rate indicators on the container.
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

type ParticleFlowRateCheckboxOptions = SelfOptions & PickRequired<GasPropertiesCheckboxOptions, 'tandem'>;

export default class ParticleFlowRateCheckbox extends GasPropertiesCheckbox {

  public constructor( particleFlowRateVisibleProperty: Property<boolean>, providedOptions: ParticleFlowRateCheckboxOptions ) {

    const options = optionize<ParticleFlowRateCheckboxOptions, SelfOptions, GasPropertiesCheckboxOptions>()( {

      // GasPropertiesCheckboxOptions
      stringProperty: GasPropertiesStrings.particleFlowRateStringProperty,
      icon: GasPropertiesIconFactory.createParticleFlowRateIcon(),
      textIconSpacing: 12
    }, providedOptions );

    super( particleFlowRateVisibleProperty, options );
  }
}

gasProperties.register( 'ParticleFlowRateCheckbox', ParticleFlowRateCheckbox );