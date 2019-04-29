// Copyright 2019, University of Colorado Boulder

/**
 * Checkbox for heavy particles histogram in the 'Energy' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesCheckbox = require( 'GAS_PROPERTIES/common/view/GasPropertiesCheckbox' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesIconFactory = require( 'GAS_PROPERTIES/common/view/GasPropertiesIconFactory' );
  const HBox = require( 'SCENERY/nodes/HBox' );

  class HeavyParticlesCheckbox extends GasPropertiesCheckbox {

    /**
     * @param {BooleanProperty} heavyVisibleProperty
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options]
     */
    constructor( heavyVisibleProperty, modelViewTransform, options ) {
      super( heavyVisibleProperty, {
        align: 'center',
        spacing: 5,
        icon: new HBox( {
          children: [
            GasPropertiesIconFactory.createHeavyParticleIcon( modelViewTransform ),
            GasPropertiesIconFactory.createHistogramIcon( GasPropertiesColorProfile.heavyParticleColorProperty )
          ]
        } )
      } );
    }
  }

  return gasProperties.register( 'HeavyParticlesCheckbox', HeavyParticlesCheckbox );
} );