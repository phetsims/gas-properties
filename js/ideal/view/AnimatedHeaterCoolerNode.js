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
  const MIN_HEAT_FACTOR = 0.2;

  // Animation duration in seconds, split evenly between raising and lowering the flame/ice.
  const HEAT_COOL_DURATION = 1.5;

  // Animations will be controlled by calling step
  const STEP_EMITTER = null;

  class AnimatedHeaterCoolerNode extends HeaterCoolerNode {

    /**
     * @param {EnumerationProperty} holdConstantProperty
     * @param {Property.<number>} totalNumberOfParticlesProperty
     * @param {Property.<number|null>} temperatureProperty
     * @param {Object} [options]
     */
    constructor( holdConstantProperty, totalNumberOfParticlesProperty, temperatureProperty, options ) {
      assert && assert( holdConstantProperty instanceof EnumerationProperty,
        `invalid holdConstantProperty: ${holdConstantProperty}` );
      assert && assert( totalNumberOfParticlesProperty instanceof Property,
              `invalid totalNumberOfParticlesProperty: ${totalNumberOfParticlesProperty}` );
      assert && assert( temperatureProperty instanceof Property,
        `invalid temperatureProperty: ${temperatureProperty}` );

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
        if ( holdConstantProperty.value === HoldConstantEnum.PRESSURE_T ) {

          const numberOfParticles = totalNumberOfParticlesProperty.value;

          if ( temperature === null || previousTemperature === null || numberOfParticles === 0 ) {
            stopAnimation();
          }
          else {

            const deltaT = temperature - previousTemperature;

            if ( Math.abs( deltaT ) > MIN_DELTA_T ) {

              // stop any animation that is in progress
              stopAnimation();

              // heat/cool factor is relative to temperature change and number of particles
              const heatCoolFactor = computeHeatCoolFactor( deltaT, numberOfParticles );

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

              // When the 'up' Animation finishes...
              this.animation.finishEmitter.addListener( () => {

                // Animation that moves the flame/ice down
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
   * @param {number} numberOfParticles
   * @returns {number}
   */
  function computeHeatCoolFactor( deltaT, numberOfParticles ) {
    assert && assert( typeof deltaT === 'number' && Math.abs( deltaT ) > 0, `invalid deltaT: ${deltaT}` );
    assert && assert( typeof numberOfParticles === 'number' && numberOfParticles > 0,
      `invalid numberOfParticles: ${numberOfParticles}` );

    // linear mapping of temperature change to heat factor
    let heatCoolFactor = Util.linear( 0, MAX_DELTA_T, MIN_HEAT_FACTOR, 1, Math.abs( deltaT ) );

    // clamp to the heat factor range
    heatCoolFactor = Util.clamp( heatCoolFactor, MIN_HEAT_FACTOR, 1 );

    // set the sign to correspond to heat vs cool
    heatCoolFactor *= Util.sign( deltaT );

    return heatCoolFactor;
  }

  return gasProperties.register( 'AnimatedHeaterCoolerNode', AnimatedHeaterCoolerNode );
} ); 