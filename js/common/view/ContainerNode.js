// Copyright 2018, University of Colorado Boulder

/**
 * View of the Container. Location of the right edge of the container remains fixed.
 * 
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const gasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/gasPropertiesColorProfile' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {Container} container
   * @param {Object} [options]
   * @constructor
   */
  function ContainerNode( container, options ) {

    const rectangle = new Rectangle( 0, 0, container.widthProperty.value, container.height, {
      stroke: gasPropertiesColorProfile.containerStrokeProperty,
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