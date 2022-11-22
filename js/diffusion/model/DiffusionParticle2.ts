// Copyright 2019-2022, University of Colorado Boulder

/**
 * DiffusionParticle2 is the model for particle species 2 in the 'Diffusion' screen, referred to as 'orange particles'
 * in the design doc. Where you see variable names like particles2, centerOfMass2Property, etc., they are related to
 * this species.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import Particle, { ParticleOptions } from '../../common/model/Particle.js';
import gasProperties from '../../gasProperties.js';

type SelfOptions = EmptySelfOptions;

export type DiffusionParticle2Options = SelfOptions & StrictOmit<ParticleOptions, 'colorProperty' | 'highlightColorProperty'>;

export default class DiffusionParticle2 extends Particle {

  public constructor( providedOptions?: DiffusionParticle2Options ) {
    super( optionize<DiffusionParticle2Options, SelfOptions, ParticleOptions>()( {

      // ParticleOptions
      colorProperty: GasPropertiesColors.particle2ColorProperty,
      highlightColorProperty: GasPropertiesColors.particle2HighlightColorProperty
    }, providedOptions ) );
  }
}

gasProperties.register( 'DiffusionParticle2', DiffusionParticle2 );