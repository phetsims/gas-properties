// Copyright 2019, University of Colorado Boulder

/**
 * HeavyParticle is the model for 'heavy' particles, as they are named in the design document.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import gasProperties from '../../gasProperties.js';
import GasPropertiesColorProfile from '../GasPropertiesColorProfile.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';
import Particle from './Particle.js';

class HeavyParticle extends Particle {

  constructor() {
    super( {

      // superclass options
      mass: 28, // equivalent to N2 (nitrogen), in AMU, rounded to the closest integer
      radius: GasPropertiesConstants.HEAVY_PARTICLES_RADIUS, // pm
      colorProperty: GasPropertiesColorProfile.heavyParticleColorProperty,
      highlightColorProperty: GasPropertiesColorProfile.heavyParticleHighlightColorProperty
    } );
  }
}

gasProperties.register( 'HeavyParticle', HeavyParticle );
export default HeavyParticle;