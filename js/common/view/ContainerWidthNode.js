// Copyright 2018-2022, University of Colorado Boulder

/**
 * ContainerWidthNode displays dimensional arrows that correspond to the width of the container.
 * Origin is at the right end of the arrows, which corresponds to the container's origin.
 * This is not an expensive UI component, so it's updated regardless of whether it's visible.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import GasPropertiesColors from '../GasPropertiesColors.js';
import DimensionalArrowsNode from './DimensionalArrowsNode.js';

export default class ContainerWidthNode extends Node {

  /**
   * @param {Vector2} containerPosition - position of the container, in model coordinates
   * @param {NumberProperty} widthProperty - width of the container, in model coordinates
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( containerPosition, widthProperty, modelViewTransform, options ) {
    assert && assert( containerPosition instanceof Vector2, `invalid containerPosition: ${containerPosition}` );
    assert && assert( widthProperty instanceof NumberProperty, `invalid widthProperty: ${widthProperty}` );
    assert && assert( widthProperty.range, 'widthProperty must have range' );
    assert && assert( modelViewTransform instanceof ModelViewTransform2,
      `invalid modelViewTransform: ${modelViewTransform}` );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

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

    assert && assert( !options.children, 'ContainerWidthNode sets children' );
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