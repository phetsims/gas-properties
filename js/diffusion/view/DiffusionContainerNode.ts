// Copyright 2019-2024, University of Colorado Boulder

/**
 * DiffusionContainerNode is the view of the container in the 'Diffusion' screen.
 * This container has a fixed width and a removable vertical divider.
 * Do not transform this Node! It's origin must be at the origin of the view coordinate frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import gasProperties from '../../gasProperties.js';
import DiffusionContainer from '../model/DiffusionContainer.js';
import DividerNode from './DividerNode.js';

export default class DiffusionContainerNode extends Node {

  public constructor( container: DiffusionContainer, modelViewTransform: ModelViewTransform2 ) {

    // Expand the container bounds to account for wall thickness.
    const viewBounds = modelViewTransform.modelToViewBounds( container.bounds )
      .dilated( modelViewTransform.modelToViewDeltaX( container.wallThickness / 2 ) );

    // Outside border of the container
    const borderNode = new Rectangle( viewBounds, {
      stroke: GasPropertiesColors.containerBoundsStrokeProperty,
      lineWidth: modelViewTransform.modelToViewDeltaX( container.wallThickness )
    } );

    // Vertical divider
    const viewDividerThickness = modelViewTransform.modelToViewDeltaX( container.dividerThickness );
    const dividerNode = new DividerNode( container.isDividedProperty, {
      length: modelViewTransform.modelToViewDeltaY( container.height ),
      solidLineWidth: viewDividerThickness,
      dashedLineWidth: viewDividerThickness / 2,
      centerX: modelViewTransform.modelToViewX( container.dividerX ),
      bottom: modelViewTransform.modelToViewY( container.position.y )
    } );

    super( {
      isDisposable: false,
      children: [ dividerNode, borderNode ]
    } );
  }
}

gasProperties.register( 'DiffusionContainerNode', DiffusionContainerNode );