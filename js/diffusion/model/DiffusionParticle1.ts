// Copyright 2019-2022, University of Colorado Boulder

/**
 * DiffusionParticle1 is the model for particle species 1 in the 'Diffusion' screen, referred to as 'cyan particles'
 * in the design doc. Where you see variable names like particles1, centerOfMass1Property, etc., they are related to
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

export type DiffusionParticle1Options = SelfOptions &
  StrictOmit<DiffusionParticleOptions, 'colorProperty' | 'highlightColorProperty'>;

export default class DiffusionParticle1 extends DiffusionParticle {

  public constructor( providedOptions?: DiffusionParticle1Options ) {
    super( optionize<DiffusionParticle1Options, SelfOptions, DiffusionParticleOptions>()( {

      // DiffusionParticleOptions
      colorProperty: GasPropertiesColors.particle1ColorProperty,
      highlightColorProperty: GasPropertiesColors.particle1HighlightColorProperty
    }, providedOptions ) );
  }
}

gasProperties.register( 'DiffusionParticle1', DiffusionParticle1 );