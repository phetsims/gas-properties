// Copyright 2018, University of Colorado Boulder

/**
 * Collision Counter, displays the number of collisions between particles and the container walls.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const averagingTimeString = require( 'string!GAS_PROPERTIES/averagingTime' );
  const wallCollisionsString = require( 'string!GAS_PROPERTIES/wallCollisions' );

  // constants
  const X_MARGIN = 15;
  const Y_MARGIN = 10;
  const X_SPACING = 10;
  const Y_SPACING = 5;

  class CollisionCounterNode extends Node {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      const wallCollisionsTextNode = new Text( wallCollisionsString, {
        font: new PhetFont( 16 )
      } );

      const valueDisplay = new Rectangle( 0, 0, 100, 20, {
        fill: 'white',
        stroke: 'black',
        cornerRadius: 3
      } );

      const startPauseButton = new RectangularPushButton( {
        baseColor: 'rgb( 232, 232, 232 )',
        content: new Text( '>', { font: new PhetFont( 16 ) } ), //TODO toggle button with icons
        listener: () => {
          //TODO
        }
      } );

      const averagingTimeTextNode = new Text( averagingTimeString, {
        font: new PhetFont( 14 ),
        left: X_MARGIN
      } );

      //TODO placeholder
      const comboBox = new Rectangle( 0, 0, 100, 20, {
        fill: 'white',
        stroke: 'black',
        cornerRadius: 3
      });

      const content = new VBox( {
        align: 'center',
        spacing: Y_SPACING,
        children: [
          wallCollisionsTextNode,
          new HBox( {
            spacing: X_SPACING,
            children: [ valueDisplay, startPauseButton ]
          } ),
          averagingTimeTextNode,
          comboBox
        ]
      } );

      const backgroundNode = new Rectangle( 0, 0, content.width + ( 2 * X_MARGIN ), content.height + ( 2 * Y_MARGIN ), {
        cornerRadius: 6,
        fill: GasPropertiesColorProfile.collisionCounterBackgroundColorProperty,
        stroke: 'black',
        center: content.center
      } );

      assert && assert( !options.children, 'CollisionCounterNode sets children' );
      options.children = [ backgroundNode, content ];

      super( options );
    }
  }

  return gasProperties.register( 'CollisionCounterNode', CollisionCounterNode );
} );