// Copyright 2018, University of Colorado Boulder

/**
 * Checkbox to show/hide the size of the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const DimensionalArrowNode = require( 'GAS_PROPERTIES/common/view/DimensionalArrowNode' );
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

      const dimensionalArrowNode = new DimensionalArrowNode( 44, {
        color: GasPropertiesColors.FOREGROUND_COLOR
      } );

      const content = new HBox( {
        spacing: 10,
        children: [ textNode, dimensionalArrowNode ]
      } );

      super( content, sizeVisibleProperty, options );
    }
  }

  return gasProperties.register( 'SizeCheckbox', SizeCheckbox );
} );