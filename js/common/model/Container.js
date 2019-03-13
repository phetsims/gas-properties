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
  const Vector2 = require( 'DOT/Vector2' );

  class Container {

    constructor() {

      // @public (read-only) location of the container's bottom right corner, in nm
      this.location = Vector2.ZERO;

      // @public (read-only) height of the container, in nm
      this.height = 8.75;

      // @public (read-only) this.left is dynamic, see ES5 getter
      this.right = this.location.x;
      this.top = this.location.y + this.height;
      this.bottom = this.location.y;

      // @public (read-only) range of the container's width, in nm
      this.widthRange = new RangeWithValue( 5, 15, 10 );

      // @public width of the container, in nm
      this.widthProperty = new NumberProperty( this.widthRange.defaultValue, {
        numberType: 'FloatingPoint',
        range: this.widthRange,
        units: 'nanometers'
      } );
      this.widthProperty.link( width => {
        phet.log && phet.log( `Container width:${width}nm` );
      } );

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
      assert && assert( this.openingXOffset > 0, `invalid openingXOffset: ${this.openingXOffset}` );
      assert && assert( this.widthRange.min - this.openingWidthRange.max - this.openingXOffset  > 0,
        'opening extends beyond the top of the container' );

      // @public (read-only) bicycle pump hose is connected to the right side of the container
      this.hoseLocation = new Vector2( this.location.x, this.location.y + this.height / 2 );

      // @public (read-only) max bounds of the container, when it is expanded to its full width.
      this.maxBounds = new Bounds2(
        this.location.x - this.widthRange.max, this.location.y,
        this.location.x, this.location.y + this.height
      );
    }

    // @public
    reset() {
      this.widthProperty.reset();
      this.openingWidthProperty.reset();
    }

    /**
     * Left edge of the container's bounds.
     * @returns {number}
     * @public
     */
    get left() { return this.location.x - this.widthProperty.value; }

    /**
     * Gets the min x coordinate of the opening in the top of the container.
     * @returns number
     * @public
     */
    get openingMinX() { return this.openingMaxX - this.openingWidthRange.max; }

    /**
     * Gets the max x coordinate of the opening in the top of the container.
     * @returns number
     * @public
     */
    get openingMaxX() { return this.location.x - this.openingXOffset; }

    /**
     * Determines whether the container surrounds a particle on all sides. Accounts for the particle's radius.
     * @param {Particle} particle
     * @returns {boolean}
     * @public
     */
    enclosesParticle( particle ) {
      return particle.left >= this.left &&
             particle.right <= this.right &&
             particle.top <= this.top &&
             particle.bottom >= this.bottom;
    }
  }

  return gasProperties.register( 'Container', Container );
} );