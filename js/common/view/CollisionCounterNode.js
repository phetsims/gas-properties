// Copyright 2018, University of Colorado Boulder

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
  const VBox = require( 'SCENERY/nodes/VBox' );
  const VStrut = require( 'SCENERY/nodes/VStrut' );

  // strings
  const averagingTimeString = require( 'string!GAS_PROPERTIES/averagingTime' );
  const averagingTimeUnitsString = require( 'string!GAS_PROPERTIES/averagingTimeUnits' );
  const picosecondsString = require( 'string!GAS_PROPERTIES/picoseconds' );
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

      options = options || {};

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

      const averagingTimeTextNode = new Text( averagingTimeString, {
        font: TITLE_FONT,
        left: X_MARGIN
      } );

      // Combo box items
      const comboBoxItems = collisionCounter.averagingTimes.map( averagingTime => {

        // e.g. '10 ps'
        const averagingTimeString = StringUtils.fillIn( averagingTimeUnitsString, {
          averagingTime: averagingTime,
          units: picosecondsString
        } );
        const node = new Text( averagingTimeString, {
          font: FONT
        } );
        return ComboBox.createItem( node, averagingTime );
      } );

      // Combo box
      const comboBox = new ComboBox( comboBoxItems, collisionCounter.averagingTimeProperty, comboBoxListParent, {
        listPosition: 'above',
        buttonXMargin: 5,
        buttonYMargin: 2,
        buttonCornerRadius: 5,
        itemXMargin: 2,
        itemYMargin: 2
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
          averagingTimeTextNode,
          comboBox
        ]
      } );

      // Background, sized to fit the content
      const backgroundNode = new Rectangle( 0, 0, content.width + ( 2 * X_MARGIN ), content.height + ( 2 * Y_MARGIN ), {
        cornerRadius: 6,
        fill: GasPropertiesColorProfile.collisionCounterBackgroundColorProperty,
        stroke: 'black',
        center: content.center
      } );

      // Pseudo-3D bezel around the outside edge of the counter
      const bezelBounds = new Bounds2( 0, 0, backgroundNode.width + ( 2 * BEZEL_WIDTH ), backgroundNode.height + ( 2 * BEZEL_WIDTH ) );
      const bezelNode = new ShadedRectangle( bezelBounds, {
        baseColor: 'rgb( 90, 90, 90 )',
        center: backgroundNode.center
      } );

      assert && assert( !options.children, 'CollisionCounterNode sets children' );
      options.children = [ bezelNode, backgroundNode, content ];

      super( options );

      // Put a red dot at the origin, for debugging layout.
      if ( phet.chipper.queryParameters.dev ) {
        this.addChild( new Circle( 3, { fill: 'red' } ) );
      }

      // move the counter
      collisionCounter.locationProperty.linkAttribute( this, 'translation' );

      // show/hide the counter
      collisionCounter.visibleProperty.link( visible => {
        this.visible = visible;
        if ( !visible ) {
          this.interruptSubtreeInput(); // interrupt user interactions
        }
      } );
    }
  }

  return gasProperties.register( 'CollisionCounterNode', CollisionCounterNode );
} );