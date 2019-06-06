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
  const HoldConstant = require( 'GAS_PROPERTIES/common/model/HoldConstant' );
  const LinearFunction = require( 'DOT/LinearFunction' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Util = require( 'DOT/Util' );

  // constants

  // Animation duration in seconds, split evenly between raising and lowering the flame/ice.
  const HEAT_COOL_DURATION = 1.5;

  // Temperature changes below this value (in K) are considered zero and result in no animation of flame/ice.
  // This is required to avoid spurious animation due to floating-point errors.
  const MIN_DELTA_T = 1E-5;

  // HeaterCoolerNode takes a value from [-1,1], when -1 is ice, 1 is flame, and 0 is nothing. This value is the
  // minimum absolute value, and ensures that some of the flame/ice is always shown for small temperature changes.
  const MIN_HEAT_COOL_FACTOR = 0.2;

  // deltaT * N >= this value results in flame/ice being fully on.
  // See https://github.com/phetsims/gas-properties/issues/88 for additional history.
  const MAX_DELTA_T_N = 20000;

  // Mapping of deltaT * N to heat factor.
  const TO_HEAT_FACTOR = new LinearFunction( 0, MAX_DELTA_T_N, MIN_HEAT_COOL_FACTOR, 1, true /* clamp */ );

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

        // superclass options
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

      // When temperature changes in HoldConstant.PRESSURE_T mode, animate the heater/cooler.
      temperatureProperty.link( ( temperature, previousTemperature ) => {
        if ( holdConstantProperty.value === HoldConstant.PRESSURE_T ) {

          const numberOfParticles = totalNumberOfParticlesProperty.value;

          if ( temperature === null || previousTemperature === null || numberOfParticles === 0 ) {
            stopAnimation();
          }
          else {

            const deltaT = temperature - previousTemperature;

            if ( Math.abs( deltaT ) > MIN_DELTA_T ) {

              // stop any animation that is in progress
              stopAnimation();

              // compute heat/cool factor, relative to temperature change and number of particles
              const deltaTN = deltaT * numberOfParticles; // deltaT * N
              const heatCoolFactor = Util.sign( deltaT ) * TO_HEAT_FACTOR( Math.abs( deltaTN ) );
              assert && assert( heatCoolFactor >= -1 && heatCoolFactor <= 1, `invalid heatCoolFactor: ${heatCoolFactor}` );

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

      // This Node is relevant only for HoldConstant.PRESSURE_T mode.
      holdConstantProperty.link( holdConstant => {
        if ( holdConstant !== HoldConstant.PRESSURE_T ) {
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

  return gasProperties.register( 'AnimatedHeaterCoolerNode', AnimatedHeaterCoolerNode );
} ); 