// Copyright 2019, University of Colorado Boulder

/**
 * Model for particle species 2 in the 'Diffusion' screen, referred to as 'orange particles' in the design doc.
 * Where you see variable names like particles2, centerOfMass2Property, etc., they are related to this species.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const Particle = require( 'GAS_PROPERTIES/common/model/Particle' );

  class DiffusionParticle2 extends Particle {

    /**
     * @param {Object} [options] see Particle
     */
    constructor( options ) {
      super( _.extend( {
        colorProperty: GasPropertiesColorProfile.particle2ColorProperty,
        highlightColorProperty: GasPropertiesColorProfile.particle2HighlightColorProperty
      }, options ) );
    }
  }

  return gasProperties.register( 'DiffusionParticle2', DiffusionParticle2 );
} );