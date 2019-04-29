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
  const GasPropertiesCheckbox = require( 'GAS_PROPERTIES/common/view/GasPropertiesCheckbox' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesIconFactory = require( 'GAS_PROPERTIES/common/view/GasPropertiesIconFactory' );
  const HBox = require( 'SCENERY/nodes/HBox' );

  class LightParticlesCheckbox extends GasPropertiesCheckbox {

    /**
     * @param {BooleanProperty} lightVisibleProperty
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options]
     */
    constructor( lightVisibleProperty, modelViewTransform, options ) {
      super( lightVisibleProperty, {
        align: 'center',
        spacing: 5,
        icon: new HBox( {
          children: [
            GasPropertiesIconFactory.createLightParticleIcon( modelViewTransform ),
            GasPropertiesIconFactory.createHistogramIcon( GasPropertiesColorProfile.lightParticleColorProperty )
          ]
        } )
      } );
    }
  }

  return gasProperties.register( 'LightParticlesCheckbox', LightParticlesCheckbox );
} );