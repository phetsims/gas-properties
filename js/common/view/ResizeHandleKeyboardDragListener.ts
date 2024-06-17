// Copyright 2019-2024, University of Colorado Boulder

/**
 * ResizeHandleKeyboardDragListener is the drag listener for resizing the container by changing its width.
 * It computes the desired width of the container, but delegates other responsibilities to ResizeHandleDragDelegate.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import gasProperties from '../../gasProperties.js';
import RichKeyboardDragListener, { RichKeyboardDragListenerOptions } from '../../../../scenery-phet/js/RichKeyboardDragListener.js';
import ResizeHandleDragDelegate from './ResizeHandleDragDelegate.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = EmptySelfOptions;

export type ResizeHandleKeyboardDragListenerOptions = SelfOptions &
  PickOptional<RichKeyboardDragListenerOptions, 'dragSpeed' | 'shiftDragSpeed'> &
  PickRequired<RichKeyboardDragListenerOptions, 'tandem'>;

export default class ResizeHandleKeyboardDragListener extends RichKeyboardDragListener {

  public constructor( dragDelegate: ResizeHandleDragDelegate,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: ResizeHandleKeyboardDragListenerOptions ) {

    super( optionize<ResizeHandleKeyboardDragListenerOptions, SelfOptions, RichKeyboardDragListenerOptions>()( {

      // RichKeyboardDragListenerOptions
      isDisposable: false,
      transform: modelViewTransform,

      // See https://github.com/phetsims/gas-properties/issues/197#issuecomment-2168845330 for drag speeds.
      dragSpeed: 100,
      shiftDragSpeed: 20,

      start: event => dragDelegate.start(),

      drag: ( event, listener ) => {

        // Moving to the left increases width, so flip the sign.
        const deltaWidth = -listener.modelDelta.x;
        const desiredWidth = dragDelegate.container.widthRange.constrainValue( dragDelegate.container.widthProperty.value + deltaWidth );
        dragDelegate.resizeContainer( desiredWidth );
      },

      end: () => dragDelegate.end()
    }, providedOptions ) );
  }
}

gasProperties.register( 'ResizeHandleKeyboardDragListener', ResizeHandleKeyboardDragListener );