// Copyright 2018-2019, University of Colorado Boulder

/**
 * Base class for models in all screens.
 * Primarily responsible for Properties and model elements related to bounds and time.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const NormalTimeTransform = require( 'GAS_PROPERTIES/common/model/NormalTimeTransform' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Property = require( 'AXON/Property' );
  const Stopwatch = require( 'GAS_PROPERTIES/common/model/Stopwatch' );
  const Vector2 = require( 'DOT/Vector2' );

  class GasPropertiesModel {

    constructor() {

      // @public (read-only) bounds of the entire space that the model knows about.
      // This corresponds to the browser window, and doesn't have a valid value until the view is created.
      this.modelBoundsProperty = new Property( new Bounds2( 0, 0, 1, 1 ) );
      phet.log && this.modelBoundsProperty.link( modelBounds => {
        phet.log( `modelBounds: ${modelBounds.toString()} nm` );
      } );

      // @public (read-only) transform between model and view coordinate frames
      const modelViewScale = 40; // number of pixels per nm
      this.modelViewTransform = ModelViewTransform2.createOffsetXYScaleMapping(
        new Vector2( 645, 475 ), // offset of the model's origin, in view coordinates
        modelViewScale,
        -modelViewScale // y is inverted
      );

      // @public (read-only) transform between real time and sim time, can be set by subclasses
      this._timeTransform = new NormalTimeTransform();

      // @public is the sim playing?
      this.isPlayingProperty = new BooleanProperty( true );

      // @public are the time controls (play, pause, step) enabled?
      this.isTimeControlsEnabledProperty = new BooleanProperty( true );

      // @public (read-only)
      this.stopwatch = new Stopwatch( {
        location: new Vector2( 250, 15 ) // view coordinates! determined empirically
      } );
    }

    /**
     * Sets the transform between real and sim time.
     * @param {LinearFunction} value
     * @protected
     */
    set timeTransform( value ) { this._timeTransform = value; }

    /**
     * Gets the transform between real and sim time.
     * @returns {LinearFunction}
     * @public
     */
    get timeTransform() { return this._timeTransform; }

    /**
     * Resets the model.
     * @public
     */
    reset() {

      // Properties
      this.isPlayingProperty.reset();
      this.isTimeControlsEnabledProperty.reset();

      // model elements
      this.stopwatch.reset();
    }

    /**
     * Steps the model using real time units.
     * @param {number} dt - time delta, in seconds
     * @public
     */
    step( dt ) {
      if ( this.isPlayingProperty.value ) {
        this.stepModelTime( this.timeTransform( dt ) );
      }
    }

    /**
     * Steps the model using model time units.
     * @param {number} dt - time delta, in ps
     * @protected
     */
    stepModelTime( dt ) {

      // Advance the stopwatch
      this.stopwatch.step( dt );
    }
  }

  return gasProperties.register( 'GasPropertiesModel', GasPropertiesModel );
} );