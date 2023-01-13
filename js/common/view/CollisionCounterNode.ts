// Copyright 2018-2023, University of Colorado Boulder

/**
 * CollisionCounterNode displays the number of collisions between particles and the container walls, during
 * some sample period.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import DragBoundsProperty from '../../../../scenery-phet/js/DragBoundsProperty.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ShadedRectangle from '../../../../scenery-phet/js/ShadedRectangle.js';
import { Circle, DragListener, HBox, Node, NodeOptions, Rectangle, Text, VBox, VStrut } from '../../../../scenery/js/imports.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import GasPropertiesColors from '../GasPropertiesColors.js';
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

type SelfOptions = EmptySelfOptions;

type CollisionCounterNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class CollisionCounterNode extends Node {

  public constructor( collisionCounter: CollisionCounter, listboxParent: Node,
                      visibleBoundsProperty: TReadOnlyProperty<Bounds2>, providedOptions: CollisionCounterNodeOptions ) {

    const options = optionize<CollisionCounterNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      cursor: 'pointer',
      visibleProperty: collisionCounter.visibleProperty
    }, providedOptions );

    const wallCollisionsText = new Text( GasPropertiesStrings.wallCollisionsStringProperty, {
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

    const samplePeriodText = new Text( GasPropertiesStrings.samplePeriodStringProperty, {
      pickable: false,
      font: LABEL_FONT,
      left: X_MARGIN,
      maxWidth: 110 // determined empirically
    } );

    // Combo box items
    const comboBoxItems = collisionCounter.samplePeriods.map( samplePeriod => {

      return {
        value: samplePeriod,
        createNode: () => {

          // e.g. '10 ps'
          const samplePeriodStringProperty = new PatternStringProperty( GasPropertiesStrings.valueUnitsStringProperty, {
            value: samplePeriod,
            units: GasPropertiesStrings.picosecondsStringProperty
          } );
          return new Text( samplePeriodStringProperty, {
            font: CONTROL_FONT,
            maxWidth: 100 // determined empirically
          } );
        },
        tandemName: `samplePeriod${samplePeriod}${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
      };
    } );

    // Combo box
    const samplePeriodComboBox = new ComboBox( collisionCounter.samplePeriodProperty, comboBoxItems, listboxParent, {
      listPosition: 'below',
      align: 'right',
      xMargin: 6,
      yMargin: 3,
      cornerRadius: 5,
      tandem: options.tandem.createTandem( 'samplePeriodComboBox' )
    } );

    // stuff that appears on the counter
    const content = new VBox( {
      align: 'center',
      spacing: Y_SPACING,
      children: [
        wallCollisionsText,
        new HBox( {
          spacing: X_SPACING,
          children: [ valueDisplay, playResetButton ]
        } ),
        new VStrut( 2 ),
        samplePeriodText,
        samplePeriodComboBox
      ]
    } );

    // Background, sized to fit the content
    const rectangleNode = new Rectangle( 0, 0, content.width + ( 2 * X_MARGIN ), content.height + ( 2 * Y_MARGIN ), {
      cornerRadius: 6,
      fill: GasPropertiesColors.collisionCounterBackgroundColorProperty,
      stroke: 'black'
    } );

    // Pseudo-3D bezel around the outside edge of the rectangle
    const bezelBounds = new Bounds2( 0, 0,
      rectangleNode.width + ( 2 * BEZEL_WIDTH ), rectangleNode.height + ( 2 * BEZEL_WIDTH ) );
    const bezelNode = new ShadedRectangle( bezelBounds, {
      baseColor: GasPropertiesColors.collisionCounterBezelColorProperty
    } );

    rectangleNode.center = bezelNode.center;

    // The background include the bezel and rectangle.
    const backgroundNode = new Node( {
      children: [ bezelNode, rectangleNode ]
    } );

    content.center = backgroundNode.center;

    options.children = [ backgroundNode, content ];

    super( options );

    // Put a red dot at the origin, for debugging layout.
    if ( GasPropertiesQueryParameters.origin ) {
      this.addChild( new Circle( 3, { fill: 'red' } ) );
    }

    // visibility
    this.visibleProperty.link( visible => {
      this.interruptSubtreeInput(); // interrupt user interactions
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

    // Interrupt user interactions when the visible bounds change, such as a device orientation change or window resize.
    visibleBoundsProperty.link( () => this.interruptSubtreeInput() );

    // If the collision counter is outside the drag bounds, move it inside.
    dragBoundsProperty.link( dragBounds => {
      if ( !dragBounds.containsPoint( collisionCounter.positionProperty.value ) ) {
        collisionCounter.positionProperty.value =
          dragBounds.closestPointTo( collisionCounter.positionProperty.value );
      }
    } );

    // On any form of press, move everything related to this Node to the front.
    const onPress = () => {
      this.moveToFront();
      listboxParent.moveToFront();
    };

    // Dragging, added to background so that other UI components get input events on touch devices.
    // If added to 'this', touchSnag will lock out listeners for other UI components.
    backgroundNode.addInputListener( new DragListener( {
      targetNode: this,
      positionProperty: collisionCounter.positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      start: onPress,
      tandem: options.tandem.createTandem( 'dragListener' )
    } ) );

    // Move to front on pointer down, anywhere on this Node, including interactive subcomponents.
    this.addInputListener( {
      down: onPress
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

gasProperties.register( 'CollisionCounterNode', CollisionCounterNode );