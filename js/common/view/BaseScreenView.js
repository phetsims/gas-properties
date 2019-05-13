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
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const TimeControlNode = require( 'SCENERY_PHET/TimeControlNode' );

  class BaseScreenView extends ScreenView {

    /**
     * @param {BaseModel} model
     * @param {Object} [options]
     */
    constructor( model, options ) {

      options = _.extend( {
        hasSlowMotion: false
      }, options );
      
      super( options );

      // The model bounds are equivalent to the visible bounds of ScreenView, as fills the browser window.
      this.visibleBoundsProperty.link( visibleBounds => {
        model.modelBoundsProperty.value = model.modelViewTransform.viewToModelBounds( visibleBounds );
      } );

      // @protected Time Controls - subclass is responsible for position
      this.timeControlNode = new TimeControlNode( model.isPlayingProperty, {
        isSlowMotionProperty: options.hasSlowMotion ? model.isSlowMotionProperty : null,
        buttonsXSpacing: 25,
        labelOptions: {
          font: GasPropertiesConstants.CONTROL_FONT,
          fill: GasPropertiesColorProfile.textFillProperty
        },
        stepOptions: {
          listener: () => {
            model.isPlayingProperty.value = true;
            const seconds = model.timeTransform.inverse( GasPropertiesConstants.MODEL_TIME_STEP );
            model.step( seconds );
            this.step( seconds );
            model.isPlayingProperty.value = false;
          }
        }
      } );
      this.addChild( this.timeControlNode );

      // Reset All button
      const resetAllButton = new ResetAllButton( {
        listener: () => { this.reset(); },
        right: this.layoutBounds.maxX - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
        bottom: this.layoutBounds.maxY - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
      } );
      this.addChild( resetAllButton );

      // @private
      this.model = model;
    }

    /**
     * Resets the screen.
     * @protected
     */
    reset() {
      this.interruptSubtreeInput(); // cancel interactions that are in progress
      this.model.reset();
    }
  }

  return gasProperties.register( 'BaseScreenView', BaseScreenView );
} );