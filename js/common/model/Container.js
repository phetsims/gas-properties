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
      this.location = Vector2.ZERO;

      // @public (read-only) range of the container's width, in nm
      this.widthRange = new RangeWithValue( 5, 15, 10 );

      // @public width of the container, in nm
      this.widthProperty = new NumberProperty( this.widthRange.defaultValue, {
        numberType: 'FloatingPoint',
        range: this.widthRange,
        units: 'nanometers'
      } );

      // @public (read-only) height of the container, in nm
      this.height = 8.75;

      // @public (read-only) wall thickness, in nm
      this.wallThickness = 0.05;

      // @public (read-only) locations of the container's inside bounds. this.left is dynamic, see ES5 getter
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

      // @public width of the lid, in nm
      this.lidWidthProperty = new NumberProperty( this.widthProperty.value - this.openingLeftInset - this.openingRightInset );

      //TODO add openingRangeProperty

      // @public (read-only) bicycle pump hose is connected to the outside right side of the container
      this.hoseLocation = new Vector2( this.location.x + this.wallThickness, this.location.y + this.height / 2 );

      // @public (read-only) max bounds of the container, when it is expanded to its full width.
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
     * Left edge of the container's inside bounds.
     * @returns {number}
     * @public
     */
    get left() { return this.location.x - this.widthProperty.value; }

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