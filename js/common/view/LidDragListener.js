// Copyright 2019-2022, University of Colorado Boulder

/**
 * LidDragListener is the drag listener for the container's lid. It determines the size of the opening in the top of
 * the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { DragListener, Node, SceneryEvent } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import IdealGasLawContainer from '../model/IdealGasLawContainer.js';

export default class LidDragListener extends DragListener {

  /**
   * @param {IdealGasLawContainer} container
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Node} parentNode
   * @param {Tandem} tandem
   */
  constructor( container, modelViewTransform, parentNode, tandem ) {
    assert && assert( container instanceof IdealGasLawContainer, `invalid container: ${container}` );
    assert && assert( modelViewTransform instanceof ModelViewTransform2,
      `invalid modelViewTransform: ${modelViewTransform}` );
    assert && assert( parentNode instanceof Node, `invalid parentNode: ${parentNode}` );
    assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

    // pointer's x offset from container.getOpeningLeft(), when a drag starts
    let startXOffset = 0;

    super( {

      start: ( event, listener ) => {
        assert && assert( event instanceof SceneryEvent, `invalid event: ${event}` );

        startXOffset = modelViewTransform.modelToViewX( container.getOpeningLeft() ) -
                       parentNode.globalToParentPoint( event.pointer.point ).x;
      },

      drag: ( event, listener ) => {
        assert && assert( event instanceof SceneryEvent, `invalid event: ${event}` );

        const viewX = parentNode.globalToParentPoint( event.pointer.point ).x;
        const modelX = modelViewTransform.viewToModelX( viewX + startXOffset );
        if ( modelX >= container.openingRight ) {

          // the lid is fully closed
          container.lidWidthProperty.value = container.getMaxLidWidth();
        }
        else {

          // the lid is open
          const openingWidth = container.openingRight - modelX;
          container.lidWidthProperty.value =
            Math.max( container.getMaxLidWidth() - openingWidth, container.getMinLidWidth() );
        }
      },

      // when the lid handle is released, log the opening
      end: () => {
        phet.log && phet.log( container.isOpenProperty.value ?
                              `Lid is open: ${container.getOpeningLeft()} to ${container.openingRight} pm` :
                              'Lid is closed' );
      },

      tandem: tandem
    } );
  }
}

gasProperties.register( 'LidDragListener', LidDragListener );