// Copyright 2019, University of Colorado Boulder

/**
 * Model for particle type 1 in the 'Diffusion' screen.
 * These are referred to as 'cyan particles' in the design doc.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const Particle = require( 'GAS_PROPERTIES/common/model/Particle' );

  class DiffusionParticle1 extends Particle {

    /**
     * @param {Object} [options] see Particle
     */
    constructor( options ) {
      super( _.extend( {
        colorProperty: GasPropertiesColorProfile.particle1ColorProperty,
        highlightColorProperty: GasPropertiesColorProfile.particle1HighlightColorProperty
      }, options ) );
    }
  }

  return gasProperties.register( 'DiffusionParticle1', DiffusionParticle1 );
} );