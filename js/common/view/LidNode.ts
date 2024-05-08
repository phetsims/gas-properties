// Copyright 2018-2024, University of Colorado Boulder

/**
 * LidNode is the lid on the top of the container. The lid is composed of 2 pieces, a handle and a base.
 * Origin is at the bottom-left of the base.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import HandleNode from '../../../../scenery-phet/js/HandleNode.js';
import { InteractiveHighlighting, Node, NodeOptions, NodeTranslationOptions, Rectangle, TColor } from '../../../../scenery/js/imports.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesColors from '../GasPropertiesColors.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

const HANDLE_ATTACHMENT_LINE_WIDTH = 1;
const HANDLE_RIGHT_INSET = 3;

type SelfOptions = {
  baseWidth: number;
  baseHeight: number;
  lidHandleNodeOptions: LidHandleNodeOptions;
};

type LidNodeOptions = SelfOptions;

export default class LidNode extends Node {

  public readonly handleNode: Node;
  private readonly baseNode: Rectangle;

  public constructor( providedOptions: LidNodeOptions ) {

    const options = optionize<LidNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      isDisposable: false,
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    const baseNode = new Rectangle( 0, 0, options.baseWidth, options.baseHeight, {
      fill: GasPropertiesColors.lidBaseFillProperty,
      left: 0,
      bottom: 0
    } );

    const lidHandleNode = new LidHandleNode( combineOptions<LidHandleNodeOptions>( {
      right: baseNode.right - HANDLE_RIGHT_INSET,
      bottom: baseNode.top + 1
    }, options.lidHandleNodeOptions ) );
    assert && assert( lidHandleNode.width <= baseNode.width,
      `handleNode.width ${lidHandleNode.width} is wider than baseNode.width ${baseNode.width}` );
    lidHandleNode.touchArea = lidHandleNode.localBounds.dilatedXY( 25, 20 );

    options.children = [ lidHandleNode, baseNode ];

    super( options );

    this.handleNode = lidHandleNode;
    this.baseNode = baseNode;
  }

  /**
   * Sets the width of the lid's base.
   */
  public setBaseWidth( baseWidth: number ): void {
    assert && assert( baseWidth > 0, `invalid baseWidth: ${baseWidth}` );

    this.baseNode.setRectWidth( baseWidth );
    this.baseNode.left = 0;
    this.baseNode.bottom = 0;
    this.handleNode.right = this.baseNode.right - HANDLE_RIGHT_INSET;
  }
}

/**
 * LidHandleNode is the handle used to open and close the container's lid.
 */

type LidHandleNodeSelfOptions = {
  gripColor?: TColor;
};
type LidHandleNodeOptions = LidHandleNodeSelfOptions & NodeTranslationOptions &
  PickRequired<NodeOptions, 'tandem' | 'visibleProperty'>;

class LidHandleNode extends InteractiveHighlighting( Node ) {

  public constructor( providedOptions: LidHandleNodeOptions ) {

    const options = optionize<LidHandleNodeOptions, LidHandleNodeSelfOptions, NodeOptions>()( {

      // LidHandleNodeSelfOptions
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

gasProperties.register( 'LidNode', LidNode );