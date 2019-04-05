// Copyright 2018-2019, University of Colorado Boulder

/**
 * Dimensional arrows that show the width of the container.
 * Origin is at the right end of the arrows, which corresponds to the container's origin.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DimensionalArrowsNode = require( 'GAS_PROPERTIES/common/view/DimensionalArrowsNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // strings
  const nanometersString = require( 'string!GAS_PROPERTIES/nanometers' );
  const valueUnitsString = require( 'string!GAS_PROPERTIES/valueUnits' );

  class ContainerWidthNode extends Node {

    /**
     * @param {Vector2} containerLocation - location of the container, in model coordinates
     * @param {NumberProperty} widthProperty - width of the container, in model coordinates
     * @param {ModelViewTransform2} modelViewTransform
     * @param {BooleanProperty} visibleProperty
     * @param {Object} [options]
     */
    constructor( containerLocation, widthProperty, modelViewTransform, visibleProperty, options ) {

      assert && assert( widthProperty.range, 'widthProperty must have range' );

      const viewWidthProperty = new DerivedProperty( [ widthProperty ],
        width => modelViewTransform.modelToViewDeltaX( width ) );

      const dimensionalArrowNode = new DimensionalArrowsNode( viewWidthProperty, {
        color: GasPropertiesColorProfile.sizeArrowColorProperty
      } );

      const widthDisplay = new NumberDisplay( widthProperty, widthProperty.range, {
        decimalPlaces: 1,
        valuePattern: StringUtils.fillIn( valueUnitsString, { units: nanometersString } ),
        font: new PhetFont( 12 ),
        cornerRadius: 3,
        numberFill: 'black',
        backgroundFill: 'white',
        backgroundStroke: 'black',
        backgroundLineWidth: 0.5
      } );

      assert && assert( !options || !options.children, 'ContainerWidthNode sets children' );
      options = _.extend( {}, options, {
        children: [ dimensionalArrowNode, widthDisplay ]
      } );

      super( options );

      visibleProperty.linkAttribute( this, 'visible' );

      // right justify with the container
      const containerViewLocation = modelViewTransform.modelToViewPosition( containerLocation );
      const updateLayout = () => {
        widthDisplay.right = dimensionalArrowNode.right - 28;
        widthDisplay.centerY = dimensionalArrowNode.centerY;
        this.right = containerViewLocation.x;
        this.top = containerViewLocation.y + 8;
      };
      updateLayout();
      dimensionalArrowNode.on( 'bounds', () => { updateLayout(); } );
    }
  }

  return gasProperties.register( 'ContainerWidthNode', ContainerWidthNode );
} );