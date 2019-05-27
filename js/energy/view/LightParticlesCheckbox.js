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
  const LightParticle = require( 'GAS_PROPERTIES/common/model/LightParticle' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const SpeciesHistogramCheckbox = require( 'GAS_PROPERTIES/energy/view/SpeciesHistogramCheckbox' );

  class LightParticlesCheckbox extends SpeciesHistogramCheckbox {

    /**
     * @param {BooleanProperty} lightVisibleProperty
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options]
     */
    constructor( lightVisibleProperty, modelViewTransform, options ) {
      assert && assert( lightVisibleProperty instanceof BooleanProperty,
        `invalid lightVisibleProperty: ${lightVisibleProperty}` );
      assert && assert( modelViewTransform instanceof ModelViewTransform2,
        `invalid modelViewTransform: ${modelViewTransform}` );

      super( lightVisibleProperty, new LightParticle(), modelViewTransform );
    }
  }

  return gasProperties.register( 'LightParticlesCheckbox', LightParticlesCheckbox );
} );