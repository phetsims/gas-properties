// Copyright 2019-2024, University of Colorado Boulder

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
import { ParticleStateObject } from '../../common/model/Particle.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';

type SelfOptions = EmptySelfOptions;

export type DiffusionParticle1Options = SelfOptions &
  StrictOmit<DiffusionParticleOptions, 'colorProperty' | 'highlightColorProperty'>;

export type DiffusionParticle1StateObject = ParticleStateObject;

export default class DiffusionParticle1 extends DiffusionParticle {

  public constructor( providedOptions: DiffusionParticle1Options ) {
    super( optionize<DiffusionParticle1Options, SelfOptions, DiffusionParticleOptions>()( {

      // DiffusionParticleOptions
      colorProperty: GasPropertiesColors.diffusionParticle1ColorProperty,
      highlightColorProperty: GasPropertiesColors.diffusionParticle1HighlightColorProperty
    }, providedOptions ) );
  }

  /**
   * Creates a DiffusionParticle1 with default configuration. This is used for creating icons.
   */
  public static withDefaults(): DiffusionParticle1 {
    return new DiffusionParticle1( {
      mass: GasPropertiesConstants.DIFFUSION_MASS_RANGE.defaultValue,
      radius: GasPropertiesConstants.DIFFUSION_RADIUS_RANGE.defaultValue
    } );
  }

  /**
   * Deserializes an instance of DiffusionParticle1.
   */
  private static fromStateObject( stateObject: DiffusionParticle1StateObject ): DiffusionParticle1 {
    return new DiffusionParticle1( {
      x: stateObject.x,
      y: stateObject.y,
      previousX: stateObject._previousX,
      previousY: stateObject._previousY,
      vx: stateObject.vx,
      vy: stateObject.vy,
      mass: stateObject.mass,
      radius: stateObject.radius
    } );
  }

  /**
   * DiffusionParticle1IO handles serialization a DiffusionParticle1. It implements 'Data Type Serialization',
   * as described in https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization.
   */
  public static readonly DiffusionParticle1IO = new IOType<DiffusionParticle1, DiffusionParticle1StateObject>( 'DiffusionParticle1IO', {
    valueType: DiffusionParticle1,
    stateSchema: DiffusionParticle1.STATE_SCHEMA,
    documentation: 'PhET-iO Type for particles referred to as "type 1". ' +
                   'The settings for these particles appear in the left column of the control panel.<br>' +
                   '<br>' +
                   DiffusionParticle1.STATE_SCHEMA_FIELDS_DOCUMENTATION,
    // toStateObject: Use the default, which is derived from stateSchema.
    fromStateObject: DiffusionParticle1.fromStateObject
  } );
}

gasProperties.register( 'DiffusionParticle1', DiffusionParticle1 );