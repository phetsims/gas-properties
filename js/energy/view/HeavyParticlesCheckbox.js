// Copyright 2019, University of Colorado Boulder

/**
 * HeavyParticlesCheckbox is a checkbox used to show histogram data for heavy particles in the 'Energy' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const HeavyParticle = require( 'GAS_PROPERTIES/common/model/HeavyParticle' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const SpeciesHistogramCheckbox = require( 'GAS_PROPERTIES/energy/view/SpeciesHistogramCheckbox' );

  class HeavyParticlesCheckbox extends SpeciesHistogramCheckbox {

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

      super( heavyVisibleProperty, new HeavyParticle(), modelViewTransform );
    }
  }

  return gasProperties.register( 'HeavyParticlesCheckbox', HeavyParticlesCheckbox );
} );