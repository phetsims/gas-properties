// Copyright 2019, University of Colorado Boulder

/**
 * A Node that has a fixed width.
 * Minimum width is handled by adding an HStrut.  Maximum width is handled via options.maxWidth.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const Node = require( 'SCENERY/nodes/Node' );

  // constants
  const ALIGN_VALUES = [ 'left', 'right', 'center' ];

  class FixedWidthNode extends Node {

    /**
     * @param {number} fixedWidth
     * @param {Node} child
     * @param {Object} [options]
     */
    constructor( fixedWidth, child, options ) {

      options = _.extend( {
        align: 'left'
      }, options );

      assert && assert( _.includes( ALIGN_VALUES, options.align ), `invalid align: ${options.align}` );

      child.maxWidth = fixedWidth;
      const strut = new HStrut( fixedWidth, { pickable: false } );

      assert && assert( !options.children, 'FixedWidthNode sets children' );
      options = _.extend( {
        children: [ strut, child ]
      }, options );

      if ( options.align === 'left' ) {
        child.left = strut.left;
      }
      else if ( options.align === 'right' ) {
        child.right = strut.right;
      }
      else {
        child.centerX = strut.centerX;
      }

      super( options );
    }
  }

  return gasProperties.register( 'FixedWidthNode', FixedWidthNode );
} );