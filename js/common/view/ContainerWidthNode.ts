// Copyright 2018-2022, University of Colorado Boulder

/**
 * ContainerWidthNode displays dimensional arrows that correspond to the width of the container.
 * Origin is at the right end of the arrows, which corresponds to the container's origin.
 * This is not an expensive UI component, so it's updated regardless of whether it's visible.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
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
  public constructor( containerPosition: Vector2, widthProperty: NumberProperty, modelViewTransform: ModelViewTransform2,
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
      valuePattern: new PatternStringProperty( GasPropertiesStrings.valueUnitsStringProperty, {
        units: GasPropertiesStrings.nanometersStringProperty
      } ),
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
    Multilink.multilink( [ dimensionalArrowNode.boundsProperty, widthDisplay.boundsProperty ], () => {
      widthDisplay.right = dimensionalArrowNode.right - 28;
      widthDisplay.centerY = dimensionalArrowNode.centerY;
      this.right = containerViewPosition.x;
      this.top = containerViewPosition.y + 8;
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

gasProperties.register( 'ContainerWidthNode', ContainerWidthNode );