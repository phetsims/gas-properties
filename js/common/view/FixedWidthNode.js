// Copyright 2019-2020, University of Colorado Boulder

/**
 * FixedWidthNode is a Node that has a fixed width. This is used for the content in Panels and AccordionBoxes.
 * It does not support dynamic content bounds, and does not support decoration via addChild.
 * A solution using AlignGroup and AlignBox was investigated, but their width is derived from the widest component
 * (not by specified width), they do not explicitly address horizontal separators, and they do not handle container
 * margins.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import HStrut from '../../../../scenery/js/nodes/HStrut.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import gasProperties from '../../gasProperties.js';

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

    options = merge( {
      align: 'left' // horizontal alignment of content in fixedWidth, see ALIGN_VALUES
    }, options );

    assert && assert( _.includes( ALIGN_VALUES, options.align ), `invalid align: ${options.align}` );

    // prevents the content from getting narrower than fixedWidth
    const strut = new HStrut( fixedWidth, { pickable: false } );

    assert && assert( options.maxWidth === undefined, 'FixedWidthNode sets maxWidth' );
    assert && assert( !options.children, 'FixedWidthNode sets children' );
    options = merge( {
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

gasProperties.register( 'FixedWidthNode', FixedWidthNode );
export default FixedWidthNode;