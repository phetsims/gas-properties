// Copyright 2018-2019, University of Colorado Boulder

/**
 * Model for the 'Explore' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesModel = require( 'GAS_PROPERTIES/common/model/GasPropertiesModel' );
  const HoldConstantEnum = require( 'GAS_PROPERTIES/common/model/HoldConstantEnum' );

  class ExploreModel extends GasPropertiesModel {

    constructor() {

      super( {
        holdConstant: HoldConstantEnum.NOTHING
      } );

      // In case clients attempt to exercise this feature of the base class
      this.holdConstantProperty.lazyLink( holdConstant => {
        throw new Error( 'holdConstant is fixed in this screen' );
      } );
    }
  }

  return gasProperties.register( 'ExploreModel', ExploreModel );
} );