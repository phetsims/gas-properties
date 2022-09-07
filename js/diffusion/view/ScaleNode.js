// Copyright 2019-2022, University of Colorado Boulder

/**
 * ScaleNode displays the scale that appears along the bottom of the container in the Diffusion screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, Path, Text } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';

// constants
const TICK_LENGTH = 16; // view coordinates
const TICK_INTERVAL = 1; // nm

class ScaleNode extends Node {

  /**
   * @param {number} containerWidth - the container width, in pm
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( containerWidth, modelViewTransform, options ) {
    assert && assert( Number.isInteger( containerWidth ), `containerWidth must be an integer: ${containerWidth}` );
    assert && assert( modelViewTransform instanceof ModelViewTransform2,
      `invalid modelViewTransform: ${modelViewTransform}` );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
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
      stroke: GasPropertiesColors.scaleColorProperty,
      lineWidth: 1
    } );

    // '1 nm' label
    const labelNode = new Text( StringUtils.fillIn( GasPropertiesStrings.valueUnits, {
      value: TICK_INTERVAL,
      units: GasPropertiesStrings.nanometers
    } ), {
      font: new PhetFont( 12 ),
      fill: GasPropertiesColors.scaleColorProperty,
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
      fill: GasPropertiesColors.scaleColorProperty,
      stroke: null,
      centerX: dx / 2,
      centerY: TICK_LENGTH / 2
    } );

    assert && assert( !options.children, 'ScaleNode sets children' );
    options.children = [ ticksPath, labelNode, arrowNode ];

    super( options );
  }
}

gasProperties.register( 'ScaleNode', ScaleNode );
export default ScaleNode;