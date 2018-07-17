// Copyright 2018, University of Colorado Boulder

/**
 * Checkbox to show/hide the size of the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Checkbox = require( 'SUN/Checkbox' );
  var gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  var GasPropertiesColors = require( 'GAS_PROPERTIES/common/GasPropertiesColors' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var sizeString = require( 'string!GAS_PROPERTIES/size' );

  /**
   * @param {BooleanProperty} sizeVisibleProperty
   * @param {Object} [options]
   * @constructor
   */
  function SizeCheckbox( sizeVisibleProperty, options ) {

    var textNode = new Text( sizeString, {
      font: new PhetFont( 20 ),
      fill: GasPropertiesColors.FOREGROUND_COLOR,
      maxWidth: 150 // determined empirically
    } );

    //TODO use dimensional arrow here
    var arrowNode = new ArrowNode( 0, 0, 50, 0, {
      doubleHead: true,
      headHeight: 12,
      headWidth: 12,
      tailWidth: 3,
      fill: GasPropertiesColors.FOREGROUND_COLOR
    } );

    var content = new HBox( {
      spacing: 5,
      children: [ textNode, arrowNode ]
    } );

    Checkbox.call( this, content, sizeVisibleProperty, options );
  }

  gasProperties.register( 'SizeCheckbox', SizeCheckbox );

  return inherit( Checkbox, SizeCheckbox );
} );