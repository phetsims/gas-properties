// Copyright 2019, University of Colorado Boulder

/**
 * HeavyParticle is the model for 'heavy' particles, as they are named in the design document.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const Particle = require( 'GAS_PROPERTIES/common/model/Particle' );

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

  return gasProperties.register( 'HeavyParticle', HeavyParticle );
} );