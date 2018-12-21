// Copyright 2018, University of Colorado Boulder

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
     * @param {Property.<HoldConstantEnum>} holdConstantProperty
     * @param {Object} [options]
     */
    constructor( heatCoolAmountProperty, holdConstantProperty, options ) {

      options = _.extend( {
        scale: 0.81
      }, options );

      super( heatCoolAmountProperty, options );

      // Hide the slider when temperature is held constant
      holdConstantProperty.link( holdConstant => {
        this.slider.visible = ( holdConstant !== HoldConstantEnum.TEMPERATURE );
      } );
    }
  }

  return gasProperties.register( 'GasPropertiesHeaterCoolerNode', GasPropertiesHeaterCoolerNode );
} );