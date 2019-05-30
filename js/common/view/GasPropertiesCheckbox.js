// Copyright 2018-2019, University of Colorado Boulder

/**
 * Specialization of Checkbox for this sim.  It can be labeled with text and/or and icon, and has the correct
 * options and color profiling for this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Checkbox = require( 'SUN/Checkbox' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const RichText = require( 'SCENERY/nodes/RichText' );

  class GasPropertiesCheckbox extends Checkbox {

    /**
     * @param {BooleanProperty} booleanProperty
     * @param {Object} [options]
     */
    constructor( booleanProperty, options ) {
      assert && assert( booleanProperty instanceof BooleanProperty, `invalid booleanProperty: ${booleanProperty}` );

      options = _.extend( {}, GasPropertiesConstants.CHECKBOX_OPTIONS, {
        text: null, // {string|null} optional text label
        icon: null, // {Node|null} optional icon, to the right of text
        textFill: GasPropertiesColorProfile.textFillProperty,
        textMaxWidth: null,
        textIconSpacing: 10, // horizontal space between text and icon
        font: GasPropertiesConstants.CONTROL_FONT,

        // Checkbox options
        checkboxColor: GasPropertiesColorProfile.checkboxStrokeProperty,
        checkboxColorBackground: GasPropertiesColorProfile.checkboxFillProperty
      }, options );

      assert && assert( options.text || options.icon, 'text or icon is required' );

      const contentChildren = [];

      if ( options.text ) {
        contentChildren.push( new RichText( options.text, {
          fill: options.textFill,
          font: options.font,
          maxWidth: options.textMaxWidth
        } ) );
      }

      if ( options.icon ) {
        contentChildren.push( options.icon );
      }

      let content = null;
      if ( contentChildren.length === 1 ) {
        content = contentChildren[ 0 ];
      }
      else {
        content = new HBox( {
          align: 'center',
          spacing: options.textIconSpacing,
          children: contentChildren
        } );
      }

      super( content, booleanProperty, options );
    }
  }

  return gasProperties.register( 'GasPropertiesCheckbox', GasPropertiesCheckbox );
} );