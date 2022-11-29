// Copyright 2019-2022, University of Colorado Boulder

/**
 * ScaleNode displays the scale that appears along the bottom of the container in the Diffusion screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, NodeOptions, NodeTranslationOptions, Path, Text } from '../../../../scenery/js/imports.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';

// constants
const TICK_LENGTH = 16; // view coordinates
const TICK_INTERVAL = 1; // nm

type SelfOptions = EmptySelfOptions;

type ScaleNodeOptions = SelfOptions & NodeTranslationOptions & PickRequired<NodeOptions, 'tandem' | 'visibleProperty'>;

export default class ScaleNode extends Node {

  /**
   * @param containerWidth - the container width, in pm
   * @param modelViewTransform
   * @param providedOptions
   */
  public constructor( containerWidth: number, modelViewTransform: ModelViewTransform2, providedOptions: ScaleNodeOptions ) {
    assert && assert( Number.isInteger( containerWidth ) && containerWidth > 0 );

    const options = optionize<ScaleNodeOptions, SelfOptions, NodeOptions>()( {
      // because we're setting options.children below
    }, providedOptions );

    const pmTickInterval = TICK_INTERVAL * 1000; // adjusted for nm to pm
    const dx = modelViewTransform.modelToViewDeltaX( pmTickInterval ); // pm
    const numberOfTicks = containerWidth / pmTickInterval;

    // One shape to describe all ticks
    const ticksShape = new Shape();
    for ( let i = 0; i <= numberOfTicks; i++ ) {
      ticksShape.moveTo( i * dx, 0 ).lineTo( i * dx, TICK_LENGTH );
    }

    const ticksPath = new Path( ticksShape, {
      stroke: GasPropertiesColors.scaleColorProperty,
      lineWidth: 1
    } );

    // '1 nm' label
    const labelNode = new Text( new PatternStringProperty( GasPropertiesStrings.valueUnitsStringProperty, {
      value: TICK_INTERVAL,
      units: GasPropertiesStrings.nanometersStringProperty
    } ), {
      font: new PhetFont( 12 ),
      fill: GasPropertiesColors.scaleColorProperty,
      maxWidth: 0.85 * dx
    } );
    labelNode.boundsProperty.link( bounds => {
      labelNode.centerX = dx / 2;
      labelNode.top = ticksPath.bottom;
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

    options.children = [ ticksPath, labelNode, arrowNode ];

    super( options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

gasProperties.register( 'ScaleNode', ScaleNode );