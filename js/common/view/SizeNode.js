// Copyright 2018, University of Colorado Boulder

/**
 * Dimensional arrows that show the width of the container.
 * Origin is at the right end of the arrows, which corresponds to the container's origin.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const DimensionalArrowsNode = require( 'GAS_PROPERTIES/common/view/DimensionalArrowsNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Range = require( 'DOT/Range' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // strings
  const nanometersString = require( 'string!GAS_PROPERTIES/nanometers' );
  const sizeUnitsString = require( 'string!GAS_PROPERTIES/sizeUnits' );

  // constants
  const NUMBER_DISPLAY_RANGE = new Range( 0, 999 ); // determines the width of the NumberDisplay

  class SizeNode extends Node {

    /**
     * @param {Vector2} location - location of the container's origin, in model coordinates
     * @param {NumberProperty} widthProperty - width of the container, in model coordinates
     * @param {ModelViewTransform2} modelViewTransform
     * @param {BooleanProperty} visibleProperty
     * @param {Object} [options]
     */
    constructor( location, widthProperty, modelViewTransform, visibleProperty, options ) {

      options = options || {};

      const dimensionalArrowNode = new DimensionalArrowsNode( widthProperty, {
        color: GasPropertiesColorProfile.textFillProperty
      } );

      const widthDisplay = new NumberDisplay( widthProperty, NUMBER_DISPLAY_RANGE, {
        decimalPlaces: 1,
        valuePattern: StringUtils.fillIn( sizeUnitsString, {
          size: '{0}',
          units: nanometersString
        } ),
        font: new PhetFont( 12 ),
        cornerRadius: 3,
        numberFill: 'black',
        backgroundFill: 'white',
        backgroundStroke: 'black',
        backgroundLineWidth: 0.5,
        right: dimensionalArrowNode.right - 25,
        centerY: dimensionalArrowNode.centerY
      } );

      assert && assert( !options.children, 'SizeNode sets children' );
      options.children = [ dimensionalArrowNode, widthDisplay ];

      super( options );

      visibleProperty.linkAttribute( this, 'visible' );

      // right justify with the container location
      const rightJustify = () => {
        this.right = modelViewTransform.modelToViewX( location.x );
        this.top = modelViewTransform.modelToViewY( location.y ) + 8;
      };
      rightJustify();
      dimensionalArrowNode.on( 'bounds', () => { rightJustify(); } );
    }
  }

  return gasProperties.register( 'SizeNode', SizeNode );
} );