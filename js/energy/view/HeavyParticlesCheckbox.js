// Copyright 2019, University of Colorado Boulder

/**
 * Checkbox for heavy particles histogram in the 'Energy' screen.
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

  class HeavyParticlesCheckbox extends SpeciesCheckbox {

    /**
     * @param {BooleanProperty} heavyVisibleProperty
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options]
     */
    constructor( heavyVisibleProperty, modelViewTransform, options ) {
      assert && assert( heavyVisibleProperty instanceof BooleanProperty,
        `invalid heavyVisibleProperty: ${heavyVisibleProperty}` );
      assert && assert( modelViewTransform instanceof ModelViewTransform2,
        `invalid modelViewTransform: ${modelViewTransform}` );

      super(
        heavyVisibleProperty,
        modelViewTransform,
        GasPropertiesIconFactory.createHeavyParticleIcon( modelViewTransform ),
        GasPropertiesColorProfile.heavyParticleColorProperty
      );
    }
  }

  return gasProperties.register( 'HeavyParticlesCheckbox', HeavyParticlesCheckbox );
} );