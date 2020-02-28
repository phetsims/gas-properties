// Copyright 2019-2020, University of Colorado Boulder

/**
 * ContainerResizeDragListener is the drag listener for resizing the container by changing its width.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import SceneryEvent from '../../../../scenery/js/input/SceneryEvent.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import IdealGasLawContainer from '../model/IdealGasLawContainer.js';

class ContainerResizeDragListener extends DragListener {

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

    // pointer's x offset from the left edge of the container, when a drag starts
    let startXOffset = 0;

    super( {

      start: ( event, listener ) => {
        assert && assert( event instanceof SceneryEvent, `invalid event: ${event}` );

        container.userIsAdjustingWidthProperty.value = true;

        const viewWidth = modelViewTransform.modelToViewX( container.left );
        startXOffset = viewWidth - parentNode.globalToParentPoint( event.pointer.point ).x;
      },

      drag: ( event, listener ) => {
        assert && assert( event instanceof SceneryEvent, `invalid event: ${event}` );

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

      end: listener => {

        // Stop the animation wherever the container width happens to be when the drag ends.
        container.desiredWidth = container.widthProperty.value;

        container.userIsAdjustingWidthProperty.value = false;
      },

      tandem: tandem
    } );
  }
}

gasProperties.register( 'ContainerResizeDragListener', ContainerResizeDragListener );
export default ContainerResizeDragListener;