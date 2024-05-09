// Copyright 2024, University of Colorado Boulder

/**
 * ResizeHandleDragDelegate handles drag processing that is common to ResizeHandleDragListener and ResizeHandleKeyboardDragListener.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import gasProperties from '../../gasProperties.js';
import IdealGasLawContainer from '../model/IdealGasLawContainer.js';

export default class ResizeHandleDragDelegate {

  public readonly container: IdealGasLawContainer;

  public constructor( container: IdealGasLawContainer ) {
    this.container = container;
  }

  /**
   * Starts the drag cycle.
   */
  public start(): void {
    this.container.userIsAdjustingWidthProperty.value = true;
  }

  /**
   * Resizes the container.
   */
  public resizeContainer( desiredWidth: number ): void {
    if ( this.container.leftWallDoesWork && desiredWidth < this.container.widthProperty.value ) {

      // When making the container smaller, limit the speed.
      // See https://github.com/phetsims/gas-properties/issues/90.
      this.container.setDesiredWidth( desiredWidth );
    }
    else {

      // When making the container larger, there is no speed limit.
      // See https://github.com/phetsims/gas-properties/issues/90.
      this.container.resizeImmediately( desiredWidth );
    }
  }

  /**
   * Ends the drag cycle.
   */
  public end(): void {

    // Stop the animation wherever the container width happens to be when the drag ends.
    this.container.setDesiredWidth( this.container.widthProperty.value );
    this.container.userIsAdjustingWidthProperty.value = false;
  }
}

gasProperties.register( 'ResizeHandleDragDelegate', ResizeHandleDragDelegate );