// Copyright 2018, University of Colorado Boulder

/**
 * Container for particles.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const RangeWithValue = require( 'DOT/RangeWithValue' );

  // constants
  const CONTAINER_WIDTH_RANGE = new RangeWithValue( 100, 500, 500 );
  const CONTAINER_HEIGHT = 400;

  class Container {

    constructor() {

      // @public width of the container, in nm
      this.widthProperty = new NumberProperty( CONTAINER_WIDTH_RANGE.defaultValue, {
        numberType: 'FloatingPoint',
        range: CONTAINER_WIDTH_RANGE,
        units: 'nanometers'
      } );

      // @public (read-only) height of the container, in nm
      this.height = CONTAINER_HEIGHT;
    }

    // @public
    reset() {
      this.widthProperty.reset();
    }
  }

  return gasProperties.register( 'Container', Container );
} );