// Copyright 2019, University of Colorado Boulder

/**
 * Toggle button for whether the container has a vertical divider, color-code to the divider.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const BooleanRectangularToggleButton = require( 'SUN/buttons/BooleanRectangularToggleButton' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const removeDividerString = require( 'string!GAS_PROPERTIES/removeDivider' );
  const resetDividerString = require( 'string!GAS_PROPERTIES/resetDivider' );

  class DividerToggleButton extends BooleanRectangularToggleButton {

    /**
     * @param {BooleanProperty} hasDividerProperty
     * @param {Object} [options]
     */
    constructor( hasDividerProperty, options ) {
      assert && assert( hasDividerProperty instanceof BooleanProperty, `invalid hasDividerProperty: ${hasDividerProperty}` );

      options = _.extend( {
        baseColor: GasPropertiesColorProfile.dividerColorProperty
      }, options );

      const textOptions = {
        font: GasPropertiesConstants.CONTROL_FONT,
        fill: 'black',
        maxWidth: 150 // determined empirically
      };

      const trueNode = new Text( removeDividerString, textOptions );
      const falseNode = new Text( resetDividerString, textOptions );

      super( trueNode, falseNode, hasDividerProperty, options );
    }
  }

  return gasProperties.register( 'DividerToggleButton', DividerToggleButton );
} );