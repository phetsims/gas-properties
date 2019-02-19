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
     * @param {Vector2} location
     * @param {number} angle
     * @param {Object} [options] see Particle
     */
    constructor( location, angle, options ) {

      options = _.extend( {
        mass: 4, // He, rounded to the closest integer
        radius: 3.5,
        colorProperty: GasPropertiesColorProfile.lightParticleColorProperty
      }, options );

      super( location, angle, options );
    }
  }

  return gasProperties.register( 'LightParticle', LightParticle );
} );