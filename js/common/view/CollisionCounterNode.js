// Copyright 2018-2020, University of Colorado Boulder

/**
 * CollisionCounterNode displays the number of collisions between particles and the container walls, during
 * some sample period.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import DragBoundsProperty from '../../../../scenery-phet/js/DragBoundsProperty.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ShadedRectangle from '../../../../scenery-phet/js/ShadedRectangle.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import VStrut from '../../../../scenery/js/nodes/VStrut.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import gasPropertiesStrings from '../../gasPropertiesStrings.js';
import GasPropertiesColorProfile from '../GasPropertiesColorProfile.js';
import GasPropertiesQueryParameters from '../GasPropertiesQueryParameters.js';
import CollisionCounter from '../model/CollisionCounter.js';
import PlayResetButton from './PlayResetButton.js';

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
      tandem: Tandem.REQUIRED,

      // model controls visibility
      visiblePropertyOptions: {
        phetioReadOnly: true,
        phetioDocumentation: 'visibility is controlled by the model'
      }
    }, options );

    const wallCollisionsTextNode = new Text( gasPropertiesStrings.wallCollisions, {
      pickable: false,
      font: LABEL_FONT,
      maxWidth: 110 // determined empirically
    } );

    const valueDisplay = new NumberDisplay( collisionCounter.numberOfCollisionsProperty, NUMBER_DISPLAY_RANGE, {
      backgroundFill: 'white',
      backgroundStroke: 'black',
      textOptions: {
        font: CONTROL_FONT
      },
      xMargin: 8,
      yMargin: 4,
      cornerRadius: 3,
      pickable: false // so we can drag
    } );

    const playResetButton = new PlayResetButton( collisionCounter.isRunningProperty, {
      tandem: options.tandem.createTandem( 'playResetButton' )
    } );

    const samplePeriodTextNode = new Text( gasPropertiesStrings.samplePeriod, {
      pickable: false,
      font: LABEL_FONT,
      left: X_MARGIN,
      maxWidth: 110 // determined empirically
    } );

    // Combo box items
    const comboBoxItems = collisionCounter.samplePeriods.map( samplePeriod => {

      // e.g. '10 ps'
      const samplePeriodString = StringUtils.fillIn( gasPropertiesStrings.valueUnits, {
        value: samplePeriod,
        units: gasPropertiesStrings.picoseconds
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
      if ( !dragBounds.containsPoint( collisionCounter.positionProperty.value ) ) {
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

gasProperties.register( 'CollisionCounterNode', CollisionCounterNode );
export default CollisionCounterNode;