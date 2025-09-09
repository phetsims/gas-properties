// Copyright 2018-2025, University of Colorado Boulder

/**
 * CollisionCounterNode displays the number of collisions between particles and the container walls, during
 * some sample period.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import { EmptySelfOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import AccessibleDraggableOptions from '../../../../scenery-phet/js/accessibility/grab-drag/AccessibleDraggableOptions.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ShadedRectangle from '../../../../scenery-phet/js/ShadedRectangle.js';
import SoundDragListener from '../../../../scenery-phet/js/SoundDragListener.js';
import SoundKeyboardDragListener from '../../../../scenery-phet/js/SoundKeyboardDragListener.js';
import InteractiveHighlighting, { InteractiveHighlightingOptions } from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VStrut from '../../../../scenery/js/nodes/VStrut.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import GasPropertiesColors from '../GasPropertiesColors.js';
import GasPropertiesQueryParameters from '../GasPropertiesQueryParameters.js';
import CollisionCounter from '../model/CollisionCounter.js';
import PlayResetButton from './PlayResetButton.js';
import SamplePeriodComboBox from './SamplePeriodComboBox.js';

const X_MARGIN = 15;
const Y_MARGIN = 10;
const X_SPACING = 10;
const Y_SPACING = 5;
const BEZEL_WIDTH = 6;
const NUMBER_DISPLAY_RANGE = new Range( 0, 1E6 );
const LABEL_FONT = new PhetFont( 16 );

type SelfOptions = EmptySelfOptions;

type ParentOptions = InteractiveHighlightingOptions & NodeOptions;

type CollisionCounterNodeOptions = SelfOptions & PickRequired<ParentOptions, 'tandem'>;

export default class CollisionCounterNode extends InteractiveHighlighting( Node ) {

  public constructor( collisionCounter: CollisionCounter, listboxParent: Node,
                      visibleBoundsProperty: TReadOnlyProperty<Bounds2>, providedOptions: CollisionCounterNodeOptions ) {

    const options = optionize4<CollisionCounterNodeOptions, SelfOptions, ParentOptions>()( {}, AccessibleDraggableOptions, {

      // NodeOptions
      isDisposable: false,
      cursor: 'pointer',
      visibleProperty: collisionCounter.visibleProperty,
      groupFocusHighlight: true,
      phetioFeatured: true
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
        font: new PhetFont( 14 )
      },
      xMargin: 8,
      yMargin: 4,
      cornerRadius: 3,
      pickable: false // so we can drag
    } );

    const playResetButton = new PlayResetButton( collisionCounter.isRunningProperty, options.tandem.createTandem( 'playResetButton' ) );

    const samplePeriodText = new Text( GasPropertiesStrings.samplePeriodStringProperty, {
      pickable: false,
      font: LABEL_FONT,
      left: X_MARGIN,
      maxWidth: 110 // determined empirically
    } );

    const samplePeriodComboBox = new SamplePeriodComboBox( collisionCounter.samplePeriodProperty,
      CollisionCounter.SAMPLE_PERIODS, listboxParent, options.tandem.createTandem( 'samplePeriodComboBox' ) );

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

    content.boundsProperty.link( () => {
      content.center = backgroundNode.center;
    } );

    options.children = [ backgroundNode, content ];

    super( options );

    this.addLinkedElement( collisionCounter );

    // Put a red dot at the origin, for debugging layout.
    if ( GasPropertiesQueryParameters.origin ) {
      this.addChild( new Circle( 3, { fill: 'red' } ) );
    }

    // visibility
    this.visibleProperty.link( visible => {
      if ( visible ) {
        this.moveToFront();
        listboxParent.moveToFront();
      }
    } );

    // Move to the collision counter's position
    collisionCounter.positionProperty.link( position => {
      this.translation = position;
    } );

    // Drag bounds, adjusted to keep this entire Node inside visible bounds. This assumes that CollisionCounterNode
    // is in the same coordinate frame as visibleBoundsProperty.
    const dragBoundsProperty = new DerivedProperty( [ this.boundsProperty, visibleBoundsProperty ],
      ( bounds, visibleBounds ) =>
        visibleBounds.withMaxX( visibleBounds.maxX - bounds.width ).withMaxY( visibleBounds.maxY - bounds.height ),
      {
        valueComparisonStrategy: 'equalsFunction'
      } );

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
    backgroundNode.addInputListener( new SoundDragListener( {
      targetNode: this,
      positionProperty: collisionCounter.positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      start: onPress,
      tandem: options.tandem.createTandem( 'dragListener' )
    } ) );
    this.addInputListener( new SoundKeyboardDragListener( {
      positionProperty: collisionCounter.positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      start: onPress,
      dragSpeed: 300,
      shiftDragSpeed: 75,
      tandem: options.tandem.createTandem( 'keyboardDragListener' )
    } ) );

    // Move to front on pointer down, anywhere on this Node, including interactive subcomponents.
    this.addInputListener( {
      down: onPress
    } );
  }
}

gasProperties.register( 'CollisionCounterNode', CollisionCounterNode );