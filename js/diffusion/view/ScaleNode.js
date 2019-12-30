// Copyright 2019, University of Colorado Boulder

/**
 * ScaleNode displays the scale that appears along the bottom of the container in the Diffusion screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Shape = require( 'KITE/Shape' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Utils = require( 'DOT/Utils' );

  // strings
  const nanometersString = require( 'string!GAS_PROPERTIES/nanometers' );
  const valueUnitsString = require( 'string!GAS_PROPERTIES/valueUnits' );

  // constants
  const TICK_LENGTH = 16; // view coordinates
  const TICK_INTERVAL = 1; // nm

  class ScaleNode extends Node {

    /**
     * @param {number} containerWidth - the container width, in pm
     * @param {ModelViewTransform2} modelViewTransform
     * @param {BooleanProperty} visibleProperty
     * @param {Object} [options]
     */
    constructor( containerWidth, modelViewTransform, visibleProperty, options ) {
      assert && assert( Utils.isInteger( containerWidth ), `containerWidth must be an integer: ${containerWidth}` );
      assert && assert( modelViewTransform instanceof ModelViewTransform2,
        `invalid modelViewTransform: ${modelViewTransform}` );
      assert && assert( visibleProperty instanceof BooleanProperty, `invalid visibleProperty: ${visibleProperty}` );

      const pmTickInterval = TICK_INTERVAL * 1000; // adjusted for nm to pm
      const dx = modelViewTransform.modelToViewDeltaX( pmTickInterval ); // pm
      const numberOfTicks = containerWidth / pmTickInterval;

      // One shape to describe all of the ticks
      const ticksShape = new Shape();
      for ( let i = 0; i <= numberOfTicks; i++ ) {
        ticksShape.moveTo( i * dx, 0 ).lineTo( i * dx, TICK_LENGTH );
      }

      const ticksPath = new Path( ticksShape, {
        stroke: GasPropertiesColorProfile.scaleColorProperty,
        lineWidth: 1
      } );

      // '1 nm' label
      const labelNode = new Text( StringUtils.fillIn( valueUnitsString, {
        value: TICK_INTERVAL,
        units: nanometersString
      } ), {
        font: new PhetFont( 12 ),
        fill: GasPropertiesColorProfile.scaleColorProperty,
        centerX: dx / 2,
        top: ticksPath.bottom,
        maxWidth: dx
      } );

      // double-headed arrow
      const arrowNode = new ArrowNode( 0, 0, dx, 0, {
        doubleHead: true,
        tailWidth: 0.5,
        headHeight: 6,
        headWidth: 6,
        fill: GasPropertiesColorProfile.scaleColorProperty,
        stroke: null,
        centerX: dx / 2,
        centerY: TICK_LENGTH / 2
      } );

      assert && assert( !options.children, 'ScaleNode sets children' );
      options.children = [ ticksPath, labelNode, arrowNode ];

      super( options );

      visibleProperty.link( visible => {
        this.visible = visible;
      } );
    }
  }

  return gasProperties.register( 'ScaleNode', ScaleNode );
} );