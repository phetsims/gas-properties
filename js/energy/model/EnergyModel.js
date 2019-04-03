// Copyright 2018-2019, University of Colorado Boulder

/**
 * Model for the 'Energy' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesModel = require( 'GAS_PROPERTIES/common/model/GasPropertiesModel' );
  const HoldConstantEnum = require( 'GAS_PROPERTIES/common/model/HoldConstantEnum' );

  class EnergyModel extends GasPropertiesModel {

    constructor() {
      super( {
        holdConstant: HoldConstantEnum.VOLUME,
        hasCollisionCounter: false
      } );

      this.holdConstantProperty.lazyLink( holdConstant => {
         throw new Error( 'holdConstant is fixed in Energy screen' );
      } );
    }
  }

  return gasProperties.register( 'EnergyModel', EnergyModel );
} );