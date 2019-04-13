// Copyright 2019, University of Colorado Boulder

/**
 * Container in the 'Diffusion' screen.
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
     * @param {BooleanProperty} hasDividerProperty TODO temporary
     * @param {Object} [options]
     */
    constructor( hasDividerProperty, options ) {

      options = _.extend( {
        //TODO
      }, options );
      
      //TODO placeholder
      const rectangle = new Rectangle( 0, 0, 600, 300, {
        stroke: GasPropertiesColorProfile.containerBoundsStrokeProperty,
        lineWidth: 3
      } );

      const dividerNode = new Line( 0, 0, 0, rectangle.height, {
        stroke: GasPropertiesColorProfile.containerBoundsStrokeProperty,
        lineWidth: 3,
        center: rectangle.center
      } );
      
      assert && assert( !options.children, 'DiffusionContainerNodeNode sets children' );
      options = _.extend( {
        children: [ rectangle, dividerNode ]
      }, options );
      
      super( options );

      //TODO temporary
      hasDividerProperty.link( hasDivider => {
        dividerNode.visible = hasDivider;
      } );
    }
  }

  return gasProperties.register( 'DiffusionContainerNode', DiffusionContainerNode );
} );