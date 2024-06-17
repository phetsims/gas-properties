// Copyright 2024, University of Colorado Boulder

/**
 * LidHandleKeyboardDragListener is the keyboard drag listener for the container's lid. It determines the size of the opening
 * in the top of the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import IdealGasLawContainer from '../model/IdealGasLawContainer.js';
import RichKeyboardDragListener from '../../../../scenery-phet/js/RichKeyboardDragListener.js';
import Utils from '../../../../dot/js/Utils.js';

export default class LidHandleKeyboardDragListener extends RichKeyboardDragListener {

  public constructor( container: IdealGasLawContainer, modelViewTransform: ModelViewTransform2, tandem: Tandem ) {

    super( {
      isDisposable: false,
      transform: modelViewTransform,
      drag: ( event, listener ) => {
        container.lidWidthProperty.value = Utils.clamp( container.lidWidthProperty.value + listener.modelDelta.x,
          container.getMinLidWidth(), container.getMaxLidWidth() );
      },

      // See https://github.com/phetsims/gas-properties/issues/197#issuecomment-2168845330 for drag speeds.
      dragSpeed: 100,
      shiftDragSpeed: 20,
      tandem: tandem
    } );
  }
}

gasProperties.register( 'LidHandleKeyboardDragListener', LidHandleKeyboardDragListener );