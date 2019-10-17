// Copyright 2018-2019, University of Colorado Boulder

/**
 * WidthCheckbox is a checkbox to show/hide the width of the container.
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

  // strings
  const widthString = require( 'string!GAS_PROPERTIES/width' );

  class WidthCheckbox extends GasPropertiesCheckbox {

    /**
     * @param {BooleanProperty} widthVisibleProperty
     * @param {Object} [options]
     */
    constructor( widthVisibleProperty, options ) {
      assert && assert( widthVisibleProperty instanceof BooleanProperty,
        `invalid widthVisibleProperty: ${widthVisibleProperty}` );

      if ( options ) {
        assert && assert( !options.text, 'WidthCheckbox sets text' );
        assert && assert( !options.icon, 'WidthCheckbox sets icon' );
      }

      options = merge( {

        // superclass options
        text: widthString,
        icon: GasPropertiesIconFactory.createContainerWidthIcon()
      }, options );

      super( widthVisibleProperty, options );
    }
  }

  return gasProperties.register( 'WidthCheckbox', WidthCheckbox );
} );