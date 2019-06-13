// Copyright 2019, University of Colorado Boulder

/**
 * Checkbox to show/hide the center-of-mass indicators on the container.
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

  // strings
  const centerOfMassString = require( 'string!GAS_PROPERTIES/centerOfMass' );

  class CenterOfMassCheckbox extends GasPropertiesCheckbox {

    /**
     * @param {BooleanProperty} centerOfMassVisibleProperty
     * @param {Object} [options]
     */
    constructor( centerOfMassVisibleProperty, options ) {
      assert && assert( centerOfMassVisibleProperty instanceof BooleanProperty,
        `invalid centerOfMassVisibleProperty: ${centerOfMassVisibleProperty}` );

      options = _.extend( {

        // superclass options
        textIconSpacing: 12
      }, options );

      assert && assert( !options.text, 'CenterOfMassCheckbox sets text' );
      assert && assert( !options.icon, 'CenterOfMassCheckbox sets icon' );
      options = _.extend( {
        text: centerOfMassString,
        icon: GasPropertiesIconFactory.createCenterOfMassIcon()
      }, options );

      super( centerOfMassVisibleProperty, options );
    }
  }

  return gasProperties.register( 'CenterOfMassCheckbox', CenterOfMassCheckbox );
} );