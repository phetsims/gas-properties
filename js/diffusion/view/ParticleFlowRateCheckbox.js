// Copyright 2019, University of Colorado Boulder

/**
 * Checkbox to show/hide the center-of-mass indicators on the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesCheckbox = require( 'GAS_PROPERTIES/common/view/GasPropertiesCheckbox' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const HBox = require( 'SCENERY/nodes/HBox' );

  // strings
  const particleFlowRateString = require( 'string!GAS_PROPERTIES/particleFlowRate' );

  class ParticleFlowRateCheckbox extends GasPropertiesCheckbox {

    /**
     * @param {BooleanProperty} particleFlowRateVisibleProperty
     * @param {Object} [options]
     */
    constructor( particleFlowRateVisibleProperty, options ) {

      options = _.extend( {
        textIconSpacing: 12
      }, options );

      const arrowOptions = {
        fill: GasPropertiesColorProfile.diffusionParticle1ColorProperty,
        stroke: null,
        headHeight: 10,
        headWidth: 10,
        tailWidth: 5
      };

      const icon = new HBox( {
        spacing: 4,
        children: [
          new ArrowNode( 0, 0, -15, 0, arrowOptions ),
          new ArrowNode( 0, 0, 20, 0, arrowOptions )
        ]
      } );

      assert && assert( !options.text, 'ParticleFlowRateCheckbox sets text' );
      assert && assert( !options.icon, 'ParticleFlowRateCheckbox sets icon' );
      options = _.extend( {
        text: particleFlowRateString,
        icon: icon
      }, options );

      super( particleFlowRateVisibleProperty, options );
    }
  }

  return gasProperties.register( 'ParticleFlowRateCheckbox', ParticleFlowRateCheckbox );
} );