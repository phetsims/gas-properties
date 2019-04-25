// Copyright 2018-2019, University of Colorado Boulder

/**
 * HeaterCoolerNode subclass for this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const HeaterCoolerNode = require( 'SCENERY_PHET/HeaterCoolerNode' );
  const HoldConstantEnum = require( 'GAS_PROPERTIES/common/model/HoldConstantEnum' );

  class GasPropertiesHeaterCoolerNode extends HeaterCoolerNode {

    /**
     * @param {NumberProperty} heatCoolAmountProperty
     * @param {EnumerationProperty} holdConstantProperty
     * @param {BooleanProperty} isPlayingProperty
     * @param {Object} [options]
     */
    constructor( heatCoolAmountProperty, holdConstantProperty, isPlayingProperty, options ) {

      options = _.extend( {
        scale: 0.81
      }, options );

      super( heatCoolAmountProperty, options );

      // Hide the slider when temperature is held constant.
      holdConstantProperty.link( holdConstant => {
        this.interruptSubtreeInput(); // cancel interaction
        this.slider.visible = ( holdConstant !== HoldConstantEnum.TEMPERATURE &&
                                holdConstant !== HoldConstantEnum.PRESSURE_T );
      } );

      // Disable the slider when the sim is paused.
      isPlayingProperty.link( isPlaying => {
        this.interruptSubtreeInput(); // cancel interaction
        this.slider.enabled = isPlaying;
      } );
    }
  }

  return gasProperties.register( 'GasPropertiesHeaterCoolerNode', GasPropertiesHeaterCoolerNode );
} );