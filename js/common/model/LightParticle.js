// Copyright 2019, University of Colorado Boulder

/**
 * Model for light particles.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const Particle = require( 'GAS_PROPERTIES/common/model/Particle' );

  class LightParticle extends Particle {

    /**
     * @param {Object} [options] see Particle
     */
    constructor( options ) {
      super( _.extend( {
        mass: 4, // He, rounded to the closest integer
        radius: 87.5, // nm
        colorProperty: GasPropertiesColorProfile.lightParticleColorProperty,
        highlightColorProperty: GasPropertiesColorProfile.lightParticleHighlightColorProperty
      }, options ) );
    }
  }

  return gasProperties.register( 'LightParticle', LightParticle );
} );