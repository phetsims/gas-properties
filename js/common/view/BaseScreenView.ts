// Copyright 2019-2024, University of Colorado Boulder

/**
 * BaseScreenView is the base class for all ScreenViews in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { Node } from '../../../../scenery/js/imports.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesColors from '../GasPropertiesColors.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';
import BaseModel from '../model/BaseModel.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';

type SelfOptions = {
  hasSlowMotion?: boolean;
};

export type BaseScreenViewOptions = SelfOptions & PickRequired<ScreenViewOptions, 'tandem'>;

export default abstract class BaseScreenView extends ScreenView {

  protected readonly model: BaseModel;

  // subclass is responsible for position and pdomOrder
  protected readonly timeControlNode: Node;

  // subclass is responsible for pdomOrder
  protected readonly resetAllButton: Node;

  protected constructor( model: BaseModel, providedOptions?: BaseScreenViewOptions ) {

    const options = optionize<BaseScreenViewOptions, SelfOptions, ScreenViewOptions>()( {

      // SelfOptions
      hasSlowMotion: false,

      // ScreenViewOptions
      isDisposable: false
    }, providedOptions );

    super( options );

    this.model = model;

    // The model bounds are equivalent to the visible bounds of the ScreenView, transformed to model coordinates.
    this.visibleBoundsProperty.link( visibleBounds => {
      if ( !isSettingPhetioStateProperty.value ) {
        model.modelBoundsProperty.value = model.modelViewTransform.viewToModelBounds( visibleBounds );
      }
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
            const seconds = model.getTimeTransform().inverse( GasPropertiesConstants.MODEL_TIME_STEP );
            model.stepRealTime( seconds );
            this.stepView( seconds );
          }
        }
      },
      tandem: options.tandem.createTandem( 'timeControlNode' ),
      phetioEnabledPropertyInstrumented: false // Controlled by the sim.
    } );
    this.addChild( this.timeControlNode );

    // Reset All button
    this.resetAllButton = new ResetAllButton( {
      listener: () => { this.reset(); },
      right: this.layoutBounds.maxX - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( this.resetAllButton );
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