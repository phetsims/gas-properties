// Copyright 2019, University of Colorado Boulder

/**
 * Model for particle species 1 in the 'Diffusion' screen, referred to as 'cyan particles' in the design doc.
 * Where you see variable names like particles1, centerOfMass1Property, etc., they are related to this species.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const Particle = require( 'GAS_PROPERTIES/common/model/Particle' );

  class DiffusionParticle1 extends Particle {

    /**
     * @param {Object} [options] see Particle
     */
    constructor( options ) {
      super( _.extend( {

        // superclass options
        radius: GasPropertiesConstants.RADIUS_RANGE.defaultValue,
        colorProperty: GasPropertiesColorProfile.particle1ColorProperty,
        highlightColorProperty: GasPropertiesColorProfile.particle1HighlightColorProperty
      }, options ) );
    }
  }

  return gasProperties.register( 'DiffusionParticle1', DiffusionParticle1 );
} );