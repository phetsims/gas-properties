// Copyright 2018, University of Colorado Boulder

/**
 * View of the Container. Location of the right edge of the container remains fixed.
 * 
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  var GasPropertiesColors = require( 'GAS_PROPERTIES/common/GasPropertiesColors' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {Container} container
   * @param {Object} [options]
   * @constructor
   */
  function ContainerNode( container, options ) {

    var rectangle = new Rectangle( 0, 0, container.widthProperty.value, container.height, {
      stroke: GasPropertiesColors.FOREGROUND_COLOR,
      lineWidth: 2
    } );

    assert && assert( !options.children, 'ContainerNode sets children' );
    options.children = [ rectangle ];

    Node.call( this, options );

    container.widthProperty.lazyLink( function( width ) {
       rectangle.setRect( 0, 0, width, container.height );
    } );
  }

  gasProperties.register( 'ContainerNode', ContainerNode );

  return inherit( Node, ContainerNode );
} );