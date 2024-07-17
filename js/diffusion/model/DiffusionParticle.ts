// Copyright 2024, University of Colorado Boulder

/**
 * DiffusionParticle is the base class for particles in the Diffusion screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Particle, { ParticleOptions } from '../../common/model/Particle.js';
import gasProperties from '../../gasProperties.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

type SelfOptions = EmptySelfOptions;

export type DiffusionParticleOptions = SelfOptions &
  WithRequired<ParticleOptions, 'mass' | 'radius' | 'colorProperty' | 'highlightColorProperty'>;

export default class DiffusionParticle extends Particle {

  protected constructor( providedOptions: DiffusionParticleOptions ) {
    super( providedOptions );
  }

  /**
   * Mass is settable in the Diffusion screen.
   */
  public setMass( mass: number ): void {
    this._mass = mass;
  }

  /**
   * Radius is settable in the Diffusion screen.
   */
  public setRadius( radius: number ): void {
    this._radius = radius;
  }
}

gasProperties.register( 'DiffusionParticle', DiffusionParticle );