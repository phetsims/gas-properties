// Copyright 2019-2022, University of Colorado Boulder

/**
 * DividerNode is the vertical divider in the Diffusion screen's container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Line, Node, NodeOptions, NodeTranslationOptions } from '../../../../scenery/js/imports.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import gasProperties from '../../gasProperties.js';

type SelfOptions = {
  length?: number;
  solidLineWidth?: number;
  dashedLineWidth?: number;
};

type DividerNodeOptions = SelfOptions & NodeTranslationOptions & PickRequired<NodeOptions, 'tandem'>;

export default class DividerNode extends Node {

  public constructor( hasDividerProperty: TReadOnlyProperty<boolean>, providedOptions: DividerNodeOptions ) {

    const options = optionize<DividerNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      length: 100,
      solidLineWidth: 1,
      dashedLineWidth: 1
    }, providedOptions );

    // Solid divider
    const solidLineNode = new Line( 0, 0, 0, options.length, {
      stroke: GasPropertiesColors.dividerColorProperty,
      lineWidth: options.solidLineWidth
    } );

    // Vertical dashed line to indicate the center of the container when the divider is not present.
    const dashedLineNode = new Line( 0, 0, 0, options.length, {
      stroke: GasPropertiesColors.dividerColorProperty,
      lineWidth: options.dashedLineWidth,
      lineDash: [ 10, 24 ],
      opacity: 0.5,
      center: solidLineNode.center
    } );

    options.children = [ dashedLineNode, solidLineNode ];

    super( options );

    // Switch between solid and dashed divider
    hasDividerProperty.link( hasDivider => {
      solidLineNode.visible = hasDivider;
      dashedLineNode.visible = !hasDivider;
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

gasProperties.register( 'DividerNode', DividerNode );