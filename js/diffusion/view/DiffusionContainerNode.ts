// Copyright 2019-2022, University of Colorado Boulder

/**
 * DiffusionContainerNode is the view of the container in the 'Diffusion' screen.
 * This container has a fixed width and a removable vertical divider.
 * Do not transform this Node! It's origin must be at the origin of the view coordinate frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Node, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import gasProperties from '../../gasProperties.js';
import DiffusionContainer from '../model/DiffusionContainer.js';
import DividerNode from './DividerNode.js';

type SelfOptions = EmptySelfOptions;

type DiffusionContainerNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class DiffusionContainerNode extends Node {

  public constructor( container: DiffusionContainer, modelViewTransform: ModelViewTransform2, providedOptions: DiffusionContainerNodeOptions ) {

    const options = optionize<DiffusionContainerNodeOptions, SelfOptions, NodeOptions>()( {
      // empty because we're setting options.children below
    }, providedOptions );

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
    const dividerNode = new DividerNode( container.hasDividerProperty, {
      length: modelViewTransform.modelToViewDeltaY( container.height ),
      solidLineWidth: viewDividerThickness,
      dashedLineWidth: viewDividerThickness / 2,
      centerX: modelViewTransform.modelToViewX( container.dividerX ),
      bottom: modelViewTransform.modelToViewY( container.position.y ),
      tandem: options.tandem.createTandem( 'dividerNode' )
    } );

    options.children = [ dividerNode, borderNode ];

    super( options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

gasProperties.register( 'DiffusionContainerNode', DiffusionContainerNode );