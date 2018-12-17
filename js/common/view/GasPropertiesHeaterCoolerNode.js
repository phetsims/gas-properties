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

      //TODO hide or disable the slider? See https://github.com/phetsims/scenery-phet/issues/442
      // Disable when temperature is held constant
      holdConstantProperty.link( holdConstant => {
        const enabled = ( holdConstant !== HoldConstantEnum.TEMPERATURE );
        if ( enabled ) {
          this.pickable = true;
          this.opacity = 1;
        }
        else {
          this.interruptSubtreeInput(); // cancel any interaction
          this.pickable = false;
          this.opacity = 0.3; // same as other common-code UI components
        }
      } );
    }
  }

  return gasProperties.register( 'GasPropertiesHeaterCoolerNode', GasPropertiesHeaterCoolerNode );
} );