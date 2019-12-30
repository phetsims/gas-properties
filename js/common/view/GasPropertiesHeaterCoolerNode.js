// Copyright 2018-2019, University of Colorado Boulder

/**
 * GasPropertiesHeaterCoolerNode is a specialization of HeaterCoolerNode for this sim.  Responsibilities include:
 * 
 * - Disables the slider when the sim is paused, and hides the slider for some of the 'Hold Constant' modes.
 *
 * - When holding pressure constant by varying temperature (HoldConstant.PRESSURE_T mode), the flame/ice is 
 *   animated to correspond to the amount of heating/cooling needed to vary the temperature.  This is a "Hollywood"
 *   animation, because the model does not apply any heat/cool in this situation.  It adjusts particles speeds to
 *   result in the desired temperature.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Animation = require( 'TWIXT/Animation' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Easing = require( 'TWIXT/Easing' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const HeaterCoolerNode = require( 'SCENERY_PHET/HeaterCoolerNode' );
  const HoldConstant = require( 'GAS_PROPERTIES/common/model/HoldConstant' );
  const LinearFunction = require( 'DOT/LinearFunction' );
  const merge = require( 'PHET_CORE/merge' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Utils = require( 'DOT/Utils' );

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
  const toHeatFactor = new LinearFunction( 0, MAX_DELTA_T_N, MIN_HEAT_COOL_FACTOR, 1, true /* clamp */ );

  // Animations will be controlled by calling step
  const STEP_EMITTER = null;

  class GasPropertiesHeaterCoolerNode extends HeaterCoolerNode {

    /**
     * @param {NumberProperty} heatCoolAmountProperty
     * @param {EnumerationProperty} holdConstantProperty
     * @param {BooleanProperty} isPlayingProperty
     * @param {Property.<number>} numberOfParticlesProperty
     * @param {Property.<number|null>} temperatureProperty
     * @param {Object} [options]
     */
    constructor( heatCoolAmountProperty, holdConstantProperty, isPlayingProperty,
                 numberOfParticlesProperty, temperatureProperty, options ) {
      assert && assert( heatCoolAmountProperty instanceof NumberProperty,
        `invalid heatCoolAmountProperty: ${heatCoolAmountProperty}` );
      assert && assert( holdConstantProperty instanceof EnumerationProperty,
        `invalid holdConstantProperty: ${holdConstantProperty}` );
      assert && assert( isPlayingProperty instanceof BooleanProperty,
        `invalid isPlayingProperty: ${isPlayingProperty}` );
      assert && assert( numberOfParticlesProperty instanceof Property,
        `invalid numberOfParticlesProperty: ${numberOfParticlesProperty}` );
      assert && assert( temperatureProperty instanceof Property,
        `invalid temperatureProperty: ${temperatureProperty}` );

      options = merge( {

        // superclass options
        scale: 0.8
      }, options );

      // Private Property that either corresponds to the model or is animated, depending on the Hold Constant mode.
      // This is the Property that is actually connected to the HeaterCoolerNode.
      const privateHeatCoolAmountProperty = new NumberProperty( 0, {
        range: new Range( -1, 1 )
      } );
      
      super( privateHeatCoolAmountProperty, options );

      // When the model applies heat/cool, update the private Property.
      heatCoolAmountProperty.link( heatCoolAmount => {
        assert && assert( holdConstantProperty.value !== HoldConstant.PRESSURE_T,
          'model should not apply heat/cool in this mode' );
        privateHeatCoolAmountProperty.value = heatCoolAmount;
      } );

      // If the user is controlling the slider, then update the model.
      privateHeatCoolAmountProperty.link( privateHeatCoolAmount => {
        if ( this.slider.visible ) {
          heatCoolAmountProperty.value = privateHeatCoolAmount;
        }
      } );

      // @private {Animation|null} animation of privateHeatCoolAmountProperty, null when no animation is running
      this.animation = null;

      // stops the animation at whatever stage it's in
      const stopAnimation = () => {
        if ( this.animation ) {
          this.animation.stop();
          this.animation = null;
        }
      };

      // When temperature changes in HoldConstant.PRESSURE_T mode, animate the heater/cooler.
      temperatureProperty.link( ( temperature, previousTemperature ) => {
        if ( holdConstantProperty.value === HoldConstant.PRESSURE_T ) {

          const numberOfParticles = numberOfParticlesProperty.value;

          if ( temperature === null || previousTemperature === null || numberOfParticles === 0 ) {
            stopAnimation();
          }
          else {

            const deltaT = temperature - previousTemperature;

            if ( Math.abs( deltaT ) > MIN_DELTA_T ) {

              // compute heat/cool factor, relative to temperature change and number of particles
              const deltaTN = deltaT * numberOfParticles; // deltaT * N
              const heatCoolFactor = Utils.sign( deltaT ) * toHeatFactor( Math.abs( deltaTN ) );
              assert && assert( heatCoolFactor >= -1 && heatCoolFactor <= 1, `invalid heatCoolFactor: ${heatCoolFactor}` );

              // Animation that moves the flame/ice up
              this.animation = new Animation( {
                property: privateHeatCoolAmountProperty,
                to: heatCoolFactor,
                duration: HEAT_COOL_DURATION / 2,
                easing: Easing.CUBIC_OUT, // accelerates
                stepEmitter: STEP_EMITTER
              } );

              // If the Animation is stopped prematurely, abruptly turn off heat/cool
              this.animation.stopEmitter.addListener( () => {
                this.animation = null;
                privateHeatCoolAmountProperty.value = 0;
              } );

              // When the 'up' Animation finishes...
              this.animation.finishEmitter.addListener( () => {

                // Animation that moves the flame/ice down
                this.animation = new Animation( {
                  property: privateHeatCoolAmountProperty,
                  to: 0,
                  duration: HEAT_COOL_DURATION / 2,
                  easing: Easing.CUBIC_IN, // decelerates
                  stepEmitter: STEP_EMITTER
                } );

                // If the down animation is stopped, abruptly turn off heat/cool.
                this.animation.stopEmitter.addListener( () => {
                  privateHeatCoolAmountProperty.value = 0;
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

      // Disable the slider when the sim is paused.
      isPlayingProperty.link( isPlaying => {
        this.interruptSubtreeInput(); // cancel interaction
        this.slider.enabled = isPlaying;
      } );

      // When the Hold Constant mode changes...
      holdConstantProperty.link( holdConstant => {

        // cancel interaction
        this.interruptSubtreeInput();

        // Stop any in-progress animation of the flame/ice
        stopAnimation();

        // Hide the slider in modes where the user does not have control of temperature.
        this.slider.visible = ( holdConstant !== HoldConstant.TEMPERATURE &&
                                holdConstant !== HoldConstant.PRESSURE_T );
      } );
    }

    /**
     * Steps the animation.
     * @param {number} dt - time delta, in seconds
     * @public
     */
    step( dt ) {
      assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );
      this.animation && this.animation.step( dt );
    }
  }

  return gasProperties.register( 'GasPropertiesHeaterCoolerNode', GasPropertiesHeaterCoolerNode );
} );