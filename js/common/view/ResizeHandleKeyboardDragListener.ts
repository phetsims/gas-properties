// Copyright 2019-2024, University of Colorado Boulder

/**
 * ResizeHandleKeyboardDragListener is the drag listener for resizing the container by changing its width.
 * It computes the desired width of the container, but delegates other responsibilities to ResizeHandleDragDelegate.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import RichKeyboardDragListener from '../../../../scenery-phet/js/RichKeyboardDragListener.js';
import ResizeHandleDragDelegate from './ResizeHandleDragDelegate.js';

export default class ResizeHandleKeyboardDragListener extends RichKeyboardDragListener {

  public constructor( dragDelegate: ResizeHandleDragDelegate, modelViewTransform: ModelViewTransform2, tandem: Tandem ) {

    super( {

      // RichKeyboardDragListenerOptions
      isDisposable: false,
      transform: modelViewTransform,
      dragSpeed: 300,
      shiftDragSpeed: 75,
      tandem: tandem,

      start: event => dragDelegate.start(),

      drag: ( event, listener ) => {

        // Moving to the left increases width, so flip the sign.
        const deltaWidth = -listener.modelDelta.x;
        const desiredWidth = dragDelegate.container.widthRange.constrainValue( dragDelegate.container.widthProperty.value + deltaWidth );
        dragDelegate.resizeContainer( desiredWidth );
      },

      end: () => dragDelegate.end()
    } );
  }
}

gasProperties.register( 'ResizeHandleKeyboardDragListener', ResizeHandleKeyboardDragListener );