// Copyright 2019, University of Colorado Boulder

/**
 * Model for particle type 1 (cyan) in the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const DiffusionParticle = require( 'GAS_PROPERTIES/diffusion/model/DiffusionParticle' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );

  class DiffusionParticle1 extends DiffusionParticle {

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