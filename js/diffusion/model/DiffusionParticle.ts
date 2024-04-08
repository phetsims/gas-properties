// Copyright 2024, University of Colorado Boulder

/**
 * DiffusionParticle is the base class for particles in the Diffusion screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Particle, { ParticleOptions } from '../../common/model/Particle.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import gasProperties from '../../gasProperties.js';
import WithOptional from '../../../../phet-core/js/types/WithOptional.js';

type SelfOptions = EmptySelfOptions;

export type DiffusionParticleOptions = SelfOptions & WithOptional<ParticleOptions, 'mass' | 'radius'>;

export default class DiffusionParticle extends Particle {

  protected constructor( providedOptions: DiffusionParticleOptions ) {
    super( optionize<DiffusionParticleOptions, SelfOptions, ParticleOptions>()( {

      // ParticleOptions
      mass: GasPropertiesConstants.DIFFUSION_MASS_RANGE.defaultValue,
      radius: GasPropertiesConstants.DIFFUSION_RADIUS_RANGE.defaultValue
    }, providedOptions ) );
  }
}

gasProperties.register( 'DiffusionParticle', DiffusionParticle );