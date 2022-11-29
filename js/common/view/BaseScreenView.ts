// Copyright 2019-2022, University of Colorado Boulder

/**
 * BaseScreenView is the base class for all ScreenViews in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesColors from '../GasPropertiesColors.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';
import BaseModel from '../model/BaseModel.js';

type SelfOptions = {
  hasSlowMotion?: boolean;
};

export type BaseScreenViewOptions = SelfOptions;

export default abstract class BaseScreenView extends ScreenView {

  protected readonly model: BaseModel;

  // subclass is responsible for position
  protected readonly timeControlNode: TimeControlNode;

  protected constructor( model: BaseModel, tandem: Tandem, providedOptions?: BaseScreenViewOptions ) {

    const options = optionize<BaseScreenViewOptions, SelfOptions, ScreenViewOptions>()( {

      // SelfOptions
      hasSlowMotion: false,

      // ScreenViewOptions
      tandem: tandem
    }, providedOptions );

    super( options );

    this.model = model;

    // The model bounds are equivalent to the visible bounds of ScreenView, as fills the browser window.
    this.visibleBoundsProperty.link( visibleBounds => {
      model.modelBoundsProperty.value = model.modelViewTransform.viewToModelBounds( visibleBounds );
    } );

    this.timeControlNode = new TimeControlNode( model.isPlayingProperty, {

      // optional Normal/Slow radio buttons
      timeSpeedProperty: options.hasSlowMotion ? model.timeSpeedProperty : null,
      buttonGroupXSpacing: 25,
      speedRadioButtonGroupOptions: {
        labelOptions: {
          font: GasPropertiesConstants.CONTROL_FONT,
          fill: GasPropertiesColors.textFillProperty,
          maxWidth: 80
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
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  protected reset(): void {
    this.interruptSubtreeInput(); // cancel interactions that are in progress
    this.model.reset();
  }

  /**
   * Steps the model using real time units.
   * This should be called directly only by Sim.js, and is a no-op when the sim is paused.
   * Subclasses that need to add functionality should override stepView, not this method.
   * @param dt - time delta, in seconds
   */
  public override step( dt: number ): void {
    assert && assert( dt >= 0, `invalid dt: ${dt}` );
    super.step( dt );
    if ( this.model.isPlayingProperty.value ) {
      this.stepView( dt );
    }
  }

  /**
   * Steps the model using real time units. To be implemented by subclasses.
   * @param dt - time delta, in seconds
   */
  public abstract stepView( dt: number ): void;
}

gasProperties.register( 'BaseScreenView', BaseScreenView );