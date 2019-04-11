// Copyright 2019, University of Colorado Boulder

/**
 * Model for the 2nd type of particle in the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const DiffusionParticle = require( 'GAS_PROPERTIES/diffusion/model/DiffusionParticle' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );

  class DiffusionParticle2 extends DiffusionParticle {

    /**
     * @param {Object} [options] see Particle
     */
    constructor( options ) {
      super( _.extend( {
        colorProperty: GasPropertiesColorProfile.diffusionDiffusionParticle2ColorProperty,
        highlightColorProperty: GasPropertiesColorProfile.diffusionDiffusionParticle2ColorProperty
      }, options ) );
    }
  }

  return gasProperties.register( 'DiffusionParticle2', DiffusionParticle2 );
} );