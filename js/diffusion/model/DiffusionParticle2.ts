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
import gasProperties from '../../gasProperties.js';
import DiffusionParticle, { DiffusionParticleOptions } from './DiffusionParticle.js';

type SelfOptions = EmptySelfOptions;

export type DiffusionParticle2Options = SelfOptions &
  StrictOmit<DiffusionParticleOptions, 'colorProperty' | 'highlightColorProperty'>;

export default class DiffusionParticle2 extends DiffusionParticle {

  public constructor( providedOptions?: DiffusionParticle2Options ) {
    super( optionize<DiffusionParticle2Options, SelfOptions, DiffusionParticleOptions>()( {

      // ParticleOptions
      colorProperty: GasPropertiesColors.particle2ColorProperty,
      highlightColorProperty: GasPropertiesColors.particle2HighlightColorProperty
    }, providedOptions ) );
  }
}

gasProperties.register( 'DiffusionParticle2', DiffusionParticle2 );