// Copyright 2019-2024, University of Colorado Boulder

//TODO https://github.com/phetsims/gas-properties/issues/213 Duplication with ResizeHandleDragListener
/**
 * ResizeHandleKeyboardDragListener is the drag listener for resizing the container by changing its width.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import IdealGasLawContainer from '../model/IdealGasLawContainer.js';
import RichKeyboardDragListener from '../../../../scenery-phet/js/RichKeyboardDragListener.js';

export default class ResizeHandleKeyboardDragListener extends RichKeyboardDragListener {

  public constructor( container: IdealGasLawContainer, modelViewTransform: ModelViewTransform2, tandem: Tandem ) {

    super( {

      // RichKeyboardDragListenerOptions
      isDisposable: false,
      transform: modelViewTransform,

      start: event => {
        container.userIsAdjustingWidthProperty.value = true;
      },

      drag: ( event, listener ) => {

        // Moving to the left increases width, so flip the sign.
        const deltaWidth = -listener.vectorDelta.x;

        const desiredWidth = container.widthRange.constrainValue( container.widthProperty.value + deltaWidth );
        if ( container.leftWallDoesWork && desiredWidth < container.widthProperty.value ) {

          // When making the container smaller, limit the speed.  See #90.
          container.setDesiredWidth( desiredWidth );
        }
        else {

          // When making the container larger, there is no speed limit, see #90.
          container.resizeImmediately( desiredWidth );
        }
      },

      end: () => {

        // Stop the animation wherever the container width happens to be when the drag ends.
        container.setDesiredWidth( container.widthProperty.value );

        container.userIsAdjustingWidthProperty.value = false;
      },
      dragSpeed: 300,
      shiftDragSpeed: 75,
      tandem: tandem
    } );
  }
}

gasProperties.register( 'ResizeHandleKeyboardDragListener', ResizeHandleKeyboardDragListener );