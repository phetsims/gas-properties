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

import Disposable from '../../../../axon/js/Disposable.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TModel from '../../../../joist/js/TModel.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';
import TimeTransform from './TimeTransform.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';

// constants
const MODEL_VIEW_SCALE = 0.040; // number of pixels per pm

type SelfOptions = {

  // Offset of the model's origin, in view coordinates. Determines where the container's bottom-right corner is.
  // Determined empirically, and dependent on the ScreenView's layoutBounds.
  modelOriginOffset?: Vector2;

  // Stopwatch initial position (in view coordinates!), determined empirically.
  stopwatchPosition?: Vector2;
};

export type BaseModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class BaseModel implements TModel {

  // transform between model and view coordinate frames
  public readonly modelViewTransform: ModelViewTransform2;

  // Bounds of the entire space that the model knows about.
  // This corresponds to the browser window, and doesn't have a valid value until the view is created.
  //TODO https://github.com/phetsims/gas-properties/issues/77 PhET-iO instrumentation?
  public readonly modelBoundsProperty: Property<Bounds2>;

  // is the sim playing?
  public readonly isPlayingProperty: Property<boolean>;

  // the clock speed of the sim
  public readonly timeSpeedProperty: EnumerationProperty<TimeSpeed>;

  // transform between real time and sim time, initialized below
  public timeTransform: TimeTransform;

  public readonly stopwatch: Stopwatch;

  protected constructor( providedOptions: BaseModelOptions ) {

    const options = optionize<BaseModelOptions, SelfOptions>()( {

      // Offset of the model's origin, in view coordinates. Determines where the container's bottom-right corner is.
      // Determined empirically, and dependent on the ScreenView's layoutBounds.
      modelOriginOffset: new Vector2( 645, 475 ),

      // Stopwatch initial position (in view coordinates!), determined empirically.
      stopwatchPosition: new Vector2( 240, 15 )
    }, providedOptions );

    this.modelViewTransform = ModelViewTransform2.createOffsetXYScaleMapping(
      options.modelOriginOffset,
      MODEL_VIEW_SCALE,
      -MODEL_VIEW_SCALE // y is inverted
    );

    this.modelBoundsProperty = new Property( new Bounds2( 0, 0, 1, 1 ), {
      tandem: options.tandem.createTandem( 'modelBoundsProperty' ),
      phetioValueType: Bounds2.Bounds2IO,
      phetioDocumentation: 'Visible bounds of the browser window in model coordinates.'
    } );

    this.isPlayingProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'isPlayingProperty' )
    } );

    this.timeSpeedProperty = new EnumerationProperty( TimeSpeed.NORMAL, {
      tandem: options.tandem.createTandem( 'timeSpeedProperty' )
    } );

    this.timeTransform = TimeTransform.NORMAL;

    // Adjust the time transform
    this.timeSpeedProperty.link( speed => {
      this.timeTransform = ( speed === TimeSpeed.SLOW ) ? TimeTransform.SLOW : TimeTransform.NORMAL;
    } );

    this.stopwatch = new Stopwatch( {
      position: options.stopwatchPosition,
      timePropertyOptions: {
        range: new Range( 0, GasPropertiesConstants.MAX_TIME ),
        units: 'ps'
      },
      tandem: options.tandem.createTandem( 'stopwatch' )
    } );
  }

  public dispose(): void {
    Disposable.assertNotDisposable();
  }

  public reset(): void {

    // Properties
    this.isPlayingProperty.reset();
    this.timeSpeedProperty.reset();

    // model elements
    this.stopwatch.reset();
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
    this.stepModelTime( this.timeTransform.evaluate( dt ) );
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