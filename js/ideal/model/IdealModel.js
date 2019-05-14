// Copyright 2019, University of Colorado Boulder

/**
 * Model for the 'Ideal' screen.
 * Adds no additional functionality to the base class, but provided for symmetry in the model-view type hierarchy.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesModel = require( 'GAS_PROPERTIES/common/model/GasPropertiesModel' );

  class IdealModel extends GasPropertiesModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {
      super( tandem );
    }
  }

  return gasProperties.register( 'IdealModel', IdealModel );
} );