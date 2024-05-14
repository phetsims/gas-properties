// Copyright 2019-2024, University of Colorado Boulder

/**
 * HeavyParticle is the model for 'heavy' particles, as they are named in the design document.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import gasProperties from '../../gasProperties.js';
import GasPropertiesColors from '../GasPropertiesColors.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';
import Particle, { ParticleOptions, ParticleStateObject } from './Particle.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

type SelfOptions = EmptySelfOptions;

type HeavyParticleOptions = SelfOptions &
  StrictOmit<ParticleOptions, 'mass' | 'radius' | 'colorProperty' | 'highlightColorProperty'>;

export type HeavyParticleStateObject = ParticleStateObject;

export default class HeavyParticle extends Particle {

  public constructor( providedOptions?: HeavyParticleOptions ) {

    const options = optionize<HeavyParticleOptions, SelfOptions, ParticleOptions>()( {

      // ParticleOptions
      mass: GasPropertiesConstants.HEAVY_PARTICLES_MASS,
      radius: GasPropertiesConstants.HEAVY_PARTICLES_RADIUS,
      colorProperty: GasPropertiesColors.heavyParticleColorProperty,
      highlightColorProperty: GasPropertiesColors.heavyParticleHighlightColorProperty
    }, providedOptions );

    super( options );
  }

  /**
   * Deserializes an instance of HeavyParticle.
   */
  private static fromStateObject( stateObject: HeavyParticleStateObject ): HeavyParticle {
    return new HeavyParticle( {
      x: stateObject.x,
      y: stateObject.y,
      previousX: stateObject._previousX,
      previousY: stateObject._previousY,
      vx: stateObject.vx,
      vy: stateObject.vy
    } );
  }

  /**
   * HeavyParticleIO handles serialization a HeavyParticle. It implements 'Data Type Serialization',
   * as described in https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization.
   */
  public static readonly HeavyParticleIO = new IOType<HeavyParticle, HeavyParticleStateObject>( 'HeavyParticleIO', {
    valueType: HeavyParticle,
    stateSchema: HeavyParticle.STATE_SCHEMA,
    documentation: 'PhET-iO Type for heavy particles.<br>' +
                   '<br>' +
                   HeavyParticle.STATE_SCHEMA_FIELDS_DOCUMENTATION,
    // toStateObject: Use the default, which is derived from stateSchema.
    fromStateObject: HeavyParticle.fromStateObject
  } );
}

gasProperties.register( 'HeavyParticle', HeavyParticle );