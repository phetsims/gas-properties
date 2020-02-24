// Copyright 2018-2020, University of Colorado Boulder

/**
 * CollisionCounterNode displays the number of collisions between particles and the container walls, during
 * some sample period.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const CollisionCounter = require( 'GAS_PROPERTIES/common/model/CollisionCounter' );
  const ComboBox = require( 'SUN/ComboBox' );
  const ComboBoxItem = require( 'SUN/ComboBoxItem' );
  const DragBoundsProperty = require( 'SCENERY_PHET/DragBoundsProperty' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const PlayResetButton = require( 'GAS_PROPERTIES/common/view/PlayResetButton' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const ShadedRectangle = require( 'SCENERY_PHET/ShadedRectangle' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Text = require( 'SCENERY/nodes/Text' );
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
  const CONTROL_FONT = new PhetFont( 14 );
  const LABEL_FONT = new PhetFont( 16 );

  class CollisionCounterNode extends Node {

    /**
     * @param {CollisionCounter} collisionCounter
     * @param {Node} listboxParent  - parent for the ComboBox's listbox
     * @param {Property.<Bounds2>} visibleBoundsProperty - visible bounds of the ScreenView
     * @param {Object} [options]
     */
    constructor( collisionCounter, listboxParent, visibleBoundsProperty, options ) {
      assert && assert( collisionCounter instanceof CollisionCounter,
        `invalid collisionCounter: ${collisionCounter}` );
      assert && assert( listboxParent instanceof Node,
        `invalid listboxParent: ${listboxParent}` );
      assert && assert( visibleBoundsProperty instanceof Property,
        `invalid visibleBoundsProperty: ${visibleBoundsProperty}` );

      options = merge( {
        cursor: 'pointer',

        // phet-io
        tandem: Tandem.REQUIRED
      }, options );

      const wallCollisionsTextNode = new Text( wallCollisionsString, {
        pickable: false,
        font: LABEL_FONT,
        maxWidth: 110 // determined empirically
      } );

      const valueDisplay = new NumberDisplay( collisionCounter.numberOfCollisionsProperty, NUMBER_DISPLAY_RANGE, {
        backgroundFill: 'white',
        backgroundStroke: 'black',
        font: CONTROL_FONT,
        xMargin: 8,
        yMargin: 4,
        cornerRadius: 3
      } );

      const playResetButton = new PlayResetButton( collisionCounter.isRunningProperty, {
        tandem: options.tandem.createTandem( 'playResetButton' )
      } );

      const samplePeriodTextNode = new Text( samplePeriodString, {
        pickable: false,
        font: LABEL_FONT,
        left: X_MARGIN,
        maxWidth: 110 // determined empirically
      } );

      // Combo box items
      const comboBoxItems = collisionCounter.samplePeriods.map( samplePeriod => {

        // e.g. '10 ps'
        const samplePeriodString = StringUtils.fillIn( valueUnitsString, {
          value: samplePeriod,
          units: picosecondsString
        } );
        const node = new Text( samplePeriodString, {
          font: CONTROL_FONT,
          maxWidth: 100 // determined empirically
        } );
        return new ComboBoxItem( node, samplePeriod );
      } );

      // Combo box
      const samplePeriodComboBox = new ComboBox( comboBoxItems, collisionCounter.samplePeriodProperty, listboxParent, {
        listPosition: 'below',
        align: 'right',
        xMargin: 6,
        yMargin: 3,
        cornerRadius: 5,
        tandem: options.tandem.createTandem( 'samplePeriodComboBox' )
      } );

      // all of the stuff that appears on the counter
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
          samplePeriodComboBox
        ]
      } );

      // Background, sized to fit the content
      const rectangleNode = new Rectangle( 0, 0, content.width + ( 2 * X_MARGIN ), content.height + ( 2 * Y_MARGIN ), {
        cornerRadius: 6,
        fill: GasPropertiesColorProfile.collisionCounterBackgroundColorProperty,
        stroke: 'black'
      } );

      // Pseudo-3D bezel around the outside edge of the rectangle
      const bezelBounds = new Bounds2( 0, 0,
        rectangleNode.width + ( 2 * BEZEL_WIDTH ), rectangleNode.height + ( 2 * BEZEL_WIDTH ) );
      const bezelNode = new ShadedRectangle( bezelBounds, {
        baseColor: GasPropertiesColorProfile.collisionCounterBezelColorProperty
      } );

      rectangleNode.center = bezelNode.center;

      // The background include the bezel and rectangle.
      const backgroundNode = new Node( {
        children: [ bezelNode, rectangleNode ]
      } );

      content.center = backgroundNode.center;

      assert && assert( !options.children, 'CollisionCounterNode sets children' );
      options = merge( {
        children: [ backgroundNode, content ]
      }, options );

      super( options );

      // Put a red dot at the origin, for debugging layout.
      if ( GasPropertiesQueryParameters.origin ) {
        this.addChild( new Circle( 3, { fill: 'red' } ) );
      }

      // visibility
      collisionCounter.visibleProperty.link( visible => {
        this.interruptSubtreeInput(); // interrupt user interactions
        this.visible = visible;
        if ( visible ) {
          this.moveToFront();
          listboxParent.moveToFront();
        }
      } );

      // Move to the collision counter's position
      collisionCounter.positionProperty.link( position => {
        this.translation = position;
      } );

      // drag bounds, adjusted to keep this entire Node inside visible bounds
      const dragBoundsProperty = new DragBoundsProperty( this, visibleBoundsProperty );

      // interrupt user interactions when the visible bounds changes, such as a device orientation change or window resize
      visibleBoundsProperty.link( () => this.interruptSubtreeInput() );

      // If the collision counter is outside the drag bounds, move it inside.
      dragBoundsProperty.link( dragBounds => {
        if ( !dragBounds.containsPoint( collisionCounter.positionProperty ) ) {
          collisionCounter.positionProperty.value =
            dragBounds.closestPointTo( collisionCounter.positionProperty.value );
        }
      } );

      // dragging, added to background so that other UI components get input events on touch devices
      backgroundNode.addInputListener( new DragListener( {
        targetNode: this,
        positionProperty: collisionCounter.positionProperty,
        dragBoundsProperty: dragBoundsProperty,
        tandem: options.tandem.createTandem( 'dragListener' )
      } ) );

      // Move to front on pointer down, anywhere on this Node, including interactive subcomponents.
      // This needs to be a DragListener so that touchSnag works.
      this.addInputListener( new DragListener( {
        attach: false, // so that this DragListener won't be ignored
        start: () => {
          this.moveToFront();
          listboxParent.moveToFront();
        },
        tandem: options.tandem.createTandem( 'moveToFrontListener' )
      } ) );
    }
  }

  return gasProperties.register( 'CollisionCounterNode', CollisionCounterNode );
} );