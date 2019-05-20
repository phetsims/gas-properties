// Copyright 2019, University of Colorado Boulder

/**
 * Model for heavy particles.
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

    /**
     * @param {Object} [options] see Particle
     */
    constructor( options ) {
      super( _.extend( {
        mass: 28, // N2, in AMU, rounded to the closest integer
        radius: GasPropertiesConstants.HEAVY_PARTICLES_RADIUS, // pm
        colorProperty: GasPropertiesColorProfile.heavyParticleColorProperty,
        highlightColorProperty: GasPropertiesColorProfile.heavyParticleHighlightColorProperty
      }, options ) );
    }
  }

  return gasProperties.register( 'HeavyParticle', HeavyParticle );
} );