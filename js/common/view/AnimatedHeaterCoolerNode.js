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
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const HeaterCoolerNode = require( 'SCENERY_PHET/HeaterCoolerNode' );
  const HoldConstantEnum = require( 'GAS_PROPERTIES/common/model/HoldConstantEnum' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Util = require( 'DOT/Util' );

  // constants

  // Temperature changes below this value (in K) are considered zero and result in no animation of flame/ice.
  // This is required to avoid spurious animation due to floating-point errors.
  const MIN_DELTA_T = GasPropertiesQueryParameters.minDeltaT; 

  // Temperature changes >= this value (in K) result in flame/ice being fully on.
  const MAX_DELTA_T = GasPropertiesQueryParameters.maxDeltaT;

  // Smallest percentage of the flame/ice that is raised out of the bucket for any temperature change.
  const MIN_HEAT_FACTOR = GasPropertiesQueryParameters.minHeatCoolFactor;

  // Animation duration in seconds, split evenly between raising and lowering the flame/ice.
  const HEAT_COOL_DURATION = GasPropertiesQueryParameters.heatCoolDuration;

  // Animations will be controlled by calling step
  const STEP_EMITTER = null;

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
        duration: HEAT_COOL_DURATION / 2,
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

          if ( Math.abs( deltaT ) > MIN_DELTA_T ) {

            // stop any animation that is in progress
            stopAnimation();

            // heat/cool factor is relative to temperature change
            const heatCoolFactor = deltaTemperatureToHeatCoolFactor( deltaT );

            // Animation that moves the flame/ice up
            this.animation = new Animation( {
              property: heatCoolFactorProperty,
              to: heatCoolFactor,
              duration: HEAT_COOL_DURATION / 2,
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
                duration: HEAT_COOL_DURATION / 2,
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
      heatCoolFactor = Util.linear( 0, MAX_DELTA_T, MIN_HEAT_FACTOR, 1, absDeltaT );

      // clamp to the heat factor range
      heatCoolFactor = Util.clamp( heatCoolFactor, MIN_HEAT_FACTOR, 1 );

      // set the sign to correspond to heat vs cool
      heatCoolFactor *= Util.sign( deltaT );
    }

    return heatCoolFactor;
  }

  return gasProperties.register( 'AnimatedHeaterCoolerNode', AnimatedHeaterCoolerNode );
} ); 