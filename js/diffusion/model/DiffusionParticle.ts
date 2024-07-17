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
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';

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
    assert && assert( mass > 0, `invalid mass: ${mass}` );
    this._mass = mass;
  }

  /**
   * Sets mass and temperature, which changes speed.
   */
  public setMassAndTemperature( mass: number, temperature: number ): void {
    assert && assert( mass > 0, `invalid mass: ${mass}` );
    assert && assert( temperature > 0, `invalid temperature: ${temperature}` );

    this.setMass( mass );

    // |v| = sqrt( 3kT / m )
    this.setSpeed( Math.sqrt( 3 * GasPropertiesConstants.BOLTZMANN * temperature / mass ) );
  }

  /**
   * Radius is settable in the Diffusion screen.
   */
  public setRadius( radius: number ): void {
    assert && assert( radius > 0, `invalid radius: ${radius}` );

    this._radius = radius;
  }
}

gasProperties.register( 'DiffusionParticle', DiffusionParticle );