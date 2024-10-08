// Copyright 2019-2024, University of Colorado Boulder

/**
 * LightParticle is the model for 'light' particles, as they are named in the design document.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesColors from '../GasPropertiesColors.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';
import Particle, { ParticleOptions, ParticleStateObject } from './Particle.js';

type SelfOptions = EmptySelfOptions;

type LightParticleOptions = SelfOptions &
  StrictOmit<ParticleOptions, 'mass' | 'radius' | 'colorProperty' | 'highlightColorProperty'>;

export type LightParticleStateObject = ParticleStateObject;

export default class LightParticle extends Particle {

  public constructor( providedOptions?: LightParticleOptions ) {

    const options = optionize<LightParticleOptions, SelfOptions, ParticleOptions>()( {

      // ParticleOptions
      mass: GasPropertiesConstants.LIGHT_PARTICLES_MASS,
      radius: GasPropertiesConstants.LIGHT_PARTICLES_RADIUS,
      colorProperty: GasPropertiesColors.lightParticleColorProperty,
      highlightColorProperty: GasPropertiesColors.lightParticleHighlightColorProperty
    }, providedOptions );

    super( options );
  }

  /**
   * Deserializes an instance of HeavyParticle.
   */
  private static fromStateObject( stateObject: LightParticleStateObject ): LightParticle {
    return new LightParticle( {
      x: stateObject.x,
      y: stateObject.y,
      previousX: stateObject._previousX,
      previousY: stateObject._previousY,
      vx: stateObject.vx,
      vy: stateObject.vy
    } );
  }

  /**
   * LightParticleIO handles serialization of a LightParticle. It implements 'Data Type Serialization',
   * as described in https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization.
   */
  public static readonly LightParticleIO = new IOType<LightParticle, LightParticleStateObject>( 'LightParticleIO', {
    valueType: LightParticle,
    stateSchema: LightParticle.STATE_SCHEMA,
    documentation: 'PhET-iO Type for light particles.<br>' +
                   '<br>' +
                   LightParticle.STATE_SCHEMA_FIELDS_DOCUMENTATION,
    // toStateObject: Use the default, which is derived from stateSchema.
    fromStateObject: x => LightParticle.fromStateObject( x )
  } );
}

gasProperties.register( 'LightParticle', LightParticle );