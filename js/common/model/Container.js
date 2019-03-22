// Copyright 2018, University of Colorado Boulder

//TODO add info about hole in top of box
/**
 * A rectangular container for particles. Origin is at the bottom-right corner. Width increases to the left.
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
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );

  class Container {

    constructor() {

      // @public (read-only) location of the container's bottom right corner, in nm
      this.location = new Vector2( 0, 0 );

      // @public (read-only) range of the container's width, in nm
      this.widthRange = new RangeWithValue( 5, 15, 10 );

      // @public width of the container, in nm
      this.widthProperty = new NumberProperty( this.widthRange.defaultValue, {
        range: this.widthRange,
        units: 'nm'
      } );

      // @public (read-only) height of the container, in nm
      this.height = 8.75;

      // @public (read-only) wall thickness, in nm
      this.wallThickness = 0.05;

      // @public (read-only) locations of the container's inside bounds in nm. left is dynamic, see ES5 getter
      this.right = this.location.x;
      this.top = this.location.y + this.height;
      this.bottom = this.location.y;

      // @public (read-only) lid thickness, in nm
      this.lidThickness = 3 * this.wallThickness;

      // @public (read-only) insets of the opening in the top, from the inside edges of the container, in nm
      this.openingLeftInset = 0.5;
      this.openingRightInset = 2;
      assert && assert( this.widthRange.min > this.openingLeftInset + this.openingRightInset,
        'widthRange.min is too small to accommodate insets' );

      // @public (read-only) the max x coordinate of the opening in the top of the container, in nm
      // openingMinX is dynamic, see ES5 getter
      this.openingMaxX = this.right - this.openingRightInset;

      // @public width of the lid, in nm
      this.lidWidthProperty = new NumberProperty( this.widthProperty.value - this.openingRightInset + this.wallThickness, {
        units: 'nm'
      } );

      // @public (read-only) bicycle pump hose is connected to the outside right side of the container, in nm
      this.hoseLocation = new Vector2( this.location.x + this.wallThickness, this.location.y + this.height / 2 );

      // @public (read-only) max bounds of the container, when it is expanded to its full width, in nm
      this.maxBounds = new Bounds2(
        this.location.x - this.widthRange.max, this.location.y,
        this.location.x, this.location.y + this.height
      );
    }

    // @public
    reset() {
      this.widthProperty.reset();
      this.lidWidthProperty.reset();
    }

    /**
     * Gets the left edge of the container's inside bounds.
     * @returns {number} in nm
     * @public
     */
    get left() { return this.location.x - this.widthProperty.value; }

    /**
     * Gets the min x coordinate of the opening in the top of the container.
     * @returns {number} in nm
     * @public
     */
    get openingMinX() {
      const openingMinX = this.left - this.wallThickness + this.lidWidthProperty.value;
      assert && assert( openingMinX <= this.openingMaxX, 'openingMinX must be <= openingMaxX' );
      return openingMinX;
    }

    /**
     * Gets the width of the opening in the top of the container.
     * @returns {number} in nm
     */
    get openingWidth() {
      const openingWidth = this.openingMaxX - this.openingMinX;
      assert && assert( openingWidth >= 0, 'invalid openingWidth: ' + openingWidth );
      return openingWidth;
    }

    /**
     * Determines whether the container surrounds a particle on all sides. Accounts for the particle's radius.
     * @param {Particle} particle
     * @returns {boolean}
     * @public
     */
    enclosesParticle( particle ) {

      // Util.toFixedNumber is a threshold comparison, necessary due to floating-point error.
      const decimalPlaces = 3;
      return Util.toFixedNumber( particle.left, decimalPlaces ) >= Util.toFixedNumber( this.left, decimalPlaces ) &&
             Util.toFixedNumber( particle.right, decimalPlaces ) <= Util.toFixedNumber( this.right, decimalPlaces ) &&
             Util.toFixedNumber( particle.top, decimalPlaces ) <= Util.toFixedNumber( this.top, decimalPlaces ) &&
             Util.toFixedNumber( particle.bottom, decimalPlaces ) >= Util.toFixedNumber( this.bottom, decimalPlaces );
    }
  }

  return gasProperties.register( 'Container', Container );
} );