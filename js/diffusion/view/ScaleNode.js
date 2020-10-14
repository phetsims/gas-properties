// Copyright 2019-2020, University of Colorado Boulder

/**
 * ScaleNode displays the scale that appears along the bottom of the container in the Diffusion screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GasPropertiesColorProfile from '../../common/GasPropertiesColorProfile.js';
import gasProperties from '../../gasProperties.js';
import gasPropertiesStrings from '../../gasPropertiesStrings.js';

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

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,

      // model controls visibility
      visiblePropertyOptions: {
        phetioReadOnly: true,
        phetioDocumentation: 'visibility is controlled by the model'
      }
    }, options );

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
    const labelNode = new Text( StringUtils.fillIn( gasPropertiesStrings.valueUnits, {
      value: TICK_INTERVAL,
      units: gasPropertiesStrings.nanometers
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

gasProperties.register( 'ScaleNode', ScaleNode );
export default ScaleNode;