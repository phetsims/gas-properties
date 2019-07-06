// Copyright 2019, University of Colorado Boulder

/**
 * LightParticle is the model for 'light' particles, as they are named in the design document.
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

  class LightParticle extends Particle {

    // REVIEW: This seems like it has potential to be abused, such as passing in options that would make this "Light"
    // particle heavier than HeavyParticle.  As far as I could tell, the code doesn't vary these options, at least not
    // all of them.  Perhaps a factory function on the Particle class would be better.

    /**
     * @param {Object} [options] see Particle
     */
    constructor( options ) {
      super( _.extend( {

        // superclass options
        mass: 4, // equivalent to He (helium), in AMU, rounded to the closest integer
        radius: GasPropertiesConstants.LIGHT_PARTICLES_RADIUS, // pm
        colorProperty: GasPropertiesColorProfile.lightParticleColorProperty,
        highlightColorProperty: GasPropertiesColorProfile.lightParticleHighlightColorProperty
      }, options ) );
    }
  }

  return gasProperties.register( 'LightParticle', LightParticle );
} );