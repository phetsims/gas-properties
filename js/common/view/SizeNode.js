// Copyright 2018, University of Colorado Boulder

/**
 * Dimensional arrows that show the width of the container.
 * Origin is at the right end of the arrows, which corresponds to the container's origin.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const DimensionalArrowNode = require( 'GAS_PROPERTIES/common/view/DimensionalArrowNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const Node = require( 'SCENERY/nodes/Node' );

  class SizeNode extends Node {

    /**
     * @param {Vector2} location - location of the container's origin, in model coordinates
     * @param {NumberProperty} widthProperty - width of the container, in model coordinates
     * @param {ModelViewTransform2} modelViewTransform
     * @param {BooleanProperty} visibleProperty
     * @param {Object} [options]
     */
    constructor( location, widthProperty, modelViewTransform, visibleProperty, options ) {

      options = options || {};

      const dimensionalArrowNode = new DimensionalArrowNode( widthProperty, {
        color: GasPropertiesColorProfile.textFillProperty
      } );

      assert && assert( !options.children, 'SizeNode sets children' );
      options.children = [ dimensionalArrowNode ];

      super( options );

      visibleProperty.linkAttribute( this, 'visible' );

      // right justify with the container location
      dimensionalArrowNode.on( 'bounds', () => {
        this.right = modelViewTransform.modelToViewX( location.x );
        this.top =  modelViewTransform.modelToViewY( location.y ) + 5;
      } );
    }
  }

  return gasProperties.register( 'SizeNode', SizeNode );
} );