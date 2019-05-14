// Copyright 2019, University of Colorado Boulder

/**
 * View of the container in the 'Diffusion' screen.
 * This container has a fixed with and a removable vertical divider.
 * Do not transform this Node! It's origin must be at the origin of the view coordinate frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

  class DiffusionContainerNode extends Node {

    /**
     * @param {DiffusionContainer} container
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options]
     */
    constructor( container, modelViewTransform, options ) {

      // Transform to view coordinate frame
      const viewWallThickness = modelViewTransform.modelToViewDeltaX( container.wallThickness );
      const viewDividerThickness = modelViewTransform.modelToViewDeltaX( container.dividerThickness );
      const viewDividerX = modelViewTransform.modelToViewX( container.dividerX );

      // Expand the container bounds to account for wall thickness.
      const viewBounds = modelViewTransform.modelToViewBounds( container.bounds )
        .dilated( modelViewTransform.modelToViewDeltaX( container.wallThickness / 2 ) );

      // Outside border of the container, expanded to account for wall thickness
      const borderNode = new Rectangle( viewBounds, {
          stroke: GasPropertiesColorProfile.containerBoundsStrokeProperty,
          lineWidth: viewWallThickness
        } );

      // Vertical divider
      const dividerNode = new Line( viewDividerX, viewBounds.minY, viewDividerX, viewBounds.maxY, {
        stroke: GasPropertiesColorProfile.dividerColorProperty,
        lineWidth: viewDividerThickness
      } );

      // Vertical dashed line to indicate the center of the container when the divider is not present.
      const noDividerNode = new Line( viewDividerX, viewBounds.minY, viewDividerX, viewBounds.maxY, {
        stroke: GasPropertiesColorProfile.dividerColorProperty,
        lineWidth: viewDividerThickness / 2,
        lineDash: [ 10, 24 ],
        center: borderNode.center
      } );

      assert && assert( !options || !options.children, 'DiffusionContainerNodeNode sets children' );
      options = _.extend( {
        children: [ noDividerNode, dividerNode, borderNode ]
      }, options );

      super( options );

      // Show/hide the divider
      container.hasDividerProperty.link( hasDivider => {
        dividerNode.visible = hasDivider;
        noDividerNode.visible = !hasDivider;
      } );
    }
  }

  return gasProperties.register( 'DiffusionContainerNode', DiffusionContainerNode );
} );