// Copyright 2022, University of Colorado Boulder

/**
 * SpeciesHistogramCheckbox is the checkbox that shows histogram data for a specific particle species.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Particle from '../../common/model/Particle.js';
import GasPropertiesCheckbox, { GasPropertiesCheckboxOptions } from '../../common/view/GasPropertiesCheckbox.js';
import GasPropertiesIconFactory from '../../common/view/GasPropertiesIconFactory.js';
import gasProperties from '../../gasProperties.js';
import HeavyParticle from '../../common/model/HeavyParticle.js';
import LightParticle from '../../common/model/LightParticle.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

type SelfOptions = EmptySelfOptions;

export type SpeciesHistogramCheckboxOptions = SelfOptions & StrictOmit<GasPropertiesCheckboxOptions, 'textStringProperty' | 'icon'>;

export default class SpeciesHistogramCheckbox extends GasPropertiesCheckbox {

  // private - use static create methods
  private constructor( speciesVisibleProperty: Property<boolean>, particle: Particle,
                      modelViewTransform: ModelViewTransform2, providedOptions: SpeciesHistogramCheckboxOptions ) {

    const options = optionize<SpeciesHistogramCheckboxOptions, SelfOptions, GasPropertiesCheckboxOptions>()( {

      // GasPropertiesCheckboxOptions
      icon: GasPropertiesIconFactory.createSpeciesHistogramIcon( particle, modelViewTransform ),
      spacing: 5
    }, providedOptions );

    super( speciesVisibleProperty, options );
  }

  /**
   * Creates a checkbox for heavy-particle species.
   */
  public static createHeavyParticlesCheckbox(
    speciesVisibleProperty: Property<boolean>,
    modelViewTransform: ModelViewTransform2, providedOptions: SpeciesHistogramCheckboxOptions ): SpeciesHistogramCheckbox {
    return new SpeciesHistogramCheckbox( speciesVisibleProperty, new HeavyParticle(),
      modelViewTransform, providedOptions );
  }

  /**
   * Creates a checkbox for light-particle species.
   */
  public static createLightParticlesCheckbox(
    speciesVisibleProperty: Property<boolean>,
    modelViewTransform: ModelViewTransform2, providedOptions: SpeciesHistogramCheckboxOptions ): SpeciesHistogramCheckbox {
    return new SpeciesHistogramCheckbox( speciesVisibleProperty, new LightParticle(),
      modelViewTransform, providedOptions );
  }
}

gasProperties.register( 'SpeciesHistogramCheckbox', SpeciesHistogramCheckbox );