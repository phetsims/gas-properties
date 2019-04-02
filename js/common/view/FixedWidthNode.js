// Copyright 2019, University of Colorado Boulder

//TODO investigate a better way to ensure a fixed size for Panels and AccordionBoxes
/**
 * A Node that has a fixed width.
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
     * @param {Node} child
     * @param {Object} [options]
     */
    constructor( child, options ) {

      options = _.extend( {
        fixedWidth: 100,
        align: 'left'
      }, options );

      assert && assert( ALIGN_VALUES.includes( options.align ), `invalid align: ${options.align}` );

      child.maxWidth = options.fixedWidth;
      const strut = new HStrut( options.fixedWidth, { pickable: false } );

      assert && assert( !options.hasOwnProperty( 'children' ), 'FixedWidthNode sets children' );
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