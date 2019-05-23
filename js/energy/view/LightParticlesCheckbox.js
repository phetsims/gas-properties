// Copyright 2019, University of Colorado Boulder

/**
 * Checkbox for light particles histogram in the 'Energy' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesIconFactory = require( 'GAS_PROPERTIES/common/view/GasPropertiesIconFactory' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const SpeciesCheckbox = require( 'GAS_PROPERTIES/energy/view/SpeciesCheckbox' );

  class LightParticlesCheckbox extends SpeciesCheckbox {

    /**
     * @param {BooleanProperty} lightVisibleProperty
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options]
     */
    constructor( lightVisibleProperty, modelViewTransform, options ) {
      assert && assert( lightVisibleProperty instanceof BooleanProperty, `invalid lightVisibleProperty: ${lightVisibleProperty}` );
      assert && assert( modelViewTransform instanceof ModelViewTransform2, `invalid modelViewTransform: ${modelViewTransform}` );

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