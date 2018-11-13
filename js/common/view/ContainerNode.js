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
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

  class ContainerNode extends Node {

    /**
     * @param {Container} container
     * @param {Object} [options]
     * @constructor
     */
    constructor( container, options ) {

      const rectangle = new Rectangle( 0, 0, container.widthProperty.value, container.height, {
        stroke: gasPropertiesColorProfile.containerStrokeProperty,
        lineWidth: 2
      } );

      assert && assert( !options.children, 'ContainerNode sets children' );
      options.children = [ rectangle ];

      super( options );

      container.widthProperty.lazyLink( width => {
        rectangle.setRect( 0, 0, width, container.height );
      } );
    }
  }

  return gasProperties.register( 'ContainerNode', ContainerNode );
} );