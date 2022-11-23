// Copyright 2019-2022, University of Colorado Boulder

/**
 * HeavyParticle is the model for 'heavy' particles, as they are named in the design document.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import gasProperties from '../../gasProperties.js';
import GasPropertiesColors from '../GasPropertiesColors.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';
import Particle from './Particle.js';

export default class HeavyParticle extends Particle {

  public constructor() {
    super( {

      // ParticleOptions
      mass: 28, // equivalent to N2 (nitrogen), in AMU, rounded to the closest integer
      radius: GasPropertiesConstants.HEAVY_PARTICLES_RADIUS, // pm
      colorProperty: GasPropertiesColors.heavyParticleColorProperty,
      highlightColorProperty: GasPropertiesColors.heavyParticleHighlightColorProperty
    } );
  }
}

gasProperties.register( 'HeavyParticle', HeavyParticle );