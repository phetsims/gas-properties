// Copyright 2019-2022, University of Colorado Boulder

/**
 * DividerNode is the vertical divider in the Diffusion screen's container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import { Line, Node } from '../../../../scenery/js/imports.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import gasProperties from '../../gasProperties.js';

class DividerNode extends Node {

  /**
   * @param {BooleanProperty} hasDividerProperty
   * @param {Object} [options]
   */
  constructor( hasDividerProperty, options ) {
    assert && assert( hasDividerProperty instanceof BooleanProperty,
      `invalid hasDividerProperty: ${hasDividerProperty}` );

    options = merge( {
      length: 100,
      solidLineWidth: 1,
      dashedLineWidth: 1
    }, options );

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

    assert && assert( !options || !options.children, 'DividerNode sets children' );
    options = merge( {
      children: [ dashedLineNode, solidLineNode ]
    }, options );

    super( options );

    // Switch between solid and dashed divider
    hasDividerProperty.link( hasDivider => {
      solidLineNode.visible = hasDivider;
      dashedLineNode.visible = !hasDivider;
    } );
  }
}

gasProperties.register( 'DividerNode', DividerNode );
export default DividerNode;