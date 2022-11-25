// Copyright 2019-2022, University of Colorado Boulder

//TODO https://github.com/phetsims/gas-properties/issues/201 replace FixedWidthNode with layout options
/**
 * FixedWidthNode is a Node that has a fixed width. This is used for the content in Panels and AccordionBoxes.
 * It does not support dynamic content bounds, and does not support decoration via addChild.
 * A solution using AlignGroup and AlignBox was investigated, but their width is derived from the widest component
 * (not by specified width), they do not explicitly address horizontal separators, and they do not handle container
 * margins.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import { HStrut, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import gasProperties from '../../gasProperties.js';

// constants
type Align = 'left' | 'right' | 'center';

type SelfOptions = {
  align?: Align; // horizontal alignment of content in fixedWidth
};

type FixedWidthNodeOptions = SelfOptions;

export default class FixedWidthNode extends Node {

  /**
   * @param fixedWidth - this Node will be exactly this width
   * @param content - Node wrapped by this Node
   * @param providedOptions
   */
  public constructor( fixedWidth: number, content: Node, providedOptions?: FixedWidthNodeOptions ) {
    assert && assert( fixedWidth > 0, `invalid fixedWidth: ${fixedWidth}` );

    // prevents the content from getting narrower than fixedWidth
    const strut = new HStrut( fixedWidth, { pickable: false } );

    const options = optionize<FixedWidthNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      align: 'left',

      // NodeOptions
      maxWidth: fixedWidth, // prevents the content from getting wider than fixedWidth
      children: [ strut, content ]
    }, providedOptions );

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