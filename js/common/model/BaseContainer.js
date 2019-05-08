// Copyright 2018-2019, University of Colorado Boulder

/**
 * Base class for containers in all screens.
 * This is a rectangular container for particles, with fixed location, fixed height and depth, and mutable width.
 * The origin is at the bottom-right corner, and width expands to the left.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const RangeWithValue = require( 'DOT/RangeWithValue' );
  const Vector2 = require( 'DOT/Vector2' );

  class BaseContainer {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = _.extend( {
        location: Vector2.ZERO, // location of the container's bottom right corner, in pm
        widthRange: new RangeWithValue( 5000, 15000, 10000 ) // range and initial value of the container's width, in pm
      }, options );

      assert && assert( options.location instanceof Vector2, 'invalid location type: ' + options.location );
      assert && assert( options.widthRange instanceof RangeWithValue, 'invalid widthRange type: ' + options.widthRange );

      // @public (read-only)
      this.location = options.location;
      this.widthRange = options.widthRange;

      // @public width of the container, in pm
      this.widthProperty = new NumberProperty( this.widthRange.defaultValue, {
        range: this.widthRange,
        units: 'pm'
      } );

      // @public (read-only) height of the container, in pm
      this.height = 8750;

      // @private (read-only) depth of the container, in pm
      this.depth = GasPropertiesQueryParameters.containerDepth;

      // @public (read-only) wall thickness, in pm
      this.wallThickness = 50;

      // @public (read-only) inside bounds, in pm
      this.boundsProperty = new DerivedProperty( [ this.widthProperty ],
        width => new Bounds2(
          this.location.x - width, this.location.y,
          this.location.x, this.location.y + this.height
        ) );
    }

    // @public
    reset() {
      this.widthProperty.reset();
    }

    /**
     * Convenience getter for width.
     * @returns {number} in pm
     */
    get width() { return this.widthProperty.value; }

    /**
     * Convenience getter for bounds.
     * @returns {Bounds2} in pm
     */
    get bounds() { return this.boundsProperty.value; }

    /**
     * Convenience getters for inner bounds of the container, in model coordinate frame.
     * Bounds2 has similar getters, but uses view coordinate frame, where 'top' is minY and 'bottom' is maxY.
     * @returns {number} in pm
     * @public
     */
    get left() { return this.bounds.minX; }

    get right() { return this.bounds.maxX; }

    get bottom() { return this.bounds.minY; }

    get top() { return this.bounds.maxY; }

    /**
     * Gets the volume of the container.
     * @returns {number} in pm^3
     */
    get volume() { return this.widthProperty.value * this.height * this.depth; }

    /**
     * Determines whether the container fully contains a particle.
     * @param {Particle} particle
     * @returns {boolean}
     * @public
     */
    containsParticle( particle ) {
      return particle.left >= this.bounds.minX &&
             particle.right <= this.bounds.maxX &&
             particle.bottom >= this.bounds.minY &&
             particle.top <= this.bounds.maxY;
    }
  }

  return gasProperties.register( 'BaseContainer', BaseContainer );
} );