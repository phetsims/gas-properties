// Copyright 2018-2019, University of Colorado Boulder

/**
 * Model for the 'Explore' screen, a variation of the 'Ideal' model.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const HoldConstantEnum = require( 'GAS_PROPERTIES/common/model/HoldConstantEnum' );
  const IdealModel = require( 'GAS_PROPERTIES/ideal/model/IdealModel' );

  class ExploreModel extends IdealModel {

    constructor() {

      super( {
        holdConstant: HoldConstantEnum.NOTHING
      } );

      this.holdConstantProperty.lazyLink( holdConstant => {
        throw new Error( 'holdConstant is fixed in this screen' );
      } );
    }
  }

  return gasProperties.register( 'ExploreModel', ExploreModel );
} );