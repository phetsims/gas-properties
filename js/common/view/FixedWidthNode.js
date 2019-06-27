// Copyright 2019, University of Colorado Boulder

//TODO https://github.com/phetsims/gas-properties/issues/137, move to common code?
/**
 * FixedWidthNode is a Node that has a fixed width. This is used for the content in Panels and AccordionBoxes.
 *
 * A solution using AlignGroup and AlignBox was investigated, but they do not address horizontal separators
 * they do not handle container margins, and their width is dictated by the largest component vs a specified width.
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
     * @param {number} fixedWidth - this Node will be exactly this width
     * @param {Node} content - Node wrapped by this Node
     * @param {Object} [options]
     */
    constructor( fixedWidth, content, options ) {
      assert && assert( typeof fixedWidth === 'number' && fixedWidth > 0, `invalid fixedWidth: ${fixedWidth}` );
      assert && assert( content instanceof Node, `invalid content: ${content}` );

      options = _.extend( {
        align: 'left' // horizontal alignment of content in fixedWidth, see ALIGN_VALUES
      }, options );

      assert && assert( _.includes( ALIGN_VALUES, options.align ), `invalid align: ${options.align}` );

      // prevents the content from getting narrower than fixedWidth
      const strut = new HStrut( fixedWidth, { pickable: false } );

      assert && assert( options.maxWidth === undefined, 'FixedWidthNode sets maxWidth' );
      assert && assert( !options.children, 'FixedWidthNode sets children' );
      options = _.extend( {
        maxWidth: fixedWidth, // prevents the content from getting wider than fixedWidth
        children: [ strut, content ]
      }, options );

      // align content in fixedWidth
      if ( options.align === 'left' ) {
        content.left = strut.left;
      }
      else if ( options.align === 'right' ) {
        content.right = strut.right;
      }
      else {
        content.centerX = strut.centerX;
      }

      super( options );
    }
  }

  return gasProperties.register( 'FixedWidthNode', FixedWidthNode );
} );