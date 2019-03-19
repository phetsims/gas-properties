// Copyright 2018-2019, University of Colorado Boulder

/**
 * The lid on the top of the container. The lid is composed of 2 pieces, a handle and a base.
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
  const HANDLE_RIGHT_INSET = 5;

  class LidNode extends Node {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = _.extend( {
        baseWidth: 1,
        baseHeight: 1,
        handleColor: 'grey' // {Color|string} color of the handle
      }, options );

      const baseNode = new Rectangle( 0, 0, options.baseWidth, options.baseHeight, {
        fill: GasPropertiesColorProfile.lidBaseFillProperty
      } );

      const handleNode = new HandleNode( {
        hasLeftAttachment: false,
        gripBaseColor: options.handleColor,
        attachmentLineWidth: HANDLE_ATTACHMENT_LINE_WIDTH,
        scale: 0.4,
        right: baseNode.right - HANDLE_RIGHT_INSET,
        bottom: baseNode.top + 1
      } );
      assert && assert( handleNode.width <= baseNode.width,
        `handleNode.width ${handleNode.width} is wider than baseNode.width ${baseNode.width}` );

      assert && assert( !options.hasOwnProperty( 'children' ), 'LidNode sets children' );
      options = _.extend( {
        children: [ handleNode, baseNode ]
      }, options );

      super( options );

      // @private
      this.baseNode = baseNode;
      this.handleNode = handleNode;
    }

    /**
     * Sets the width of the lid's base.
     * @param {number} baseWidth
     */
    setBaseWidth( baseWidth ) {
      this.baseNode.setRectWidth( baseWidth );
      this.handleNode.right = this.baseNode.right - HANDLE_RIGHT_INSET;
    }
  }

  return gasProperties.register( 'LidNode', LidNode );
} );