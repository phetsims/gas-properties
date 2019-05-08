// Copyright 2019, University of Colorado Boulder

/**
 * Checkbox for light particles histogram in the 'Energy' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesIconFactory = require( 'GAS_PROPERTIES/common/view/GasPropertiesIconFactory' );
  const SpeciesCheckbox = require( 'GAS_PROPERTIES/energy/view/SpeciesCheckbox' );

  class LightParticlesCheckbox extends SpeciesCheckbox {

    /**
     * @param {BooleanProperty} lightVisibleProperty
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options]
     */
    constructor( lightVisibleProperty, modelViewTransform, options ) {
      super(
        lightVisibleProperty,
        modelViewTransform,
        GasPropertiesIconFactory.createLightParticleIcon( modelViewTransform ),
        GasPropertiesColorProfile.lightParticleColorProperty
      );
    }
  }

  return gasProperties.register( 'LightParticlesCheckbox', LightParticlesCheckbox );
} );