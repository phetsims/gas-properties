// Copyright 2019-2024, University of Colorado Boulder

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
import { ParticleStateObject } from '../../common/model/Particle.js';
import IOType from '../../../../tandem/js/types/IOType.js';

type SelfOptions = EmptySelfOptions;

export type DiffusionParticle2Options = SelfOptions &
  StrictOmit<DiffusionParticleOptions, 'colorProperty' | 'highlightColorProperty'>;

export type DiffusionParticle2StateObject = ParticleStateObject;

export default class DiffusionParticle2 extends DiffusionParticle {

  public constructor( providedOptions?: DiffusionParticle2Options ) {
    super( optionize<DiffusionParticle2Options, SelfOptions, DiffusionParticleOptions>()( {

      // ParticleOptions
      colorProperty: GasPropertiesColors.diffusionParticle2ColorProperty,
      highlightColorProperty: GasPropertiesColors.diffusionParticle2HighlightColorProperty
    }, providedOptions ) );
  }

  /**
   * Deserializes an instance of DiffusionParticle1.
   */
  private static fromStateObject( stateObject: DiffusionParticle2StateObject ): DiffusionParticle2 {
    return new DiffusionParticle2( {
      x: stateObject.x,
      y: stateObject.y,
      previousX: stateObject.previousX,
      previousY: stateObject.previousY,
      vx: stateObject.vx,
      vy: stateObject.vy
    } );
  }

  /**
   * DiffusionParticle2IO handles serialization a DiffusionParticle2. It implements 'Data Type Serialization',
   * as described in https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization.
   */
  public static readonly DiffusionParticle2IO = new IOType<DiffusionParticle2, DiffusionParticle2StateObject>( 'DiffusionParticle2IO', {
    valueType: DiffusionParticle2,
    stateSchema: DiffusionParticle2.STATE_SCHEMA,
    // toStateObject: Use the default, which is derived from stateSchema.
    fromStateObject: DiffusionParticle2.fromStateObject
  } );
}

gasProperties.register( 'DiffusionParticle2', DiffusionParticle2 );