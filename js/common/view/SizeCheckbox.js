// Copyright 2018, University of Colorado Boulder

/**
 * Checkbox to show/hide the size of the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const DimensionalArrowNode = require( 'GAS_PROPERTIES/common/view/DimensionalArrowNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesCheckbox = require( 'GAS_PROPERTIES/common/view/GasPropertiesCheckbox' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const NumberProperty = require( 'AXON/NumberProperty' );

  // strings
  const sizeString = require( 'string!GAS_PROPERTIES/size' );

  class SizeCheckbox extends GasPropertiesCheckbox {

    /**
     * @param {BooleanProperty} sizeVisibleProperty
     * @param {Object} [options]
     */
    constructor( sizeVisibleProperty, options ) {

      options = options || {};

      assert && assert( !options.icon, 'SizeCheckbox sets icon' );
      options.icon = new DimensionalArrowNode( new NumberProperty( 44 ), {
        color: GasPropertiesColorProfile.textFillProperty,
        pickable: false
      } );

      super( sizeString, sizeVisibleProperty, options );
    }
  }

  return gasProperties.register( 'SizeCheckbox', SizeCheckbox );
} );