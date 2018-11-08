// Copyright 2018, University of Colorado Boulder

/**
 * Checkbox to show/hide the size of the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const Checkbox = require( 'SUN/Checkbox' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColors = require( 'GAS_PROPERTIES/common/GasPropertiesColors' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const sizeString = require( 'string!GAS_PROPERTIES/size' );

  class SizeCheckbox extends Checkbox {

    /**
     * @param {BooleanProperty} sizeVisibleProperty
     * @param {Object} [options]
     */
    constructor( sizeVisibleProperty, options ) {

      const textNode = new Text( sizeString, {
        font: GasPropertiesConstants.CONTROL_FONT,
        fill: GasPropertiesColors.FOREGROUND_COLOR,
        maxWidth: 150 // determined empirically
      } );

      //TODO use dimensional arrow here
      const arrowNode = new ArrowNode( 0, 0, 50, 0, {
        doubleHead: true,
        headHeight: 12,
        headWidth: 12,
        tailWidth: 3,
        fill: GasPropertiesColors.FOREGROUND_COLOR
      } );

      const content = new HBox( {
        spacing: 5,
        children: [ textNode, arrowNode ]
      } );

      super( content, sizeVisibleProperty, options );
    }
  }

  return gasProperties.register( 'SizeCheckbox', SizeCheckbox );
} );