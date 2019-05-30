// Copyright 2018-2019, University of Colorado Boulder

/**
 * View component for the pressure gauge.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Circle = require( 'SCENERY/nodes/Circle' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const GaugeNode = require( 'SCENERY_PHET/GaugeNode' );
  const LinearGradient = require( 'SCENERY/util/LinearGradient' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PressureDisplay = require( 'GAS_PROPERTIES/common/view/PressureDisplay' );
  const PressureGauge = require( 'GAS_PROPERTIES/common/model/PressureGauge' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // strings
  const pressureString = require( 'string!GAS_PROPERTIES/pressure' );

  // constants
  const DIAL_RADIUS = 50;
  const POST_HEIGHT = 0.6 * DIAL_RADIUS;

  class PressureGaugeNode extends Node {

    /**
     * @param {PressureGauge} pressureGauge
     * @param {Node} listParent - parent for the combo box popup list
     * @param {Object} [options]
     */
    constructor( pressureGauge, listParent, options ) {
      assert && assert( pressureGauge instanceof PressureGauge, `invalid pressureGauge: ${pressureGauge}` );
      assert && assert( listParent instanceof Node, `invalid listParent: ${listParent}` );

      // circular dial with needle
      const dialNode = new GaugeNode( pressureGauge.pressureKilopascalsProperty, pressureString,
        pressureGauge.pressureRange, {
          radius: DIAL_RADIUS
        } );

      // horizontal post the sticks out of the left side of the gauge
      const postNode = new Rectangle( 0, 0, DIAL_RADIUS + 15, POST_HEIGHT, {
        fill: PressureGaugeNode.createPostGradient( POST_HEIGHT ),
        right: dialNode.centerX,
        centerY: dialNode.centerY
      } );

      // combo box to display value and choose units
      const pressureDisplay = new PressureDisplay( pressureGauge, listParent, {
        centerX: dialNode.centerX,
        bottom: dialNode.bottom,
        maxWidth: dialNode.width
      } );

      assert && assert( !options || !options.children, 'PressureGaugeNode sets children' );
      options = _.extend( {
        children: [ postNode, dialNode, pressureDisplay ]
      }, options );

      super( options );

      // Red dot at the origin, for debugging layout
      if ( GasPropertiesQueryParameters.origin ) {
        this.addChild( new Circle( 3, { fill: 'red' } ) );
      }
    }

    /**
     * Creates the gradient for the post that connects the gauge to the container.
     * @param {number} postHeight
     * @returns {Gradient}
     * @public
     * @static
     */
    static createPostGradient( postHeight ) {
      assert && assert( typeof postHeight === 'number' && postHeight > 0, `invalid postHeight: ${postHeight}` );

      return new LinearGradient( 0, 0, 0, postHeight )
        .addColorStop( 0, 'rgb( 120, 120, 120 )' )
        .addColorStop( 0.3, 'rgb( 220, 220, 220 )' )
        .addColorStop( 0.5, 'rgb( 220, 220, 220 )' )
        .addColorStop( 1, 'rgb( 100, 100, 100 )' );
    }
  }

  return gasProperties.register( 'PressureGaugeNode', PressureGaugeNode );
} );