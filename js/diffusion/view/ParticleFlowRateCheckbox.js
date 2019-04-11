// Copyright 2019, University of Colorado Boulder

/**
 * Checkbox to show/hide the center-of-mass indicators on the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesCheckbox = require( 'GAS_PROPERTIES/common/view/GasPropertiesCheckbox' );

  // strings
  const particleFlowRateString = require( 'string!GAS_PROPERTIES/particleFlowRate' );

  class ParticleFlowRateCheckbox extends GasPropertiesCheckbox {

    /**
     * @param {BooleanProperty} particleFlowRateVisibleProperty
     * @param {Object} [options]
     */
    constructor( particleFlowRateVisibleProperty, options ) {

      if ( options ) {
        assert && assert( !options.text, 'ParticleFlowRateCheckbox sets text' );
        assert && assert( !options.icon, 'ParticleFlowRateCheckbox sets icon' );
      }

      options = _.extend( {
        text: particleFlowRateString
        //TODO icon
      }, options );

      super( particleFlowRateVisibleProperty, options );
    }
  }

  return gasProperties.register( 'ParticleFlowRateCheckbox', ParticleFlowRateCheckbox );
} );