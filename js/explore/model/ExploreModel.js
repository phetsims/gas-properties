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
  const HoldConstant = require( 'GAS_PROPERTIES/common/model/HoldConstant' );
  const Tandem = require( 'TANDEM/Tandem' );

  class ExploreModel extends GasPropertiesModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {
      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      super( tandem, {
        holdConstant: HoldConstant.NOTHING,
        leftWallDoesWork: true // moving the left wall does work on particles
      } );

      // In case clients attempt to use this feature of the base class
      this.holdConstantProperty.lazyLink( holdConstant => {
        throw new Error( 'holdConstant is fixed in the Explore screen' );
      } );
    }
  }

  return gasProperties.register( 'ExploreModel', ExploreModel );
} );