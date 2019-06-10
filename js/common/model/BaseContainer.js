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
  const Particle = require( 'GAS_PROPERTIES/common/model/Particle' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const RangeWithValue = require( 'DOT/RangeWithValue' );
  const Vector2 = require( 'DOT/Vector2' );

  class BaseContainer {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = _.extend( {

        // location of the container's bottom right corner, in pm
        location: Vector2.ZERO,

        // range and initial value of the container's width, in pm
        widthRange: new RangeWithValue( 5000, 15000, 10000 ),

        // true if the left wall does work on particles, as in the Explore screen
        leftWallDoesWork: false
      }, options );

      assert && assert( options.location instanceof Vector2,
        'invalid location type: ' + options.location );
      assert && assert( options.widthRange instanceof RangeWithValue,
        'invalid widthRange type: ' + options.widthRange );

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
      this.depth = 4000;

      // @public (read-only) wall thickness, in pm
      this.wallThickness = 75;

      // @public inside bounds, in pm
      this.boundsProperty = new DerivedProperty( [ this.widthProperty ],
        width => new Bounds2(
          this.location.x - width, this.location.y,
          this.location.x, this.location.y + this.height
        ), {
        valueType: Bounds2
        } );

      // @public (read-only) maximum inside bounds, in pm.  Used for sizing CanvasNode.
      this.maxBounds = new Bounds2(
        this.location.x - this.widthRange.max, this.location.y,
        this.location.x, this.location.y + this.height
      );

      // @public (read-only) velocity of the left (movable) wall, pm/ps. This vector will be MUTATED!
      this.leftWallVelocity = new Vector2( 0, 0 );

      // @public (read-only) whether the left wall does work on particles
      this.leftWallDoesWork = options.leftWallDoesWork;

      // @private {number} previous location of the left wall
      this.previousLeft = this.left;
    }

    /**
     * Resets the container.
     * @public
     */
    reset() {
      this.widthProperty.reset();
    }

    /**
     * Steps the container.
     * @param {number} dt - the time step, in ps
     * @public
     */
    step( dt ) {
      assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );
      assert && assert( !( !this.leftWallDoesWork && this.leftWallVelocity.magnitude !== 0 ),
        'if wall does not do work, then its velocity should be zero' );

      // Compute the velocity of the left (movable) wall.  If the wall does not do work on particles, the wall
      // velocity is irrelevant and should remain set to zero, so that it doesn't contribute to collision detection.
      if ( this.leftWallDoesWork ) {

        const previousX = this.leftWallVelocity.x;
        const x = ( this.left - this.previousLeft ) / dt;
        if ( x !== previousX ) {
          this.leftWallVelocity.setXY( x, 0 );
        }

        this.previousLeft = this.left;
      }
    }

    /**
     * Convenience getter for width.
     * @returns {number} in pm
     * @public
     */
    get width() { return this.widthProperty.value; }

    /**
     * Convenience getter for inside bounds.
     * @returns {Bounds2} in pm
     * @public
     */
    get bounds() { return this.boundsProperty.value; }

    /**
     * Convenience getters for inside bounds of the container, in model coordinate frame.
     * Bounds2 has similar getters, but uses a view coordinate frame, where 'top' is minY and 'bottom' is maxY.
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
     * @public
     */
    getVolume() { return this.widthProperty.value * this.height * this.depth; }

    /**
     * Determines whether the container fully contains a particle.
     * @param {Particle} particle
     * @returns {boolean}
     * @public
     */
    containsParticle( particle ) {
      assert  && assert( particle instanceof Particle, `invalid particle: ${particle}` );
      
      return particle.left >= this.bounds.minX &&
             particle.right <= this.bounds.maxX &&
             particle.bottom >= this.bounds.minY &&
             particle.top <= this.bounds.maxY;
    }

    /**
     * Determines whether the container fully contains one or more collections of particles.
     * @param {Particle[][]} particleArrays
     * @returns {boolean}
     */
    containsParticles( particleArrays ) {
      assert  && assert( Array.isArray( particleArrays ), `invalid particlesArray: ${particleArrays}` );

      for ( let i = 0; i < particleArrays.length; i++ ) {
        const particles = particleArrays[ i ];
        for ( let j = 0; j < particles.length; j++ ) {
          const particle = particles[ j ];
          if ( !this.containsParticle( particle ) ) {
            return false;
          }
        }
      }
      return true;
    }
  }

  return gasProperties.register( 'BaseContainer', BaseContainer );
} );