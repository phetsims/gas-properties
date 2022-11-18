// Copyright 2019-2021, University of Colorado Boulder

/**
 * BaseScreenView is the base class for all ScreenViews in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesColors from '../GasPropertiesColors.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';
import BaseModel from '../model/BaseModel.js';

export default class BaseScreenView extends ScreenView {

  /**
   * @param {BaseModel} model
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( model, tandem, options ) {
    assert && assert( model instanceof BaseModel, `invalid model: ${model}` );
    assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

    options = merge( {
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
      timeSpeedProperty: options.hasSlowMotion ? model.timeSpeedProperty : null,
      buttonGroupXSpacing: 25,
      speedRadioButtonGroupOptions: {
        labelOptions: {
          font: GasPropertiesConstants.CONTROL_FONT,
          fill: GasPropertiesColors.textFillProperty
        }
      },
      playPauseStepButtonOptions: {
        stepForwardButtonOptions: {

          // when the Step button is pressed
          listener: () => {
            const seconds = model.timeTransform.inverse( GasPropertiesConstants.MODEL_TIME_STEP );
            model.stepRealTime( seconds );
            this.stepView( seconds );
          }
        }
      },
      tandem: tandem.createTandem( 'timeControlNode' )
    } );
    this.addChild( this.timeControlNode );

    // Reset All button
    const resetAllButton = new ResetAllButton( {
      listener: () => { this.reset(); },
      right: this.layoutBounds.maxX - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );

    // @protected
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
   * Subclasses that need to add functionality should override stepView, not this method.
   * @param {number} dt - time delta, in seconds
   * @public
   */
  step( dt ) {
    assert && assert( typeof dt === 'number' && dt >= 0, `invalid dt: ${dt}` );
    if ( this.model.isPlayingProperty.value ) {
      this.stepView( dt );
    }
  }

  /**
   * Steps the model using real time units. Intended to be overridden by subclasses.
   * @param {number} dt - time delta, in seconds
   * @public
   */
  stepView( dt ) {
    assert && assert( typeof dt === 'number' && dt >= 0, `invalid dt: ${dt}` );
  }
}

gasProperties.register( 'BaseScreenView', BaseScreenView );