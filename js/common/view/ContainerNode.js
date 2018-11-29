// Copyright 2018, University of Colorado Boulder

//TODO add drag listener for resize handle
//TODO add lid
/**
 * View of the Container. Location of the right edge of the container remains fixed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const HandleNode = require( 'SCENERY_PHET/HandleNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // constants
  const HANDLE_ATTACHMENT_LINE_WIDTH = 1;

  class ContainerNode extends Node {

    /**
     * @param {Container} container
     * @param {Object} [options]
     * @constructor
     */
    constructor( container, options ) {

      const rectangle = new Rectangle( 0, 0, container.widthProperty.value, container.height, {
        stroke: GasPropertiesColorProfile.containerStrokeProperty,
        lineWidth: 2
      } );

      const handleNode = new HandleNode( {
        gripFillBaseColor: 'rgb( 187, 154, 86 )',
        attachmentLineWidth: HANDLE_ATTACHMENT_LINE_WIDTH,
        rotation: -Math.PI / 2,
        scale: 0.5,
        right: rectangle.left + HANDLE_ATTACHMENT_LINE_WIDTH, // hide the overlap
        centerY: rectangle.centerY
      } );

      assert && assert( !options.children, 'ContainerNode sets children' );
      options.children = [ handleNode, rectangle ];

      super( options );

      container.widthProperty.lazyLink( width => {
        rectangle.setRect( 0, 0, width, container.height );
      } );
    }
  }

  return gasProperties.register( 'ContainerNode', ContainerNode );
} );