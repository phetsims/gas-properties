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
  const Particle = require( 'GAS_PROPERTIES/common/model/Particle' );

  class HeavyParticle extends Particle {

    /**
     * @param {Object} [options] see Particle
     */
    constructor( options ) {
      super( _.extend( {
        mass: 28, // N2, rounded to the closest integer
        radius: 0.125, // nm
        colorProperty: GasPropertiesColorProfile.heavyParticleColorProperty,
        highlightColorProperty: GasPropertiesColorProfile.heavyParticleHighlightColorProperty
      }, options ) );
    }
  }

  return gasProperties.register( 'HeavyParticle', HeavyParticle );
} );