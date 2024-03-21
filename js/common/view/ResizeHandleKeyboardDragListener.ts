// Copyright 2024, University of Colorado Boulder

/**
 * ResizeHandleKeyboardDragListener is the drag listener for resizing the container by changing its width.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import IdealGasLawContainer from '../model/IdealGasLawContainer.js';
import RichKeyboardDragListener from '../../../../sun/js/RichKeyboardDragListener.js';

export default class ResizeHandleKeyboardDragListener extends RichKeyboardDragListener {

  public constructor( container: IdealGasLawContainer, modelViewTransform: ModelViewTransform2, tandem: Tandem ) {

    super( {
      transform: modelViewTransform,

      start: event => {
        container.userIsAdjustingWidthProperty.value = true;
      },

      drag: vectorDelta => {

        // Moving to the left increases width, so flip the sign.
        const deltaWidth = -vectorDelta.x;

        const desiredWidth = container.widthRange.constrainValue( container.widthProperty.value + deltaWidth );
        if ( container.leftWallDoesWork && desiredWidth < container.widthProperty.value ) {

          // When making the container smaller, limit the speed.  See #90.
          container.desiredWidth = desiredWidth;
        }
        else {

          // When making the container larger, there is no speed limit, see #90.
          container.resizeImmediately( desiredWidth );
        }
      },

      end: () => {

        // Stop the animation wherever the container width happens to be when the drag ends.
        container.desiredWidth = container.widthProperty.value;

        container.userIsAdjustingWidthProperty.value = false;
      },

      dragSpeed: 300,
      shiftDragSpeed: 75,
      isDisposable: false,
      tandem: tandem
    } );
  }
}

gasProperties.register( 'ResizeHandleKeyboardDragListener', ResizeHandleKeyboardDragListener );