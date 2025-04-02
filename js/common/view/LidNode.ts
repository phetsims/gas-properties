// Copyright 2018-2025, University of Colorado Boulder

/**
 * LidNode is the lid on the top of the container. The lid is composed of 2 pieces, a handle and a base.
 * Origin is at the bottom-left of the base.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import IntentionalAny from '../../../../phet-core/js/types/IntentionalAny.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesColors from '../GasPropertiesColors.js';
import LidHandleNode from './LidHandleNode.js';

const HANDLE_RIGHT_INSET = 3;

type SelfOptions = {
  baseWidth: number;
  baseHeight: number;
};

type LidNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class LidNode extends Node {

  public readonly handleNode: LidHandleNode;
  private readonly baseNode: Rectangle;

  // Translation and rotation for the lid, in view coordinates. This must be a Property for PhET-iO.
  // The value must be a single data structure so that we can control the order that translation and rotation are applied.
  // With separate Properties, we would be at the mercy of the order in which state is restored, with unpredictable results.
  // See https://github.com/phetsims/gas-properties/issues/263.
  private readonly translationAndRotationProperty: Property<TranslationAndRotation>;

  public constructor( providedOptions: LidNodeOptions ) {

    const options = optionize<LidNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      isDisposable: false,
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: {
        phetioReadOnly: true
      }
    }, providedOptions );

    const baseNode = new Rectangle( 0, 0, options.baseWidth, options.baseHeight, {
      fill: GasPropertiesColors.lidBaseFillProperty,
      left: 0,
      bottom: 0
    } );

    const lidHandleNode = new LidHandleNode( {
      right: baseNode.right - HANDLE_RIGHT_INSET,
      bottom: baseNode.top + 1,
      tandem: providedOptions.tandem.createTandem( 'lidHandleNode' )
    } );
    assert && assert( lidHandleNode.width <= baseNode.width,
      `handleNode.width ${lidHandleNode.width} is wider than baseNode.width ${baseNode.width}` );
    lidHandleNode.touchArea = lidHandleNode.localBounds.dilatedXY( 25, 20 );

    options.children = [ lidHandleNode, baseNode ];

    super( options );

    this.translationAndRotationProperty = new Property<TranslationAndRotation>( new TranslationAndRotation( 0, 0, 0 ), {
      tandem: options.tandem.createTandem( 'translationAndRotationProperty' ),
      phetioValueType: TranslationAndRotation.TranslationAndRotationIO,
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only.'
    } );

    this.translationAndRotationProperty.lazyLink( ( newTransform, oldTransform ) => {
      this.rotateAround( this.center, newTransform.rotation - oldTransform.rotation );
      this.x = newTransform.x;
      this.y = newTransform.y;
    } );

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

  /**
   * Sets the translation and rotation applied to this LidNode.
   */
  public setTranslationAndRotation( x: number, y: number, rotation: number ): void {
    this.translationAndRotationProperty.value = new TranslationAndRotation( x, y, rotation );
  }

  /**
   * Steps the translation and rotation by deltas. This is used to animate the lid blowing off.
   */
  public stepTranslationAndRotation( dx: number, dy: number, dr: number ): void {
    const x = this.translationAndRotationProperty.value.x + dx;
    const y = this.translationAndRotationProperty.value.y + dy;
    const rotation = this.translationAndRotationProperty.value.rotation + dr;
    this.setTranslationAndRotation( x, y, rotation );
  }
}

/**
 * TranslationAndRotation is the transform (translation and rotation) applied to the lid.
 */

type TranslationAndRotationStateObject = {
  x: number;
  y: number;
  rotation: number;
};

export class TranslationAndRotation {

  public readonly x: number;
  public readonly y: number;
  public readonly rotation: number;

  public constructor( x: number, y: number, rotation: number ) {
    this.x = x;
    this.y = y;
    this.rotation = rotation;
  }

  /**
   * Serializes this TranslationAndRotation instance
   */
  public toStateObject(): TranslationAndRotationStateObject {
    return {
      x: this.x,
      y: this.y,
      rotation: this.rotation
    };
  }

  /**
   * Deserializes a TranslationAndRotation.
   */
  private static fromStateObject( stateObject: TranslationAndRotationStateObject ): TranslationAndRotation {
    return new TranslationAndRotation( stateObject.x, stateObject.y, stateObject.rotation );
  }

  /**
   * Handles serialization of TranslationAndRotation. It implements 'Data Type Serialization', as described in
   * https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization.
   */
  public static readonly TranslationAndRotationIO = new IOType<IntentionalAny, IntentionalAny>( 'TranslationAndRotationIO', {
    valueType: TranslationAndRotation,
    documentation: 'Translation and rotation use to animate the lid when it blows off the container.',
    stateSchema: {
      x: NumberIO,
      y: NumberIO,
      rotation: NumberIO
    },
    toStateObject: translationAndRotation => translationAndRotation.toStateObject(),
    fromStateObject: stateObject => TranslationAndRotation.fromStateObject( stateObject )
  } );
}

gasProperties.register( 'LidNode', LidNode );