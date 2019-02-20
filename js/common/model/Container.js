// Copyright 2018, University of Colorado Boulder

//TODO add info about hole in top of box
/**
 * Container for particles.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const RangeWithValue = require( 'DOT/RangeWithValue' );
  const Vector2 = require( 'DOT/Vector2' );

  class Container {

    constructor() {

      // @public (read-only) location of the container's bottom right corner, in nm
      this.location = Vector2.ZERO;

      // @public (read-only) height of the container, in nm
      this.height = 8.75;

      // @public (read-only) range of the container's width, in nm
      this.widthRange = new RangeWithValue( 5, 15, 10 );

      // @public width of the container, in nm
      this.widthProperty = new NumberProperty( this.widthRange.defaultValue, {
        numberType: 'FloatingPoint',
        range: this.widthRange,
        units: 'nanometers'
      } );
      this.widthProperty.link( width => { phet.log && phet.log( 'Container width=' + width ); } );

      // @public (read-only) range of the width of the opening in the top of the container, in nm
      this.openingWidthRange = new RangeWithValue( 0, 2.5, 0 );

      // @public width of the opening in the top of the container, in nm
      this.openingWidthProperty = new NumberProperty( this.openingWidthRange.defaultValue, {
        numberType: 'FloatingPoint',
        range: this.openingWidthRange,
        units: 'nanometers'
      } );

      // @public (read-only) x offset (absolute) of the opening from the container's origin, in nm
      this.openingXOffset = 2;
      assert && assert( this.openingXOffset > 0, 'invalid openingXOffset: ' + this.openingXOffset );
      assert && assert( this.widthRange.min - this.openingWidthRange.max - this.openingXOffset  > 0,
        'opening extends beyond the top of the container' );

      // @public (read-only) bicycle pump hose is connected to the right side of the container
      this.hoseLocation = new Vector2( this.location.x, this.location.y + this.height / 2 );
    }

    // @public
    reset() {
      this.widthProperty.reset();
      this.openingWidthProperty.reset();
    }

    /**
     * Gets the max bounds of the container, when it is expanded to its full width.
     * @returns {Bounds2}
     * @public
     */
    getMaxBounds() {
      return new Bounds2(
        this.location.x - this.widthRange.max, this.location.y,
        this.location.x, this.location.y + this.height
      );
    }

    get maxBounds() { return this.getMaxBounds(); }

    /**
     * Gets the x coordinate of the container's left side.
     * @returns {number}
     */
    getLeft() { return this.location.x - this.widthProperty.value; }

    get left() { return this.getLeft(); }

    /**
     * Gets the x coordinate of the container's right side.
     * @returns {number}
     */
    getRight() { return this.location.x; }

    get right() { return this.getRight(); }

    /**
     * Gets the y coordinate of the container's top side.
     * @returns {number}
     */
    getTop() { return this.location.y + this.height; }

    get top() { return this.getTop(); }

    /**
     * Gets the y coordinate of the container's bottom side.
     * @returns {number}
     */
    getBottom() { return this.location.y; }

    get bottom() { return this.getBottom(); }

    /**
     * Gets the min x coordinate of the opening in the top of the container.
     * @returns number
     */
    getOpeningMinX() { return this.openingMaxX - this.openingWidthRange.max; }

    get openingMinX() { return this.getOpeningMinX(); }

    /**
     * Gets the max x coordinate of the opening in the top of the container.
     * @returns number
     */
    getOpeningMaxX() { return this.location.x - this.openingXOffset; }

    get openingMaxX() { return this.getOpeningMaxX(); }
  }

  return gasProperties.register( 'Container', Container );
} );