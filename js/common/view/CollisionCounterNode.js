// Copyright 2018-2019, University of Colorado Boulder

//TODO DESIGN redesign collision counter UX
/**
 * Collision Counter, displays the number of collisions between particles and the container walls.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const ComboBox = require( 'SUN/ComboBox' );
  const ComboBoxItem = require( 'SUN/ComboBoxItem' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const PlayResetButton = require( 'GAS_PROPERTIES/common/view/PlayResetButton' );
  const Range = require( 'DOT/Range' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const ShadedRectangle = require( 'SCENERY_PHET/ShadedRectangle' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const ToolDragListener = require( 'GAS_PROPERTIES/common/view/ToolDragListener' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const VStrut = require( 'SCENERY/nodes/VStrut' );

  // strings
  const picosecondsString = require( 'string!GAS_PROPERTIES/picoseconds' );
  const samplePeriodString = require( 'string!GAS_PROPERTIES/samplePeriod' );
  const valueUnitsString = require( 'string!GAS_PROPERTIES/valueUnits' );
  const wallCollisionsString = require( 'string!GAS_PROPERTIES/wallCollisions' );

  // constants
  const X_MARGIN = 15;
  const Y_MARGIN = 10;
  const X_SPACING = 10;
  const Y_SPACING = 5;
  const BEZEL_WIDTH = 6;
  const NUMBER_DISPLAY_RANGE = new Range( 0, 1E6 );
  const FONT = new PhetFont( 14 );
  const TITLE_FONT = new PhetFont( 16 );

  class CollisionCounterNode extends Node {

    /**
     * @param {CollisionCounter} collisionCounter
     * @param {Node} comboBoxListParent
     * @param {Object} [options]
     */
    constructor( collisionCounter, comboBoxListParent, options ) {

      options = _.extend( {
        dragBoundsProperty: null // {Property.<Bounds2>|null} in view coordinates
      }, options );

      const wallCollisionsTextNode = new Text( wallCollisionsString, {
        font: TITLE_FONT
      } );

      const valueDisplay = new NumberDisplay( collisionCounter.numberOfCollisionsProperty, NUMBER_DISPLAY_RANGE, {
        backgroundFill: 'white',
        backgroundStroke: 'black',
        font: FONT,
        xMargin: 8,
        yMargin: 4,
        cornerRadius: 3
      } );

      const playResetButton = new PlayResetButton( collisionCounter.isRunningProperty );

      const samplePeriodTextNode = new Text( samplePeriodString, {
        font: TITLE_FONT,
        left: X_MARGIN
      } );

      // Combo box items
      const comboBoxItems = collisionCounter.samplePeriods.map( samplePeriod => {

        // e.g. '10 ps'
        const samplePeriodString = StringUtils.fillIn( valueUnitsString, {
          value: samplePeriod,
          units: picosecondsString
        } );
        const node = new Text( samplePeriodString, {
          font: FONT
        } );
        return new ComboBoxItem( node, samplePeriod );
      } );

      // Combo box
      const comboBox = new ComboBox( comboBoxItems, collisionCounter.samplePeriodProperty, comboBoxListParent, {
        listPosition: 'below',
        align: 'right',
        xMargin: 6,
        yMargin: 3,
        cornerRadius: 5
      } );

      // all of the stuff that appear on the counter
      const content = new VBox( {
        align: 'center',
        spacing: Y_SPACING,
        children: [
          wallCollisionsTextNode,
          new HBox( {
            spacing: X_SPACING,
            children: [ valueDisplay, playResetButton ]
          } ),
          new VStrut( 2 ),
          samplePeriodTextNode,
          comboBox
        ]
      } );

      // Background, sized to fit the content
      const backgroundNode = new Rectangle( 0, 0, content.width + ( 2 * X_MARGIN ), content.height + ( 2 * Y_MARGIN ), {
        cornerRadius: 6,
        fill: GasPropertiesColorProfile.collisionCounterBackgroundColorProperty,
        stroke: 'black'
      } );

      // Pseudo-3D bezel around the outside edge of the counter
      const bezelBounds = new Bounds2( 0, 0, backgroundNode.width + ( 2 * BEZEL_WIDTH ), backgroundNode.height + ( 2 * BEZEL_WIDTH ) );
      const bezelNode = new ShadedRectangle( bezelBounds, {
        baseColor: GasPropertiesColorProfile.collisionCounterBezelColorProperty
      } );

      backgroundNode.center = bezelNode.center;
      content.center = backgroundNode.center;

      assert && assert( !options.hasOwnProperty( 'children' ), 'CollisionCounterNode sets children' );
      options = _.extend( {
        children: [ bezelNode, backgroundNode, content ]
      }, options );

      super( options );

      // Put a red dot at the origin, for debugging layout.
      if ( phet.chipper.queryParameters.dev ) {
        this.addChild( new Circle( 3, { fill: 'red' } ) );
      }

      // dragging
      this.addInputListener( new ToolDragListener( this, collisionCounter.visibleProperty, {
        locationProperty: collisionCounter.locationProperty,
        dragBoundsProperty: options.dragBoundsProperty
      } ) );
    }
  }

  return gasProperties.register( 'CollisionCounterNode', CollisionCounterNode );
} );