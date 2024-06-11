// Copyright 2018-2024, University of Colorado Boulder

/**
 * LidNode is the lid on the top of the container. The lid is composed of 2 pieces, a handle and a base.
 * Origin is at the bottom-left of the base.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import { Node, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesColors from '../GasPropertiesColors.js';
import LidHandleNode, { LidHandleNodeOptions } from './LidHandleNode.js';

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

gasProperties.register( 'LidNode', LidNode );