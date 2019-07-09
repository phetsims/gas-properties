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

    // TODO #143 prevent override of any options
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