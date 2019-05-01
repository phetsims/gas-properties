// Copyright 2019, University of Colorado Boulder

/**
 * The container in the 'Diffusion' screen.
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
      const viewLocation = modelViewTransform.modelToViewPosition( container.location );
      const viewWidth = modelViewTransform.modelToViewDeltaX( container.width );
      const viewHeight = modelViewTransform.modelToViewDeltaX( container.height );
      const viewWallThickness = modelViewTransform.modelToViewDeltaX( container.wallThickness );
      const viewDividerThickness = modelViewTransform.modelToViewDeltaX( container.dividerThickness );
      const viewDividerX = modelViewTransform.modelToViewX( container.dividerX );

      // Outside border of the container
      const borderNode = new Rectangle( viewLocation.x - viewWidth, viewLocation.y - viewHeight, viewWidth, viewHeight, {
        stroke: GasPropertiesColorProfile.containerBoundsStrokeProperty,
        lineWidth: viewWallThickness
      } );

      // Vertical divider
      const dividerNode = new Line( viewDividerX, viewLocation.y - viewHeight, viewDividerX, viewLocation.y, {
        stroke: GasPropertiesColorProfile.dividerColorProperty,
        lineWidth: viewDividerThickness
      } );

      // Vertical dashed line to indicate the center of the container when the divider is not present.
      const noDividerNode = new Line( viewDividerX, viewLocation.y - viewHeight, viewDividerX, viewLocation.y, {
        stroke: GasPropertiesColorProfile.dividerColorProperty,
        lineWidth: 1,
        lineDash: [ 10, 24 ],
        center: borderNode.center
      } );

      assert && assert( !options || !options.children, 'DiffusionContainerNodeNode sets children' );
      options = _.extend( {
        children: [ borderNode, noDividerNode, dividerNode ]
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