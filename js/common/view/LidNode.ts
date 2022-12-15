// Copyright 2018-2022, University of Colorado Boulder

/**
 * LidNode is the lid on the top of the container. The lid is composed of 2 pieces, a handle and a base.
 * Origin is at the bottom-left of the base.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import HandleNode from '../../../../scenery-phet/js/HandleNode.js';
import { Node, NodeOptions, Rectangle, TColor } from '../../../../scenery/js/imports.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesColors from '../GasPropertiesColors.js';
import { HoldConstant } from '../model/HoldConstant.js';

// constants
const HANDLE_ATTACHMENT_LINE_WIDTH = 1;
const HANDLE_RIGHT_INSET = 3;

type SelfOptions = {
  baseWidth: number;
  baseHeight: number;
  gripColor?: TColor;
};

type LidNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class LidNode extends Node {

  public readonly handleNode: HandleNode;
  private readonly baseNode: Rectangle;

  public constructor( holdConstantProperty: StringUnionProperty<HoldConstant>, providedOptions: LidNodeOptions ) {

    const options = optionize<LidNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      gripColor: GasPropertiesColors.lidGripColorProperty
    }, providedOptions );

    const baseNode = new Rectangle( 0, 0, options.baseWidth, options.baseHeight, {
      fill: GasPropertiesColors.lidBaseFillProperty,
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

    options.children = [ handleNode, baseNode ];

    super( options );

    // Hide the handle when holding temperature constant.  We don't want to deal with counteracting evaporative
    // cooling, which will occur when the lid is open. See https://github.com/phetsims/gas-properties/issues/159
    holdConstantProperty.link( holdConstant => {
      this.interruptSubtreeInput();
      handleNode.visible = ( holdConstant !== 'temperature' );
    } );

    this.handleNode = handleNode;
    this.baseNode = baseNode;
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
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

gasProperties.register( 'LidNode', LidNode );