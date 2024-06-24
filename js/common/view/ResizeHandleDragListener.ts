// Copyright 2019-2024, University of Colorado Boulder

/**
 * ResizeHandleDragListener is the drag listener for resizing the container by changing its width.
 * It computes the desired width of the container, but delegates other responsibilities to ResizeHandleDragDelegate.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Node } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import SoundDragListener from '../../../../scenery-phet/js/SoundDragListener.js';
import ResizeHandleDragDelegate from './ResizeHandleDragDelegate.js';

export default class ResizeHandleDragListener extends SoundDragListener {

  public constructor( dragDelegate: ResizeHandleDragDelegate, modelViewTransform: ModelViewTransform2, parentNode: Node, tandem: Tandem ) {

    // Pointer's x offset from the left edge of the container, when a drag starts.
    let startXOffset = 0;

    super( {

      // SoundDragListenerOptions
      isDisposable: false,
      tandem: tandem,

      start: ( event, listener ) => {
        dragDelegate.start();
        const viewWidth = modelViewTransform.modelToViewX( dragDelegate.container.left );
        startXOffset = viewWidth - parentNode.globalToParentPoint( event.pointer.point ).x;
      },

      drag: ( event, listener ) => {
        const viewX = parentNode.globalToParentPoint( event.pointer.point ).x;
        const modelX = modelViewTransform.viewToModelX( viewX + startXOffset );
        const desiredWidth = dragDelegate.container.widthRange.constrainValue( dragDelegate.container.right - modelX );
        dragDelegate.resizeContainer( desiredWidth );
      },

      end: () => dragDelegate.end()
    } );
  }
}

gasProperties.register( 'ResizeHandleDragListener', ResizeHandleDragListener );