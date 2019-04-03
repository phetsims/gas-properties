// Copyright 2018-2019, University of Colorado Boulder

/**
 * Checkbox to show/hide the size of the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const DimensionalArrowsNode = require( 'GAS_PROPERTIES/common/view/DimensionalArrowsNode' );
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

      if ( options ) {
        assert && assert( !options.text, 'SizeCheckbox sets text' );
        assert && assert( !options.icon, 'SizeCheckbox sets icon' );
      }

      options = _.extend( {
        text: sizeString,
        icon: new DimensionalArrowsNode( new NumberProperty( 44 ), {
          color: GasPropertiesColorProfile.sizeArrowColorProperty,
          pickable: false
        }, options )
      } );

      super( sizeVisibleProperty, options );
    }
  }

  return gasProperties.register( 'SizeCheckbox', SizeCheckbox );
} );