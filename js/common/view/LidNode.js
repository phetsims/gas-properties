// Copyright 2018, University of Colorado Boulder

/**
 * The lid on the top of the container.
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

  class LidNode extends Node {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = _.extend( {
        handleColor: 'grey' // {Color|string} color of the handle
      }, options );

      const baseNode = new Rectangle( 0, 0, 150, 4, {
        fill: GasPropertiesColorProfile.containerStrokeProperty
      } );

      const handleNode = new HandleNode( {
        gripFillBaseColor: options.handleColor,
        attachmentLineWidth: HANDLE_ATTACHMENT_LINE_WIDTH,
        scale: 0.4,
        centerX: baseNode.centerX,
        bottom: baseNode.top + 1
      } );

      assert && assert( !options.children, 'LidNode sets children' );
      options.children = [ handleNode, baseNode ];

      super( options );
    }
  }

  return gasProperties.register( 'LidNode', LidNode );
} );