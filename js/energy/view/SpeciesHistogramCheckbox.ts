// Copyright 2019-2022, University of Colorado Boulder

/**
 * SpeciesHistogramCheckbox is the base class for checkboxes that show histogram data for a specific particle species.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Particle from '../../common/model/Particle.js';
import GasPropertiesCheckbox, { GasPropertiesCheckboxOptions } from '../../common/view/GasPropertiesCheckbox.js';
import GasPropertiesIconFactory from '../../common/view/GasPropertiesIconFactory.js';
import gasProperties from '../../gasProperties.js';

type SelfOptions = EmptySelfOptions;

type SpeciesHistogramCheckboxOptions = SelfOptions & PickRequired<GasPropertiesCheckboxOptions, 'tandem'>;

export default class SpeciesHistogramCheckbox extends GasPropertiesCheckbox {

  public constructor( speciesVisibleProperty: Property<boolean>, particle: Particle,
                      modelViewTransform: ModelViewTransform2, providedOptions: SpeciesHistogramCheckboxOptions ) {

    const options = optionize<SpeciesHistogramCheckboxOptions, SelfOptions, GasPropertiesCheckboxOptions>()( {

      // GasPropertiesCheckboxOptions
      icon: GasPropertiesIconFactory.createSpeciesHistogramIcon( particle, modelViewTransform ),
      spacing: 5
    }, providedOptions );

    super( speciesVisibleProperty, options );
  }
}

gasProperties.register( 'SpeciesHistogramCheckbox', SpeciesHistogramCheckbox );