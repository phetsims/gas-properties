// Copyright 2019-2024, University of Colorado Boulder

/**
 * DividerNode is the vertical divider in the Diffusion screen's container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { Line, Node, NodeOptions, NodeTranslationOptions } from '../../../../scenery/js/imports.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import gasProperties from '../../gasProperties.js';

type SelfOptions = {
  length?: number;
  solidLineWidth?: number;
  dashedLineWidth?: number;
};

type DividerNodeOptions = SelfOptions & NodeTranslationOptions;

export default class DividerNode extends Node {

  public constructor( isDividedProperty: TReadOnlyProperty<boolean>, providedOptions: DividerNodeOptions ) {

    const options = optionize<DividerNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      length: 100,
      solidLineWidth: 1,
      dashedLineWidth: 1,

      // NodeOptions
      isDisposable: false,
      phetioVisiblePropertyInstrumented: false
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
    isDividedProperty.link( isDivided => {
      solidLineNode.visible = isDivided;
      dashedLineNode.visible = !isDivided;
    } );
  }
}

gasProperties.register( 'DividerNode', DividerNode );