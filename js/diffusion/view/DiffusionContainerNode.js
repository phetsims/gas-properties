// Copyright 2019, University of Colorado Boulder

/**
 * DiffusionContainerNode is the view of the container in the 'Diffusion' screen.
 * This container has a fixed width and a removable vertical divider.
 * Do not transform this Node! It's origin must be at the origin of the view coordinate frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const DiffusionContainer = require( 'GAS_PROPERTIES/diffusion/model/DiffusionContainer' );
  const DividerNode = require( 'GAS_PROPERTIES/diffusion/view/DividerNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

  class DiffusionContainerNode extends Node {

    /**
     * @param {DiffusionContainer} container
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options]
     */
    constructor( container, modelViewTransform, options ) {
      assert && assert( container instanceof DiffusionContainer, `invalid container: ${container}` );
      assert && assert( modelViewTransform instanceof ModelViewTransform2,
        `invalid modelViewTransform: ${modelViewTransform}` );

      // Expand the container bounds to account for wall thickness.
      const viewBounds = modelViewTransform.modelToViewBounds( container.bounds )
        .dilated( modelViewTransform.modelToViewDeltaX( container.wallThickness / 2 ) );

      // Outside border of the container
      const borderNode = new Rectangle( viewBounds, {
          stroke: GasPropertiesColorProfile.containerBoundsStrokeProperty,
          lineWidth: modelViewTransform.modelToViewDeltaX( container.wallThickness )
        } );

      // Vertical divider
      const viewDividerThickness = modelViewTransform.modelToViewDeltaX( container.dividerThickness );
      const dividerNode = new DividerNode( container.hasDividerProperty, {
        length: modelViewTransform.modelToViewDeltaX( container.height ),
        solidLineWidth: viewDividerThickness,
        dashedLineWidth: viewDividerThickness / 2,
        centerX: modelViewTransform.modelToViewX( container.dividerX ),
        bottom: modelViewTransform.modelToViewY( container.location.y )
      } );

      assert && assert( !options || !options.children, 'DiffusionContainerNodeNode sets children' );
      options = _.extend( {
        children: [ dividerNode, borderNode ]
      }, options );

      super( options );
    }
  }

  return gasProperties.register( 'DiffusionContainerNode', DiffusionContainerNode );
} );