// Copyright 2019-2022, University of Colorado Boulder

// @ts-nocheck
/**
 * LightParticle is the model for 'light' particles, as they are named in the design document.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import gasProperties from '../../gasProperties.js';
import GasPropertiesColors from '../GasPropertiesColors.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';
import Particle from './Particle.js';

export default class LightParticle extends Particle {

  constructor() {
    super( {

      // superclass options
      mass: 4, // equivalent to He (helium), in AMU, rounded to the closest integer
      radius: GasPropertiesConstants.LIGHT_PARTICLES_RADIUS, // pm
      colorProperty: GasPropertiesColors.lightParticleColorProperty,
      highlightColorProperty: GasPropertiesColors.lightParticleHighlightColorProperty
    } );
  }
}

gasProperties.register( 'LightParticle', LightParticle );