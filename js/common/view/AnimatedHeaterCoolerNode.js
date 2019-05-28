// Copyright 2019, University of Colorado Boulder

/**
 * When holding pressure constant by varying temperature (HoldConstant.PRESSURE_T mode), the speed of particles is
 * adjusted to result in the temperature required to keep pressure constant. This class animates a Property to
 * reflect the speed adjustment, and that Property is observed by a SCENERY_PHET/HeaterCoolerNode.
 * This animation has no affect on the model, it is pure 'Hollywood'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Animation = require( 'TWIXT/Animation' );
  const Easing = require( 'TWIXT/Easing' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const HeaterCoolerNode = require( 'SCENERY_PHET/HeaterCoolerNode' );
  const HoldConstantEnum = require( 'GAS_PROPERTIES/common/model/HoldConstantEnum' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Util = require( 'DOT/Util' );

  // constants
  const DELTA_TEMPERATURE_THRESHOLD = 0.1; // temperature change (K) below this value is considered zero change
  const DURATION = 1.5; // animation duration, in seconds, split evenly between up and down animations
  const STEP_EMITTER = null; // Animations will be controlled by calling step
  const MIN_HEAT_FACTOR = 0.20; // smallest heat factor for any positive temperature change
  const MAX_HEAT_FACTOR = 1; // largest heat factor for any positive temperature change
  const MAX_DELTA_TEMPERATURE = 100; // absolute temperature change (K) that corresponds to MAX_HEAT_FACTOR

  class AnimatedHeaterCoolerNode extends HeaterCoolerNode {

    /**
     * @param {Property.<number|null>} temperatureProperty
     * @param {EnumerationProperty} holdConstantProperty
     * @param {Object} [options]
     */
    constructor( temperatureProperty, holdConstantProperty, options ) {
      assert && assert( temperatureProperty instanceof Property,
        `invalid temperatureProperty: ${temperatureProperty}` );
      assert && assert( holdConstantProperty instanceof EnumerationProperty,
        `invalid holdConstantProperty: ${holdConstantProperty}` );

      options = _.extend( {
        pickable: false
      }, options );

      // @public the factor to heat or cool, as required by HeaterCoolerNode. This Property's value will be animated.
      const heatCoolFactorProperty = new NumberProperty( 0, {
        range: new Range( -1, 1 )
      } );

      super( heatCoolFactorProperty, options );

      // Slider is hidden, because the user is not controlling temperature.
      this.slider.visible = false;

      // @private Animation to lower the flame/ice associated with HeaterCoolerNode
      this.downAnimation = new Animation( {
        property: heatCoolFactorProperty,
        to: 0,
        duration: DURATION / 2,
        easing: Easing.CUBIC_IN, // decelerates
        stepEmitter: STEP_EMITTER
      } );

      // @private {Animation|null}
      this.animation = null;

      // stops the animation at whatever stage it's in
      const stopAnimation = () => {
        if ( this.upAnimation ) {
          this.upAnimation.stop();
          this.upAnimation = null;
        }
      };

      // When temperature changes in HoldConstantEnum.PRESSURE_T mode, animate the heater/cooler.
      temperatureProperty.link( ( temperature, previousTemperature ) => {
        if ( temperature === null || previousTemperature === null ) {
          stopAnimation();
        }
        else if ( holdConstantProperty.value === HoldConstantEnum.PRESSURE_T ) {

          const deltaT = temperature - previousTemperature;

          if ( Math.abs( deltaT ) > DELTA_TEMPERATURE_THRESHOLD ) {

            // stop any animation that is in progress
            stopAnimation();

            // heat/cool factor is relative to temperature change
            const heatCoolFactor = deltaTemperatureToHeatCoolFactor( deltaT );

            // Animation that moves the flame/ice up
            this.animation = new Animation( {
              property: heatCoolFactorProperty,
              to: heatCoolFactor,
              duration: DURATION / 2,
              easing: Easing.CUBIC_OUT, // accelerates
              stepEmitter: STEP_EMITTER
            } );

            // If the Animation is stopped prematurely, abruptly turn off heat/cool
            this.animation.stopEmitter.addListener( () => {
              this.animation = null;
              heatCoolFactorProperty.value = 0;
            } );

            // When the 'up' Animation finishes, create and start an Animation that move the flame/ice down
            this.animation.finishEmitter.addListener( () => {

              this.animation = new Animation( {
                property: heatCoolFactorProperty,
                to: 0,
                duration: DURATION / 2,
                easing: Easing.CUBIC_IN, // decelerates
                stepEmitter: STEP_EMITTER
              } );

              // If the down animation is stopped, abruptly turn off heat/cool.
              this.animation.stopEmitter.addListener( () => {
                heatCoolFactorProperty.value = 0;
              } );

              // When the down Animation finishes, we're done.
              this.animation.finishEmitter.addListener( () => {
                this.animation = null;
              } );

              this.animation.start();
            } );

            this.animation.start();
          }
        }
      } );

      // This Node is relevant only for HoldConstantEnum.PRESSURE_T mode.
      holdConstantProperty.link( holdConstant => {
        this.visible = ( holdConstant === HoldConstantEnum.PRESSURE_T );
        if ( holdConstant !== HoldConstantEnum.PRESSURE_T ) {
          stopAnimation();
        }
      } );
    }

    /**
     * Steps the animation.
     * @param {number} dt - time delta, in seconds
     */
    step( dt ) {
      assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );
      this.animation && this.animation.step( dt );
    }
  }

  /**
   * Converts a change in temperature to a heat/cool factor that is appropriate for use with HeaterCoolerNode.
   * @param {number} deltaT
   * @returns {number}
   */
  function deltaTemperatureToHeatCoolFactor( deltaT ) {
    assert && assert( typeof deltaT === 'number', `invalid deltaT: ${deltaT}` );

    let heatCoolFactor = 0;

    const absDeltaT = Math.abs( deltaT );
    if ( absDeltaT > 0 ) {

      // linear mapping of temperature change to heat factor
      heatCoolFactor = Util.linear( 0, MAX_DELTA_TEMPERATURE, MIN_HEAT_FACTOR, MAX_HEAT_FACTOR, absDeltaT );

      // clamp to the heat factor range
      heatCoolFactor = Util.clamp( heatCoolFactor, MIN_HEAT_FACTOR, MAX_HEAT_FACTOR );

      // set the sign to correspond to heat vs cool
      heatCoolFactor *= Util.sign( deltaT );
    }

    return heatCoolFactor;
  }

  return gasProperties.register( 'AnimatedHeaterCoolerNode', AnimatedHeaterCoolerNode );
} ); 