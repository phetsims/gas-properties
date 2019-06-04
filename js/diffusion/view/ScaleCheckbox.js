// Copyright 2019, University of Colorado Boulder

/**
 * Checkbox to show/hide the scale on the Diffusion container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesCheckbox = require( 'GAS_PROPERTIES/common/view/GasPropertiesCheckbox' );

  // strings
  const scaleString = require( 'string!GAS_PROPERTIES/scale' );

  class ScaleCheckbox extends GasPropertiesCheckbox {

    /**
     * @param {BooleanProperty} scaleVisibleProperty
     * @param {Object} [options]
     */
    constructor( scaleVisibleProperty, options ) {
      assert && assert( scaleVisibleProperty instanceof BooleanProperty,
        `invalid scaleVisibleProperty: ${scaleVisibleProperty}` );

      if ( options ) {
        assert && assert( !options.text, 'ScaleCheckbox sets text' );
      }

      options = _.extend( {
        text: scaleString,
        textMaxWidth: 100 // determined empirically
      }, options );

      super( scaleVisibleProperty, options );
    }
  }

  return gasProperties.register( 'ScaleCheckbox', ScaleCheckbox );
} );