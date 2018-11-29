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
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const CONTAINER_WIDTH_RANGE = new RangeWithValue( 100, 550, 550 ); // nm
  const CONTAINER_HEIGHT = 350; // nm

  class Container {

    constructor() {

      // @public (read-only) location of the container's bottom right corner, in nm
      this.location = Vector2.ZERO;

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

    /**
     * Gets the x coordinate of the container's left side.
     * @returns {number}
     */
    getLeft() { return this.location.x - this.widthProperty.value; }

    get left() { return this.getLeft(); }

    /**
     * Gets the y coordinate of the containers top side.
     * @returns {number}
     */
    getTop() { return this.location.y + this.height; }

    get top() { return this.getTop(); }
  }

  return gasProperties.register( 'Container', Container );
} );