// Copyright 2019, University of Colorado Boulder

/**
 * Checkbox for a particle species, for a histogram in the 'Energy' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesCheckbox = require( 'GAS_PROPERTIES/common/view/GasPropertiesCheckbox' );
  const GasPropertiesIconFactory = require( 'GAS_PROPERTIES/common/view/GasPropertiesIconFactory' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Particle = require( 'GAS_PROPERTIES/common/model/Particle' );

  class SpeciesHistogramCheckbox extends GasPropertiesCheckbox {

    /**
     * @param {BooleanProperty} speciesVisibleProperty
     * @param {Particle} particle
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options]
     */
    constructor( speciesVisibleProperty, particle, modelViewTransform, options ) {
      assert && assert( speciesVisibleProperty instanceof BooleanProperty,
        `invalid speciesVisibleProperty: ${speciesVisibleProperty}` );
      assert && assert( particle instanceof Particle, `invalid particle: ${particle}` );
      assert && assert( modelViewTransform instanceof ModelViewTransform2,
        `invalid modelViewTransform: ${modelViewTransform}` );

      super( speciesVisibleProperty, {
        align: 'center',
        spacing: 5,
        icon: GasPropertiesIconFactory.createSpeciesHistogramIcon( particle, modelViewTransform )
      } );
    }
  }

  return gasProperties.register( 'SpeciesHistogramCheckbox', SpeciesHistogramCheckbox );
} );