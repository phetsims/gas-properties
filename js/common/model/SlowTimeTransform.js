// Copyright 2019, University of Colorado Boulder

/**
 * Transform between real and sim time for the 'slow' timescale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const LinearFunction = require( 'DOT/LinearFunction' );

  class SlowTimeTransform extends LinearFunction {

    constructor() {
      super( 0, 1, 0, 0.3 ); // s -> ps
    }
  }

  return gasProperties.register( 'SlowTimeTransform', SlowTimeTransform );
} );