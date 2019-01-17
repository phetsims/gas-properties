// Copyright 2018, University of Colorado Boulder

/**
 * TODO Port of Java class
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Range = require( 'DOT/Range' );

  class IdealGasModel {

    constructor() {

      // @public TODO should this be acceleration due to gravity? units?
      this.gravityProperty = new NumberProperty( 0, {
        range: new Range( 0, 40 )
      } );
    }
  }

  return gasProperties.register( 'IdealGasModel', IdealGasModel );
} );