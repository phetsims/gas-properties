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
  const DELTA_TEMPERATURE_THRESHOLD = 1; // temperature change (K) below this value is considered zero change
  const DURATION = 2; // animation duration, in seconds, split evenly between up and down animations
  const EASING = Easing.CUBIC_OUT;
  const MIN_HEAT_COOL_FACTOR = 0.20; // smallest heatCoolFactor for any temperature change
  const MAX_HEAT_COOL_FACTOR = 1; // largest heatCoolFactor for any temperature change
  const MAX_DELTA_TEMPERATURE = 100; // absolute temperature change (K) that corresponds to MAX_HEAT_COOL_FACTOR

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

      // Animation to lower the flame/ice associated with HeaterCoolerNode
      const downAnimation = new Animation( {
        property: heatCoolFactorProperty,
        to: 0,
        duration: DURATION / 2,
        easing: EASING
      } );

      // Animation to raise the flame/ice associated with HeaterCoolerNode
      let upAnimation = null; // {Animation}
                   
      // stops the animation at whatever stage it's in
      const stopAnimation = () => {
        downAnimation.stop();
        if ( upAnimation ) {
          upAnimation.stop();
          upAnimation = null;
        }
      };

      // cancels the animation and sets heatCoolFactor to zero
      const cancelAnimation = () => {
        stopAnimation();
        heatCoolFactorProperty.value = 0;
      };

      // When temperature changes in HoldConstantEnum.PRESSURE_T mode, animate the heater/cooler.
      temperatureProperty.link( ( temperature, previousTemperature ) => {
        if ( temperature === null || previousTemperature === null ) {
          cancelAnimation();
        }
        else if ( holdConstantProperty.value === HoldConstantEnum.PRESSURE_T ) {

          const deltaT = temperature - previousTemperature;

          if ( Math.abs( deltaT ) > DELTA_TEMPERATURE_THRESHOLD ) {

            // stop any animation that is in progress
            stopAnimation();

            // heat/cool factor is relative to temperature change
            const heatCoolFactor = deltaTemperatureToHeatCoolFactor( deltaT );

            // create and start the animation
            upAnimation = new Animation( {
              property: heatCoolFactorProperty,
              to: heatCoolFactor,
              duration: DURATION / 2,
              easing: EASING
            } );
            upAnimation.finishEmitter.addListener( () => {
              downAnimation.start();
            } );
            upAnimation.start();
          }
        }
      } );

      // This Node is relevant only for HoldConstantEnum.PRESSURE_T mode.
      holdConstantProperty.link( holdConstant => {
        this.visible = ( holdConstant === HoldConstantEnum.PRESSURE_T );
        if ( holdConstant !== HoldConstantEnum.PRESSURE_T ) {
          cancelAnimation();
        }
      } );
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

      // linear mapping of temperature change to heat/cool factor
      heatCoolFactor = Util.linear( 0, MAX_DELTA_TEMPERATURE, MIN_HEAT_COOL_FACTOR, MAX_HEAT_COOL_FACTOR, absDeltaT );

      // clamp to the heat/cool factor range
      heatCoolFactor = Util.clamp( heatCoolFactor, MIN_HEAT_COOL_FACTOR, MAX_HEAT_COOL_FACTOR );

      // set the correct sign
      heatCoolFactor *= ( deltaT > 1 ) ? 1 : -1;
    }

    return heatCoolFactor;
  }

  return gasProperties.register( 'AnimatedHeaterCoolerNode', AnimatedHeaterCoolerNode );
} ); 