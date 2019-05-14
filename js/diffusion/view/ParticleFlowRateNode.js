// Copyright 2019, University of Colorado Boulder

/**
 * Vectors that indicate the flow rate of one particle species between the left and right sides of the container.
 * Higher flow rate results in a bigger vector.  Vectors are color-coded to the particle color.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const Node = require( 'SCENERY/nodes/Node' );

  // constants
  const X_SPACING = 5; // space between the tails of the left and right arrows
  const SCALE = GasPropertiesQueryParameters.flowRateScale; // arrow length per 1 particle/ps

  class ParticleFlowRateNode extends Node {

    /**
     * @param {ParticleFlowRate} model
     * @param {Object} [options]
     */
    constructor( model, options ) {

      options = _.extend( {
        arrowNodeOptions: null // nested options, set below
      }, options );

      options.arrowNodeOptions = _.extend( {
        headHeight: 15,
        headWidth: 15,
        tailWidth: 8,
        fill: 'white',
        stroke: 'black'
      }, options.arrowNodeOptions );

      const minTailLength = options.arrowNodeOptions.headHeight + 4;

      // left and right arrows
      const leftArrowNode = new ArrowNode( 0, 0, -minTailLength, 0, options.arrowNodeOptions );
      const rightArrowNode = new ArrowNode( 0, 0, minTailLength, 0, options.arrowNodeOptions );

      // origin is between the tails of the 2 arrows 
      leftArrowNode.x = -X_SPACING / 2;
      rightArrowNode.x = X_SPACING / 2;

      assert && assert( !options.children, 'ParticleFlowRateNode sets options' );
      options = _.extend( {
        children: [ leftArrowNode, rightArrowNode ]
      }, options );

      super( options );

      model.leftFlowRateProperty.link( flowRate => {
        leftArrowNode.visible = ( flowRate > 0 );
        leftArrowNode.setTip( -( minTailLength + flowRate * SCALE ), 0 );
      } );

      model.rightFlowRateProperty.link( flowRate => {
        rightArrowNode.visible = ( flowRate > 0 );
        rightArrowNode.setTip( minTailLength + flowRate * SCALE, 0 );
      } );
    }
  }

  return gasProperties.register( 'ParticleFlowRateNode', ParticleFlowRateNode );
} );