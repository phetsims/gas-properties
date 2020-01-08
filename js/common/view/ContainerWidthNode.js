// Copyright 2018-2019, University of Colorado Boulder

/**
 * ContainerWidthNode displays dimensional arrows that correspond to the width of the container.
 * Origin is at the right end of the arrows, which corresponds to the container's origin.
 * This is not an expensive UI component, so it's updated regardless of whether it's visible.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DimensionalArrowsNode = require( 'GAS_PROPERTIES/common/view/DimensionalArrowsNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const merge = require( 'PHET_CORE/merge' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Range = require( 'DOT/Range' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Vector2 = require( 'DOT/Vector2' );

  // strings
  const nanometersString = require( 'string!GAS_PROPERTIES/nanometers' );
  const valueUnitsString = require( 'string!GAS_PROPERTIES/valueUnits' );

  class ContainerWidthNode extends Node {

    /**
     * @param {Vector2} containerPosition - position of the container, in model coordinates
     * @param {NumberProperty} widthProperty - width of the container, in model coordinates
     * @param {ModelViewTransform2} modelViewTransform
     * @param {BooleanProperty} visibleProperty
     * @param {Object} [options]
     */
    constructor( containerPosition, widthProperty, modelViewTransform, visibleProperty, options ) {
      assert && assert( containerPosition instanceof Vector2, `invalid containerPosition: ${containerPosition}` );
      assert && assert( widthProperty instanceof NumberProperty, `invalid widthProperty: ${widthProperty}` );
      assert && assert( widthProperty.range, 'widthProperty must have range' );
      assert && assert( modelViewTransform instanceof ModelViewTransform2,
        `invalid modelViewTransform: ${modelViewTransform}` );
      assert && assert( visibleProperty instanceof BooleanProperty, `invalid visibleProperty: ${visibleProperty}` );

      // Convert the width from model to view coordinates
      const viewWidthProperty = new DerivedProperty( [ widthProperty ],
        width => modelViewTransform.modelToViewDeltaX( width ), {
          valueType: 'number'
        } );

      // Dimensional arrows, in view coordinates
      const dimensionalArrowNode = new DimensionalArrowsNode( viewWidthProperty, {
        color: GasPropertiesColorProfile.sizeArrowColorProperty
      } );

      // Convert from pm to nm
      const nmWidthProperty = new DerivedProperty( [ widthProperty ], width => width / 1000, {
        valueType: 'number'
      } );
      const nmWidthRange = new Range( widthProperty.range.min / 1000, widthProperty.range.max / 1000 );

      // Display the width in nm
      const widthDisplay = new NumberDisplay( nmWidthProperty, nmWidthRange, {
        decimalPlaces: 1,
        valuePattern: StringUtils.fillIn( valueUnitsString, { units: nanometersString } ),
        font: new PhetFont( 12 ),
        cornerRadius: 3,
        numberFill: 'black',
        numberMaxWidth: 100,
        backgroundFill: 'white',
        backgroundStroke: 'black',
        backgroundLineWidth: 0.5
      } );

      assert && assert( !options || !options.children, 'ContainerWidthNode sets children' );
      options = merge( {}, options, {
        children: [ dimensionalArrowNode, widthDisplay ]
      } );

      super( options );

      visibleProperty.linkAttribute( this, 'visible' );

      // right justify with the container
      const containerViewPosition = modelViewTransform.modelToViewPosition( containerPosition );
      const updateLayout = () => {
        widthDisplay.right = dimensionalArrowNode.right - 28;
        widthDisplay.centerY = dimensionalArrowNode.centerY;
        this.right = containerViewPosition.x;
        this.top = containerViewPosition.y + 8;
      };
      updateLayout();
      dimensionalArrowNode.on( 'bounds', () => { updateLayout(); } );
    }
  }

  return gasProperties.register( 'ContainerWidthNode', ContainerWidthNode );
} );