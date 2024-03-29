// Copyright 2019-2024, University of Colorado Boulder

/**
 * ResizeHandleDragListener is the drag listener for resizing the container by changing its width.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Node } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import IdealGasLawContainer from '../model/IdealGasLawContainer.js';
import RichDragListener from '../../../../scenery-phet/js/RichDragListener.js';

export default class ResizeHandleDragListener extends RichDragListener {

  public constructor( container: IdealGasLawContainer, modelViewTransform: ModelViewTransform2, parentNode: Node,
                      tandem: Tandem ) {

    // pointer's x offset from the left edge of the container, when a drag starts
    let startXOffset = 0;

    super( {

      start: ( event, listener ) => {

        container.userIsAdjustingWidthProperty.value = true;

        const viewWidth = modelViewTransform.modelToViewX( container.left );
        startXOffset = viewWidth - parentNode.globalToParentPoint( event.pointer.point ).x;
      },

      drag: ( event, listener ) => {

        const viewX = parentNode.globalToParentPoint( event.pointer.point ).x;
        const modelX = modelViewTransform.viewToModelX( viewX + startXOffset );

        const desiredWidth = container.widthRange.constrainValue( container.right - modelX );
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

      isDisposable: false,
      tandem: tandem
    } );
  }
}

gasProperties.register( 'ResizeHandleDragListener', ResizeHandleDragListener );