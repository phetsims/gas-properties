// Copyright 2019, University of Colorado Boulder

/**
 * SpeciesHistogramCheckbox is the base class for checkboxes that show histogram data for a specific particle species.
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
  const merge = require( 'PHET_CORE/merge' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Particle = require( 'GAS_PROPERTIES/common/model/Particle' );
  const Tandem = require( 'TANDEM/Tandem' );

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

      options = merge( {
        align: 'center',
        spacing: 5,

        // phet-io
        tandem: Tandem.required
      }, options );

      assert && assert( !options.icon, 'SpeciesHistogramCheckbox sets icon' );
      options.icon = GasPropertiesIconFactory.createSpeciesHistogramIcon( particle, modelViewTransform );

      super( speciesVisibleProperty, options );
    }
  }

  return gasProperties.register( 'SpeciesHistogramCheckbox', SpeciesHistogramCheckbox );
} );