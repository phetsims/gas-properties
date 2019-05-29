// Copyright 2019, University of Colorado Boulder

/**
 * Model for all types of particles. A particle is a perfect sphere.
 * NOTE: Since there can be a large number of Particles, all Vector2 fields herein are mutated for performance reasons.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const Property = require( 'AXON/Property' );
  const Vector2 = require( 'DOT/Vector2' );

  class Particle {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = _.extend( {
        mass: 1, // AMU
        radius: 100, // pm
        colorProperty: null, // {Property.<ColorDef>|null}
        highlightColorProperty: null // {Property.<ColorDef>|null} color for specular highlight
      }, options );

      // @public (read-only)
      this.location = new Vector2( 0, 0 ); // center of the particle, pm, MUTATED!
      this.previousLocation = this.location.copy(); // location on previous time step, MUTATED!
      this.velocity = new Vector2( 0, 0 ); // pm/ps, initially at rest, MUTATED!

      // @public these are mutated in the Diffusion screen
      this.mass = options.mass; // AMU
      this.radius = options.radius; // radians

      // @public (read-only)
      this.colorProperty = options.colorProperty || new Property( 'white' );
      this.highlightColorProperty = options.highlightColorProperty || new Property( 'white' );

      // @public (read-only)
      this.isDisposed = false;
    }

    /**
     * ES5 getters for particle location.
     * @returns {number}
     * @public
     */
    get left() { return this.location.x - this.radius; }

    get right() { return this.location.x + this.radius; }

    get top() { return this.location.y + this.radius; }

    get bottom() { return this.location.y - this.radius; }

    /**
     * ES5 setters for particle location.
     * @param {number} value
     * @public
     */
    set left( value ) {
      assert && assert( typeof value === 'number', `invalid value: ${value}` );
      this.setLocationXY( value + this.radius, this.location.y );
    }

    set right( value ) {
      assert && assert( typeof value === 'number', `invalid value: ${value}` );
      this.setLocationXY( value - this.radius, this.location.y );
    }

    set top( value ) {
      assert && assert( typeof value === 'number', `invalid value: ${value}` );
      this.setLocationXY( this.location.x, value - this.radius );
    }

    set bottom( value ) {
      assert && assert( typeof value === 'number', `invalid value: ${value}` );
      this.setLocationXY( this.location.x, value + this.radius );
    }

    /**
     * Gets the kinetic energy of this particle.
     * @returns {number} AMU * pm^2 / ps^2
     * @public
     */
    getKineticEnergy() {
      return 0.5 * this.mass * this.velocity.magnitudeSquared; // KE = (1/2) * m * |v|^2
    }

    /**
     * Disposes the particle.
     * @public
     */
    dispose() {
      assert && assert( !this.isDisposed, 'attempted to dispose again' );
      this.isDisposed = true;
    }

    /**
     * Moves the particle by one time step.
     * @param {number} dt - time delta, in ps
     * @public
     */
    step( dt ) {
      assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );
      assert && assert( !this.isDisposed, 'attempted to step a disposed Particle' );

      this.setLocationXY( this.location.x + dt * this.velocity.x, this.location.y + dt * this.velocity.y );
    }

    /**
     * Sets the location and remembers the previous location.
     * @param {number} x
     * @param {number} y
     * @public
     */
    setLocationXY( x, y ) {
      assert && assert( typeof x === 'number', `invalid x: ${x}` );
      assert && assert( typeof y === 'number', `invalid y: ${y}` );
      this.previousLocation.setXY( this.location.x, this.location.y );
      this.location.setXY( x, y );
    }

    /**
     * Sets the velocity in Cartesian coordinates.
     * As a side effect, updates everything that is a function of velocity.
     * @param {number} x
     * @param {number} y
     * @public
     */
    setVelocityXY( x, y ) {
      assert && assert( typeof x === 'number', `invalid x: ${x}` );
      assert && assert( typeof y === 'number', `invalid y: ${y}` );
      this.velocity.setXY( x, y );
    }

    /**
     * Sets the velocity in polar coordinates.
     * As a side effect, updates everything that is a function of velocity.
     * @param {number} magnitude - pm / ps
     * @param {number} angle - in radians
     * @public
     */
    setVelocityPolar( magnitude, angle ) {
      assert && assert( typeof magnitude === 'number' && magnitude >= 0, `invalid magnitude: ${magnitude}` );
      assert && assert( typeof angle === 'number', `invalid angle: ${angle}` );
      this.setVelocityXY( magnitude * Math.cos( angle ), magnitude * Math.sin( angle ) );
    }

    /**
     * Sets the velocity magnitude.
     * @param {number} magnitude
     * @public
     */
    setVelocityMagnitude( magnitude ) {
      assert && assert( typeof magnitude === 'number' && magnitude >= 0, `invalid magnitude: ${magnitude}` );
      this.velocity.setMagnitude( magnitude );
    }

    /**
     * Scales the velocity. Used when heat/cool is applied.
     * @param {number} scale
     * @public
     */
    scaleVelocity( scale ) {
      assert && assert( typeof scale === 'number' && scale > 0, `invalid scale: ${scale}` );
      this.velocity.multiply( scale );
    }

    /**
     * Does this particle contact another particle now?
     * @param {Particle} particle
     * @returns {boolean}
     * @public
     */
    contactsParticle( particle ) {
      assert && assert( particle instanceof Particle, `invalid particle: ${particle}` );
      return this.location.distance( particle.location ) <= ( this.radius + particle.radius );
    }

    /**
     * Did this particle contact another particle on the previous time step? Prevents collections of particles
     * that are emitted from the pump from colliding until they spread out.  This was borrowed from the Java
     * implementation, and makes the collision behavior more natural looking.
     * @param {Particle} particle
     * @returns {boolean}
     * @public
     */
    contactedParticle( particle ) {
      assert && assert( particle instanceof Particle, `invalid particle: ${particle}` );
      return this.previousLocation.distance( particle.previousLocation ) <= ( this.radius + particle.radius );
    }

    /**
     * Does this particle intersect the specified bounds, including edges? This implementation was adapted
     * from Bounds2.intersectsBounds, removed Math.max and Math.min calls because this will be called thousands
     * of times per step.
     * @param {Bounds2} bounds
     * @returns {boolean}
     * @public
     */
    intersectsBounds( bounds ) {
      assert && assert( bounds instanceof Bounds2, `invalid bounds: ${bounds}` );

      const minX = ( this.left > bounds.minX ) ? this.left : bounds.minX;
      const minY = ( this.bottom > bounds.minY ) ? this.bottom : bounds.minY;
      const maxX = ( this.right < bounds.maxX ) ? this.right : bounds.maxX;
      const maxY = ( this.top < bounds.maxY ) ? this.top : bounds.maxY;
      return ( maxX - minX ) >= 0 && ( maxY - minY >= 0 );
    }

    /**
     * String representation of a Particle. For debugging only, do not rely on format.
     * @returns {string}
     * @public
     */
    toString() {
      return `Particle[location:(${this.location.x},${this.location.y}) mass:${this.mass} radius:${this.radius}]`;
    }
  }

  return gasProperties.register( 'Particle', Particle );
} );