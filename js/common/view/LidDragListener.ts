// Copyright 2019-2022, University of Colorado Boulder

/**
 * LidDragListener is the drag listener for the container's lid. It determines the size of the opening in the top of
 * the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { DragListener, Node } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import IdealGasLawContainer from '../model/IdealGasLawContainer.js';

export default class LidDragListener extends DragListener {

  public constructor( container: IdealGasLawContainer, modelViewTransform: ModelViewTransform2, parentNode: Node,
                      tandem: Tandem ) {

    // pointer's x offset from container.getOpeningLeft(), when a drag starts
    let startXOffset = 0;

    super( {

      start: ( event, listener ) => {

        startXOffset = modelViewTransform.modelToViewX( container.getOpeningLeft() ) -
                       parentNode.globalToParentPoint( event.pointer.point ).x;
      },

      drag: ( event, listener ) => {

        const viewX = parentNode.globalToParentPoint( event.pointer.point ).x;
        const modelX = modelViewTransform.viewToModelX( viewX + startXOffset );
        if ( modelX >= container.getOpeningRight() ) {

          // the lid is fully closed
          container.lidWidthProperty.value = container.getMaxLidWidth();
        }
        else {

          // the lid is open
          const openingWidth = container.getOpeningRight() - modelX;
          container.lidWidthProperty.value =
            Math.max( container.getMaxLidWidth() - openingWidth, container.getMinLidWidth() );
        }
      },

      // when the lid handle is released, log the opening
      end: () => {
        phet.log && phet.log( container.isOpenProperty.value ?
                              `Lid is open: ${container.getOpeningLeft()} to ${container.getOpeningRight()} pm` :
                              'Lid is closed' );
      },

      tandem: tandem
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

gasProperties.register( 'LidDragListener', LidDragListener );