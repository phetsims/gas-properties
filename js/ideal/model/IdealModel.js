// Copyright 2019, University of Colorado Boulder

/**
 * Model for the 'Ideal' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesModel = require( 'GAS_PROPERTIES/common/model/GasPropertiesModel' );

  class IdealModel extends GasPropertiesModel {

    constructor() {
      super();
    }
  }

  return gasProperties.register( 'IdealModel', IdealModel );
} );