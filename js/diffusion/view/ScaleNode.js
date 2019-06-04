// Copyright 2019, University of Colorado Boulder

/**
 * The scale that appears along the bottom of the container in the Diffusion screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );
  const Util = require( 'DOT/Util' );

  // constants
  const TICK_LENGTH = 20; // view coordinates
  const TICK_INTERVAL = 1000; // pm

  class ScaleNode extends Node {

    /**
     * @param {number} containerWidth - the container width, in pm
     * @param {ModelViewTransform2} modelViewTransform
     * @param {BooleanProperty} visibleProperty
     * @param {Object} [options]
     */
    constructor( containerWidth, modelViewTransform, visibleProperty, options ) {
      assert && assert( Util.isInteger( containerWidth ), `containerWidth must be an integer: ${containerWidth}` );
      assert && assert( modelViewTransform instanceof ModelViewTransform2,
        `invalid modelViewTransform: ${modelViewTransform}` );
      assert && assert( visibleProperty instanceof BooleanProperty, `invalid visibleProperty: ${visibleProperty}` );

      // One shape to describe all of the ticks
      const ticksShape = new Shape();
      for ( let i = 0; i <= containerWidth; i += TICK_INTERVAL ) {
        const x = modelViewTransform.modelToViewX( i );
        ticksShape.moveTo( x, 0 ).lineTo( x, TICK_LENGTH );
      }

      const ticksPath = new Path( ticksShape, {
        stroke: GasPropertiesColorProfile.scaleColorProperty,
        lineWidth: 1
      } );

      assert && assert( !options.children, 'ScaleNode sets children' );
      options.children = [ ticksPath ];

      super( options );

      visibleProperty.link( visible => {
        this.visible = visible;
      } );
    }
  }

  return gasProperties.register( 'ScaleNode', ScaleNode );
} );