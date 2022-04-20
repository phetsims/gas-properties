// Copyright 2018-2022, University of Colorado Boulder

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
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Range from '../../../../dot/js/Range.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';
import TimeTransform from './TimeTransform.js';

// constants
const MODEL_VIEW_SCALE = 0.040; // number of pixels per pm

/**
 * @param {Tandem} tandem
 * @param {Object} [options]
 */
class BaseModel {

  /**
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( tandem, options ) {
    assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

    options = merge( {

      // Offset of the model's origin, in view coordinates. Determines where the container's bottom-right corner is.
      // Determined empirically, and dependent on the ScreenView's layoutBounds.
      modelOriginOffset: new Vector2( 645, 475 ),

      // Stopwatch initial position (in view coordinates!), determined empirically.
      stopwatchPosition: new Vector2( 240, 15 )
    }, options );

    // @public (read-only) {ModelViewTransform2} transform between model and view coordinate frames
    this.modelViewTransform = ModelViewTransform2.createOffsetXYScaleMapping(
      options.modelOriginOffset,
      MODEL_VIEW_SCALE,
      -MODEL_VIEW_SCALE // y is inverted
    );

    // @public (read-only) bounds of the entire space that the model knows about.
    // This corresponds to the browser window, and doesn't have a valid value until the view is created.
    this.modelBoundsProperty = new Property( new Bounds2( 0, 0, 1, 1 ), {
      valueType: Bounds2
    } );

    // @public is the sim playing?
    this.isPlayingProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'isPlayingProperty' )
    } );

    // @public the clock speed of the sim
    this.timeSpeedProperty = new EnumerationProperty( TimeSpeed.NORMAL, {
      tandem: tandem.createTandem( 'timeSpeedProperty' )
    } );

    // @public (read-only) {TimeTransform} transform between real time and sim time, initialized below
    this.timeTransform = null;

    // Adjust the time transform
    this.timeSpeedProperty.link( speed => {
      this.timeTransform = speed === TimeSpeed.SLOW ? TimeTransform.SLOW : TimeTransform.NORMAL;
    } );

    // @public (read-only)
    this.stopwatch = new Stopwatch( {
      position: options.stopwatchPosition,
      timePropertyOptions: {
        range: new Range( 0, GasPropertiesConstants.MAX_TIME ),
        units: 'ps'
      },
      tandem: tandem.createTandem( 'stopwatch' )
    } );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {

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
   * @param {number} dt - time delta, in seconds
   * @public
   */
  step( dt ) {
    assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );
    if ( this.isPlayingProperty.value ) {
      this.stepRealTime( dt );
    }
  }

  /**
   * Steps the model using real time units.
   * This is intended to be called by clients that need to step the sim, e.g. Step button listener.
   * Subclasses that need to add functionality should override stepModelTime, not this method.
   * @param {number} dt - time delta, in seconds
   * @public
   */
  stepRealTime( dt ) {
    assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );
    this.stepModelTime( this.timeTransform.evaluate( dt ) );
  }

  /**
   * Steps the model using model time units.
   * Subclasses that need to add additional step functionality should override this method.
   * @param {number} dt - time delta, in ps
   * @protected
   */
  stepModelTime( dt ) {
    assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );
    this.stopwatch.step( dt );
  }
}

gasProperties.register( 'BaseModel', BaseModel );
export default BaseModel;