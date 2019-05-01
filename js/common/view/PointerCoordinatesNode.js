// Copyright 2019, University of Colorado Boulder

//TODO migrate to scenery-phet
/**
 * Shows the model and view coordinates that correspond to the cursor location.
 * Used exclusively for debugging, see GasPropertiesQueryParameters.pointerCoordinates.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const Util = require( 'DOT/Util' );

  class PointerCoordinatesNode extends Node {

    /**
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options] - not propagated to super
     */
    constructor( modelViewTransform, options ) {

      options = _.extend( {
        textColor: 'black',
        backgroundColor: 'rgba( 255, 255, 255, 0.5 )',
        font: new PhetFont( 14 ),
        modelDecimalPlaces: 1,
        viewDecimalPlaces: 0,
        align: 'center',
        pickable: false
      }, options );

      const textNode = new RichText( '', {
        font: options.font,
        fill: options.textColor,
        align: options.align
      } );

      const backgroundNode = new Rectangle( 0, 0, 1, 1, {
        fill: options.backgroundColor
      } );

      super( {
        children: [ backgroundNode, textNode ],
        pickable: false
      } );

      // Update the coordinates to match the pointer location.
      // Add the input listener to the Display, so that things behind the grid will received events.
      // Scenery does not support having one event sent through two different trails.
      // Note that this will continue to receive events when the current screen is inactive.
      phet.joist.display.addInputListener( {
        move: event => {

          // (x,y) in view coordinates
          const viewPoint = this.globalToParentPoint( event.pointer.point );
          const xView = Util.toFixed( viewPoint.x, options.viewDecimalPlaces );
          const yView = Util.toFixed( viewPoint.y, options.viewDecimalPlaces );

          // (x,y) in model coordinates
          const modelPoint = modelViewTransform.viewToModelPosition( viewPoint );
          const xModel = Util.toFixed( modelPoint.x, options.modelDecimalPlaces );
          const yModel = Util.toFixed( modelPoint.y, options.modelDecimalPlaces );

          // Update coordinates display.
          textNode.text = `(${xView},${yView})<br>(${xModel},${yModel}) nm`;

          // Resize background
          backgroundNode.setRect( 0, 0, textNode.width + 4, textNode.height + 4 );
          textNode.center = backgroundNode.center;

          // Center above the cursor.
          this.centerX = viewPoint.x;
          this.bottom = viewPoint.y - 3;
        }
      } );
    }
  }

  return gasProperties.register( 'PointerCoordinatesNode', PointerCoordinatesNode );
} );