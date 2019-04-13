// Copyright 2019, University of Colorado Boulder

/**
 * Toggle button for whether the container has a vertical divider.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const BooleanRectangularToggleButton = require( 'SUN/buttons/BooleanRectangularToggleButton' );
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const removeDividerString = require( 'string!GAS_PROPERTIES/removeDivider' );
  const resetString = require( 'string!GAS_PROPERTIES/reset' );

  class DividerToggleButton extends BooleanRectangularToggleButton {

    /**
     * @param {BooleanProperty} hasDividerProperty
     * @param {Object} [options]
     */
    constructor( hasDividerProperty, options ) {

      options = _.extend( {
        baseColor: PhetColorScheme.BUTTON_YELLOW
      }, options );

      const textOptions = {
        font: GasPropertiesConstants.CONTROL_FONT,
        fill: 'black'
      };

      const trueNode = new Text( removeDividerString, textOptions );
      const falseNode = new Text( resetString, textOptions );

      super( trueNode, falseNode, hasDividerProperty, options );
    }
  }

  return gasProperties.register( 'DividerToggleButton', DividerToggleButton );
} );