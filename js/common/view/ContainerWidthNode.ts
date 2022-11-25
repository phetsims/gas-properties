// Copyright 2018-2022, University of Colorado Boulder

/**
 * ContainerWidthNode displays dimensional arrows that correspond to the width of the container.
 * Origin is at the right end of the arrows, which corresponds to the container's origin.
 * This is not an expensive UI component, so it's updated regardless of whether it's visible.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { RangedProperty } from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import GasPropertiesColors from '../GasPropertiesColors.js';
import DimensionalArrowsNode from './DimensionalArrowsNode.js';

type SelfOptions = EmptySelfOptions;

type ContainerWidthNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem' | 'visibleProperty'>;

export default class ContainerWidthNode extends Node {

  /**
   * @param containerPosition - position of the container, in model coordinates
   * @param widthProperty - width of the container, in model coordinates
   * @param modelViewTransform
   * @param providedOptions
   */
  public constructor( containerPosition: Vector2, widthProperty: RangedProperty, modelViewTransform: ModelViewTransform2,
                      providedOptions: ContainerWidthNodeOptions ) {

    const options = optionize<ContainerWidthNodeOptions, SelfOptions, NodeOptions>()( {
      // because we're setting options.children below
    }, providedOptions );

    // Convert the width from model to view coordinates
    const viewWidthProperty = new DerivedProperty( [ widthProperty ],
      width => modelViewTransform.modelToViewDeltaX( width ), {
        valueType: 'number'
      } );

    // Dimensional arrows, in view coordinates
    const dimensionalArrowNode = new DimensionalArrowsNode( viewWidthProperty, {
      color: GasPropertiesColors.sizeArrowColorProperty
    } );

    // Convert from pm to nm
    const nmWidthProperty = new DerivedProperty( [ widthProperty ], width => width / 1000, {
      valueType: 'number'
    } );
    const nmWidthRange = new Range( widthProperty.range.min / 1000, widthProperty.range.max / 1000 );

    // Display the width in nm
    const widthDisplay = new NumberDisplay( nmWidthProperty, nmWidthRange, {
      decimalPlaces: 1,
      valuePattern: StringUtils.fillIn( GasPropertiesStrings.valueUnits, { units: GasPropertiesStrings.nanometers } ),
      cornerRadius: 3,
      textOptions: {
        font: new PhetFont( 12 ),
        fill: 'black',
        maxWidth: 100
      },
      backgroundFill: 'white',
      backgroundStroke: 'black',
      backgroundLineWidth: 0.5
    } );

    options.children = [ dimensionalArrowNode, widthDisplay ];

    super( options );

    // right justify with the container
    const containerViewPosition = modelViewTransform.modelToViewPosition( containerPosition );
    const updateLayout = () => {
      widthDisplay.right = dimensionalArrowNode.right - 28;
      widthDisplay.centerY = dimensionalArrowNode.centerY;
      this.right = containerViewPosition.x;
      this.top = containerViewPosition.y + 8;
    };
    updateLayout();
    dimensionalArrowNode.boundsProperty.lazyLink( () => { updateLayout(); } );
  }
}

gasProperties.register( 'ContainerWidthNode', ContainerWidthNode );