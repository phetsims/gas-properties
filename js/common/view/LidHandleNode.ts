// Copyright 2024, University of Colorado Boulder

/**
 * LidHandleNode is the handle used to open and close the container's lid.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import HandleNode from '../../../../scenery-phet/js/HandleNode.js';
import { InteractiveHighlighting, Node, NodeOptions, NodeTranslationOptions, TColor } from '../../../../scenery/js/imports.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesColors from '../GasPropertiesColors.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

const HANDLE_ATTACHMENT_LINE_WIDTH = 1;

type SelfOptions = {
  gripColor?: TColor;
};

export type LidHandleNodeOptions = SelfOptions & NodeTranslationOptions &
  PickRequired<NodeOptions, 'tandem' | 'visibleProperty'>;

export default class LidHandleNode extends InteractiveHighlighting( Node ) {

  public constructor( providedOptions: LidHandleNodeOptions ) {

    const options = optionize<LidHandleNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      gripColor: GasPropertiesColors.lidGripColorProperty,

      // NodeOptions
      cursor: 'pointer',
      tagName: 'div',
      focusable: true,
      phetioInputEnabledPropertyInstrumented: true
    }, providedOptions );

    const handleNode = new HandleNode( {
      hasLeftAttachment: false,
      gripBaseColor: options.gripColor,
      attachmentLineWidth: HANDLE_ATTACHMENT_LINE_WIDTH,
      scale: 0.4
    } );

    // Wrap HandleNode so that the focus highlight is not affected by scaling.
    options.children = [ handleNode ];

    super( options );
  }
}

gasProperties.register( 'LidHandleNode', LidHandleNode );