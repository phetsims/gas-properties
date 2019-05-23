// Copyright 2019, University of Colorado Boulder

/**
 * Base class for all ScreenViews in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BaseModel = require( 'GAS_PROPERTIES/common/model/BaseModel' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const Tandem = require( 'TANDEM/Tandem' );
  const TimeControlNode = require( 'SCENERY_PHET/TimeControlNode' );

  class BaseScreenView extends ScreenView {

    /**
     * @param {BaseModel} model
     * @param {Tandem} tandem
     * @param {Object} [options]
     */
    constructor( model, tandem, options ) {
      assert && assert( model instanceof BaseModel, `invalid model: ${model}` );
      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      options = _.extend( {
        hasSlowMotion: false
      }, options );

      assert && assert( !options.tandem, 'BaseScreenView sets tandem' );
      options.tandem = tandem;

      super( options );

      // The model bounds are equivalent to the visible bounds of ScreenView, as fills the browser window.
      this.visibleBoundsProperty.link( visibleBounds => {
        model.modelBoundsProperty.value = model.modelViewTransform.viewToModelBounds( visibleBounds );
      } );

      // @protected Time Controls - subclass is responsible for position
      this.timeControlNode = new TimeControlNode( model.isPlayingProperty, {

        // optional Normal/Slow radio buttons
        isSlowMotionProperty: options.hasSlowMotion ? model.isSlowMotionProperty : null,
        buttonsXSpacing: 25,
        labelOptions: {
          font: GasPropertiesConstants.CONTROL_FONT,
          fill: GasPropertiesColorProfile.textFillProperty
        },
        stepOptions: {

          // when the Step button is pressed
          listener: () => {
            const seconds = model.timeTransform.inverse( GasPropertiesConstants.MODEL_TIME_STEP );
            model.stepManual( seconds );
            this.stepManual( seconds );
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

    /**
     * Steps the model using real time units.
     * This should be called directly only by Sim.js, and is a no-op when the sim is paused.
     * @param {number} dt - time delta, in seconds
     * @public
     */
    step( dt ) {
      assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );
      if ( this.model.isPlayingProperty.value ) {
        this.stepManual( dt );
      }
    }

    /**
     * Steps the model using real time units.
     * Intended to be called when the Step button is pressed.
     * @param {number} dt - time delta, in seconds
     * @param dt
     * @public
     */
    stepManual( dt ) {
      assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );
    }
  }

  return gasProperties.register( 'BaseScreenView', BaseScreenView );
} );