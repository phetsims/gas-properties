// Copyright 2019-2022, University of Colorado Boulder

/**
 * ParticleFlowRateNode is a pair of vectors that indicate the flow rate of one particle species between the left and
 * right sides of the container. Higher flow rate results in a bigger vector. Vectors are color-coded to the particle
 * color.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import { Node, NodeOptions, NodeTranslationOptions } from '../../../../scenery/js/imports.js';
import gasProperties from '../../gasProperties.js';
import ParticleFlowRate from '../model/ParticleFlowRate.js';

// constants
const X_SPACING = 5; // space between the tails of the left and right arrows
const VECTOR_SCALE = 25; // vector length per 1 particle/ps, see https://github.com/phetsims/gas-properties/issues/51

type SelfOptions = {
  arrowNodeOptions?: ArrowNodeOptions;
};

type ParticleFlowRateNodeOptions = SelfOptions & NodeTranslationOptions & PickRequired<NodeOptions, 'tandem' | 'visibleProperty'>;

export default class ParticleFlowRateNode extends Node {

  public constructor( model: ParticleFlowRate, providedOptions: ParticleFlowRateNodeOptions ) {

    const options = optionize<ParticleFlowRateNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      arrowNodeOptions: {
        headHeight: 15,
        headWidth: 15,
        tailWidth: 8,
        fill: 'white',
        stroke: 'black'
      }
    }, providedOptions );

    const headHeight = options.arrowNodeOptions.headHeight!;
    assert && assert( headHeight );
    const minTailLength = headHeight + 4;

    // left and right arrows
    const leftArrowNode = new ArrowNode( 0, 0, -minTailLength, 0, options.arrowNodeOptions );
    const rightArrowNode = new ArrowNode( 0, 0, minTailLength, 0, options.arrowNodeOptions );

    // origin is between the tails of the 2 arrows 
    leftArrowNode.x = -X_SPACING / 2;
    rightArrowNode.x = X_SPACING / 2;

    options.children = [ leftArrowNode, rightArrowNode ];

    super( options );

    model.leftFlowRateProperty.link( flowRate => {
      leftArrowNode.visible = ( flowRate > 0 );
      leftArrowNode.setTip( -( minTailLength + flowRate * VECTOR_SCALE ), 0 );
    } );

    model.rightFlowRateProperty.link( flowRate => {
      rightArrowNode.visible = ( flowRate > 0 );
      rightArrowNode.setTip( minTailLength + flowRate * VECTOR_SCALE, 0 );
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

gasProperties.register( 'ParticleFlowRateNode', ParticleFlowRateNode );