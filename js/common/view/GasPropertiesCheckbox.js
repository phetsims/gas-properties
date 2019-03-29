// Copyright 2018, University of Colorado Boulder

/**
 * A checkbox that is labeled with text, with an optional icon to the right of the text.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const RichText = require( 'SCENERY/nodes/RichText' );

  class GasPropertiesCheckbox extends Checkbox {

    /**
     * @param {string} text
     * @param {BooleanProperty} booleanProperty
     * @param {Object} [options]
     */
    constructor( text, booleanProperty, options ) {

      options = _.extend( {
        textFill: GasPropertiesColorProfile.controlTextFillProperty,
        font: GasPropertiesConstants.CONTROL_FONT,
        icon: null // {Node|null} optional icon, to the right of text
      }, options );

      const textNode = new RichText( text, {
        fill: options.textFill,
        font: options.font,
        maxWidth: 250 // determined empirically
      } );

      let content = null;
      if ( options.icon ) {
        content = new HBox( {
          align: 'center',
          spacing: 8,
          children: [ textNode, options.icon ]
        } );
      }
      else {
        content = textNode;
      }

      super( content, booleanProperty, options );
    }
  }

  return gasProperties.register( 'GasPropertiesCheckbox', GasPropertiesCheckbox );
} );