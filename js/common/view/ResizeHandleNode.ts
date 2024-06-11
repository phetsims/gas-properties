// Copyright 2024, University of Colorado Boulder

/**
 * ResizeHandleNode is the handle used to resize the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { InteractiveHighlighting, Node, NodeOptions, TColor } from '../../../../scenery/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import HandleNode from '../../../../scenery-phet/js/HandleNode.js';
import gasProperties from '../../gasProperties.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type ResizeHandleNodeSelfOptions = {
  gripColor: TColor;
};

type ResizeHandleNodeOptions = ResizeHandleNodeSelfOptions & PickRequired<NodeOptions, 'tandem' | 'visibleProperty'>;

export default class ResizeHandleNode extends InteractiveHighlighting( Node ) {

  public constructor( providedOptions: ResizeHandleNodeOptions ) {

    const options = optionize<ResizeHandleNodeOptions, ResizeHandleNodeSelfOptions, NodeOptions>()( {

      // NodeOptions
      cursor: 'pointer',
      tagName: 'div',
      focusable: true,
      phetioInputEnabledPropertyInstrumented: true
    }, providedOptions );

    const handleNode = new HandleNode( {
      gripBaseColor: options.gripColor,
      attachmentLineWidth: 1,
      rotation: -Math.PI / 2,
      scale: 0.4
    } );

    // Wrap HandleNode so that the focus highlight is not affected by scaling.
    options.children = [ handleNode ];

    super( options );
  }
}

gasProperties.register( 'ResizeHandleNode', ResizeHandleNode );