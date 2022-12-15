// Copyright 2018-2022, University of Colorado Boulder

/**
 * GasPropertiesHeaterCoolerNode is a specialization of HeaterCoolerNode for this sim.  Responsibilities include:
 *
 * - Disables the slider when the sim is paused, and hides the slider for some 'Hold Constant' modes.
 *
 * - When holding pressure constant by varying temperature (HoldConstant 'pressureT' mode), the flame/ice is
 *   animated to correspond to the amount of heating/cooling needed to vary the temperature.  This is a "Hollywood"
 *   animation, because the model does not apply any heat/cool in this situation.  It adjusts particles speeds to
 *   result in the desired temperature.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import Range from '../../../../dot/js/Range.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import HeaterCoolerNode, { HeaterCoolerNodeOptions } from '../../../../scenery-phet/js/HeaterCoolerNode.js';
import { NodeTranslationOptions } from '../../../../scenery/js/imports.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import gasProperties from '../../gasProperties.js';
import { HoldConstant } from '../model/HoldConstant.js';

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


type SelfOptions = EmptySelfOptions;

type GasPropertiesHeaterCoolerNodeOptions = SelfOptions & NodeTranslationOptions &
  PickRequired<HeaterCoolerNodeOptions, 'tandem'>;

export default class GasPropertiesHeaterCoolerNode extends HeaterCoolerNode {

  // animation of heatCoolAmountProperty, null when no animation is running
  private animation: Animation | null;

  public constructor( heatCoolAmountProperty: NumberProperty,
                      holdConstantProperty: StringUnionProperty<HoldConstant>,
                      isPlayingProperty: TReadOnlyProperty<boolean>,
                      numberOfParticlesProperty: TReadOnlyProperty<number>,
                      temperatureProperty: Property<number | null>,
                      providedOptions: GasPropertiesHeaterCoolerNodeOptions ) {

    const options = optionize<GasPropertiesHeaterCoolerNodeOptions, SelfOptions, HeaterCoolerNodeOptions>()( {

      // HeaterCoolerNodeOptions
      scale: 0.8,
      frontOptions: {
        sliderOptions: {
          phetioLinkedProperty: heatCoolAmountProperty
        }
      }
    }, providedOptions );

    // Private Property that either corresponds to the model or is animated, depending on the Hold Constant mode.
    // This is the Property that is actually connected to the HeaterCoolerNode.
    const privateHeatCoolAmountProperty = new NumberProperty( 0, {
      range: new Range( -1, 1 )
    } );

    super( privateHeatCoolAmountProperty, options );

    // When the model applies heat/cool, update the private Property.
    heatCoolAmountProperty.link( heatCoolAmount => {
      privateHeatCoolAmountProperty.value = heatCoolAmount;
    } );

    // If the user is controlling the slider, then update the model.
    privateHeatCoolAmountProperty.link( privateHeatCoolAmount => {
      if ( this.slider.visible ) {
        heatCoolAmountProperty.value = privateHeatCoolAmount;
      }
    } );

    this.animation = null;

    // stops the animation at whatever stage it's in
    const stopAnimation = () => {
      if ( this.animation ) {
        this.animation.stop();
        this.animation = null;
      }
    };

    // When temperature changes in HoldConstant 'pressureT' mode, animate the heater/cooler.
    temperatureProperty.link( ( temperature, previousTemperature ) => {
      if ( holdConstantProperty.value === 'pressureT' ) {

        const numberOfParticles = numberOfParticlesProperty.value;

        if ( temperature === null || previousTemperature === null || numberOfParticles === 0 ) {
          stopAnimation();
        }
        else {

          const deltaT = temperature - previousTemperature;

          if ( Math.abs( deltaT ) > MIN_DELTA_T ) {

            // compute heat/cool factor, relative to temperature change and number of particles
            const deltaTN = deltaT * numberOfParticles; // deltaT * N
            const heatCoolFactor = Math.sign( deltaT ) * toHeatFactor.evaluate( Math.abs( deltaTN ) );
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
      this.slider.visible = ( holdConstant !== 'temperature' && holdConstant !== 'pressureT' );
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Steps the animation.
   * @param dt - time delta, in seconds
   */
  public step( dt: number ): void {
    assert && assert( dt >= 0, `invalid dt: ${dt}` );
    this.animation && this.animation.step( dt );
  }
}

gasProperties.register( 'GasPropertiesHeaterCoolerNode', GasPropertiesHeaterCoolerNode );