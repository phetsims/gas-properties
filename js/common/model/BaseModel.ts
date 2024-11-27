// Copyright 2018-2024, University of Colorado Boulder

/**
 * BaseModel is the base class for models in all screens. It provides functionality that is NOT related to the
 * Ideal Gas Law. Primarily responsibilities are:
 *
 * - model-view transform
 * - model bounds
 * - control of time (play, pause, step, speed)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TModel from '../../../../joist/js/TModel.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';
import TimeTransform from './TimeTransform.js';

const MODEL_VIEW_SCALE = 0.040; // number of pixels per pm

type SelfOptions = {

  // Offset of the model's origin, in view coordinates. Determines where the container's bottom-right corner is.
  // Determined empirically, and dependent on the ScreenView's layoutBounds.
  modelOriginOffset?: Vector2;

  // Stopwatch initial position, in view coordinates.
  stopwatchPosition?: Vector2;

  // Whether the time controls will have radio buttons for selecting speed.
  hasTimeSpeedFeature?: boolean;
};

export type BaseModelOptions = SelfOptions &
  PickOptional<PhetioObjectOptions, 'phetioState' | 'phetioType'> & // because subclass DiffusionModel has state
  PickRequired<PhetioObjectOptions, 'tandem'>;

export default class BaseModel implements TModel {

  // transform between model and view coordinate frames
  public readonly modelViewTransform: ModelViewTransform2;

  // Bounds of the entire space that the model knows about.
  // This corresponds to the browser window, and doesn't have a valid value until the view is created.
  public readonly modelBoundsProperty: Property<Bounds2>;

  // is the sim playing?
  public readonly isPlayingProperty: Property<boolean>;

  // the clock speed of the sim
  public readonly timeSpeedProperty: EnumerationProperty<TimeSpeed>;

  public readonly stopwatch: Stopwatch;

  protected constructor( providedOptions: BaseModelOptions ) {

    const options = optionize<BaseModelOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      modelOriginOffset: new Vector2( 645, 475 ),
      stopwatchPosition: new Vector2( 240, 15 ),
      hasTimeSpeedFeature: false,

      // PhetioObjectOptions
      isDisposable: false
    }, providedOptions );

    this.modelViewTransform = ModelViewTransform2.createOffsetXYScaleMapping(
      options.modelOriginOffset,
      MODEL_VIEW_SCALE,
      -MODEL_VIEW_SCALE // y is inverted
    );

    this.modelBoundsProperty = new Property( new Bounds2( 0, 0, 1, 1 ), {
      tandem: options.tandem.createTandem( 'modelBoundsProperty' ),
      phetioReadOnly: true,
      phetioValueType: Bounds2.Bounds2IO,
      phetioDocumentation: 'Visible bounds of the browser window, in model coordinates. ' +
                           'The origin is at the bottom-right corner of the container.'
    } );

    this.isPlayingProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'isPlayingProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Whether the simulation is playing (true) or paused (false).'
    } );

    this.timeSpeedProperty = new EnumerationProperty( TimeSpeed.NORMAL, {
      validValues: [ TimeSpeed.NORMAL, TimeSpeed.SLOW ],
      tandem: options.hasTimeSpeedFeature ? options.tandem.createTandem( 'timeSpeedProperty' ) : Tandem.OPT_OUT,
      phetioFeatured: true,
      phetioDocumentation: 'The speed that at which the simulation is running.'
    } );

    this.stopwatch = new Stopwatch( {
      position: options.stopwatchPosition,
      timePropertyOptions: {
        range: new Range( 0, GasPropertiesConstants.MAX_TIME ),
        units: 'ps'
      },
      tandem: options.tandem.createTandem( 'stopwatch' ),
      phetioFeatured: true
    } );
  }

  public reset(): void {

    // Properties
    this.isPlayingProperty.reset();
    this.timeSpeedProperty.reset();

    // model elements
    this.stopwatch.reset();
  }

  /**
   * Gets the transform between real time and sim time.
   */
  public getTimeTransform(): TimeTransform {
    return ( this.timeSpeedProperty.value === TimeSpeed.SLOW ) ? TimeTransform.SLOW : TimeTransform.NORMAL;
  }

  /**
   * Steps the model using real time units.
   * This should be called directly only by Sim.js, and is a no-op when the sim is paused.
   * Subclasses that need to add functionality should override stepModelTime, not this method.
   * @param dt - time delta, in seconds
   */
  public step( dt: number ): void {
    assert && assert( dt > 0, `invalid dt: ${dt}` );
    if ( this.isPlayingProperty.value ) {
      this.stepRealTime( dt );
    }
  }

  /**
   * Steps the model using real time units.
   * This is intended to be called by clients that need to step the sim, e.g. Step button listener.
   * Subclasses that need to add functionality should override stepModelTime, not this method.
   * @param dt - time delta, in seconds
   */
  public stepRealTime( dt: number ): void {
    assert && assert( dt > 0, `invalid dt: ${dt}` );
    this.stepModelTime( this.getTimeTransform().evaluate( dt ) );
  }

  /**
   * Steps the model using model time units.
   * Subclasses that need to add additional step functionality should override this method.
   * @param dt - time delta, in ps
   */
  protected stepModelTime( dt: number ): void {
    assert && assert( dt > 0, `invalid dt: ${dt}` );
    this.stopwatch.step( dt );
  }
}

gasProperties.register( 'BaseModel', BaseModel );