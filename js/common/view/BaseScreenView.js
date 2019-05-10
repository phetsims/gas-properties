// Copyright 2019, University of Colorado Boulder

/**
 * Base class for all ScreenViews in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const ScreenView = require( 'JOIST/ScreenView' );

  class BaseScreenView extends ScreenView {

    /**
     * @param {BaseModel} model
     * @param {Object} [options]
     */
    constructor( model, options ) {
      
      super( options );

      // The model bounds are equivalent to the visible bounds of ScreenView, as fills the browser window.
      this.visibleBoundsProperty.link( visibleBounds => {
        model.modelBoundsProperty.value = model.modelViewTransform.viewToModelBounds( visibleBounds );
      } );

      // @private
      this.model = model;
    }

    /**
     * Resets the screen.
     * @private
     */
    reset() {
      this.interruptSubtreeInput(); // cancel interactions that are in progress
      this.model.reset();
    }
  }

  return gasProperties.register( 'BaseScreenView', BaseScreenView );
} );