// Copyright 2019, University of Colorado Boulder

/**
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const Util = require( 'DOT/Util' );

  class PointerCoordinatesNode extends RichText {

    /**
     * @param {ModelViewTransform2} modelViewTransform
     */
    constructor( modelViewTransform ) {

      super( '', {
        font: new PhetFont( 14 ),
        align: 'center',
        fill: GasPropertiesColorProfile.pointerCoordinatesColorProperty,
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
          const xView = Util.toFixed( viewPoint.x, 0 );
          const yView = Util.toFixed( viewPoint.y, 0 );

          // (x,y) in model coordinates
          const modelPoint = modelViewTransform.viewToModelPosition( viewPoint );
          const xModel = Util.toFixed( modelPoint.x, 1 );
          const yModel = Util.toFixed( modelPoint.y, 1 );

          // Update coordinates display.
          this.text = `(${xView},${yView})<br>(${xModel},${yModel}) nm`;

          // Center the coordinates above the cursor.
          this.centerX = viewPoint.x;
          this.bottom = viewPoint.y - 3;
        }
      } );
    }
  }

  return gasProperties.register( 'PointerCoordinatesNode', PointerCoordinatesNode );
} );