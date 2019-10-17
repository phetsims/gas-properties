// Copyright 2018-2019, University of Colorado Boulder

/**
 * LidNode is the lid on the top of the container. The lid is composed of 2 pieces, a handle and a base.
 * Origin is at the bottom-left of the base.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const HandleNode = require( 'SCENERY_PHET/HandleNode' );
  const HoldConstant = require( 'GAS_PROPERTIES/common/model/HoldConstant' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // constants
  const HANDLE_ATTACHMENT_LINE_WIDTH = 1;
  const HANDLE_RIGHT_INSET = 3;

  class LidNode extends Node {

    /**
     * @param {EnumerationProperty} holdConstantProperty
     * @param {Object} [options]
     */
    constructor( holdConstantProperty, options ) {
      assert && assert( holdConstantProperty instanceof EnumerationProperty,
        `invalid holdConstantProperty: ${holdConstantProperty}` );

      options = merge( {
        baseWidth: 1,
        baseHeight: 1,
        gripColor: GasPropertiesColorProfile.lidGripColorProperty // {ColorDef}
      }, options );

      const baseNode = new Rectangle( 0, 0, options.baseWidth, options.baseHeight, {
        fill: GasPropertiesColorProfile.lidBaseFillProperty,
        left: 0,
        bottom: 0
      } );

      const handleNode = new HandleNode( {
        cursor: 'pointer',
        hasLeftAttachment: false,
        gripBaseColor: options.gripColor,
        attachmentLineWidth: HANDLE_ATTACHMENT_LINE_WIDTH,
        scale: 0.4,
        right: baseNode.right - HANDLE_RIGHT_INSET,
        bottom: baseNode.top + 1
      } );
      assert && assert( handleNode.width <= baseNode.width,
        `handleNode.width ${handleNode.width} is wider than baseNode.width ${baseNode.width}` );
      handleNode.touchArea = handleNode.localBounds.dilatedXY( 25, 20 );

      assert && assert( !options.children, 'LidNode sets children' );
      options = merge( {
        children: [ handleNode, baseNode ]
      }, options );

      super( options );

      // Hide the handle when holding temperature constant.  We don't want to deal with counteracting evaporative
      // cooling, which will occur when the lid is open. See https://github.com/phetsims/gas-properties/issues/159
      holdConstantProperty.link( holdConstant => {
        this.interruptSubtreeInput();
        handleNode.visible = ( holdConstant !== HoldConstant.TEMPERATURE );
      } );

      // @public (read-only)
      this.handleNode = handleNode;

      // @private
      this.baseNode = baseNode;
    }

    /**
     * Sets the width of the lid's base.
     * @param {number} baseWidth
     * @public
     */
    setBaseWidth( baseWidth ) {
      assert && assert( typeof baseWidth === 'number' && baseWidth > 0, `invalid baseWidth: ${baseWidth}` );

      this.baseNode.setRectWidth( baseWidth );
      this.baseNode.left = 0;
      this.baseNode.bottom = 0;
      this.handleNode.right = this.baseNode.right - HANDLE_RIGHT_INSET;
    }
  }

  return gasProperties.register( 'LidNode', LidNode );
} );