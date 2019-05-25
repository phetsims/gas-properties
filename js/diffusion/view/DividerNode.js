// Copyright 2019, University of Colorado Boulder

/**
 * The vertical divider in the Diffusion screen's container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );

  class DividerNode extends Node {

    /**
     * @param {BooleanProperty} hasDividerProperty
     * @param {Object} [options]
     */
    constructor( hasDividerProperty, options ) {
      assert && assert( hasDividerProperty instanceof BooleanProperty,
        `invalid hasDividerProperty: ${hasDividerProperty}` );

      options = _.extend( {
        length: 100,
        solidLineWidth: 1,
        dashedLineWidth: 1
      }, options );

      // Solid divider
       const solidLineNode = new Line( 0, 0, 0, options.length, {
         stroke: GasPropertiesColorProfile.dividerColorProperty,
         lineWidth: options.solidLineWidth
       } );

       // Vertical dashed line to indicate the center of the container when the divider is not present.
       const dashedLineNode = new Line( 0, 0, 0, options.length, {
         stroke: GasPropertiesColorProfile.dividerColorProperty,
         lineWidth: options.dashedLineWidth,
         lineDash: [ 10, 24 ],
         opacity: 0.5,
         center: solidLineNode.center
       } );

      assert && assert( !options || !options.children, 'DividerNode sets children' );
      options = _.extend( {
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

  return gasProperties.register( 'DividerNode', DividerNode );
} );