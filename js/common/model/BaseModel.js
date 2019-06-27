// Copyright 2018-2019, University of Colorado Boulder

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
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const TimeTransform = require( 'GAS_PROPERTIES/common/model/TimeTransform' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Property = require( 'AXON/Property' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Stopwatch = require( 'GAS_PROPERTIES/common/model/Stopwatch' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const MODEL_VIEW_SCALE = 0.040; // number of pixels per pm

  /**
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  class BaseModel {

    constructor( tandem, options ) {
      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      options = _.extend( {

        // Offset of the model's origin, in view coordinates. Determines where the container's bottom-right corner is.
        modelOriginOffset: new Vector2( 645, 475 ),

        // Stopwatch initial location (in view coordinates!), determined empirically.
        stopwatchLocation: new Vector2( 240, 15 )
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
      this.isPlayingProperty = new BooleanProperty( true );

      // @public is the sim running in slow motion?
      this.isSlowMotionProperty = new BooleanProperty( false );

      // @public (read-only) {TimeTransform} transform between real time and sim time, initialized below
      this.timeTransform = null;

      // Adjust the time transform
      this.isSlowMotionProperty.link( isSlowMotion => {
        this.timeTransform = isSlowMotion ? TimeTransform.SLOW : TimeTransform.NORMAL;
      } );

      // @public (read-only)
      this.stopwatch = new Stopwatch( {
        location: options.stopwatchLocation
      } );
    }

    /**
     * Resets the model.
     * @public
     */
    reset() {

      // Properties
      this.isPlayingProperty.reset();
      this.isSlowMotionProperty.reset();

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
        this.stepModel( dt );
      }
    }

    /**
     * Steps the model using real time units.
     * This is intended to be called by clients that need to step the sim, e.g. Step button listener.
     * Subclasses that need to add functionality should override stepModelTime, not this method.
     * @param {number} dt - time delta, in seconds
     * @public
     */
    stepModel( dt ) {
      assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );
      this.stepModelTime( this.timeTransform( dt ) );
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

  return gasProperties.register( 'BaseModel', BaseModel );
} );