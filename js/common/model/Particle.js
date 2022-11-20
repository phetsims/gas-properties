// Copyright 2019-2022, University of Colorado Boulder

/**
 * Particle is the model for all types of particles. A particle is a perfect rigid sphere.
 *
 * Since there can be a large number of particles, properties of particles are not implemented as observable
 * Properties.  Instead, the entire particle system is inspected to derive the current state of the system.
 * To optimize performance, all Vector2 fields herein are mutated.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';

export default class Particle {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      mass: GasPropertiesConstants.MASS_RANGE.defaultValue, // AMU
      radius: GasPropertiesConstants.RADIUS_RANGE.defaultValue, // pm
      colorProperty: null, // {Property.<ColorDef>|null}
      highlightColorProperty: null // {Property.<ColorDef>|null} color for specular highlight
    }, options );

    // @public (read-only)
    this.position = new Vector2( 0, 0 ); // center of the particle, pm, MUTATED!
    this.previousPosition = this.position.copy(); // position on previous time step, MUTATED!
    this.velocity = new Vector2( 0, 0 ); // pm/ps, initially at rest, MUTATED!

    // @public these are mutated in the Diffusion screen
    this.mass = options.mass; // AMU
    this.radius = options.radius; // pm

    // @public (read-only) colors are Properties to support ColorProfiles and projector mode
    this.colorProperty = options.colorProperty || new Property( 'white' );
    this.highlightColorProperty = options.highlightColorProperty || new Property( 'white' );

    // @public (read-only)
    this.isDisposed = false;
  }

  /**
   * ES5 getters for particle position.
   * @returns {number}
   * @public
   */
  get left() { return this.position.x - this.radius; }

  get right() { return this.position.x + this.radius; }

  get top() { return this.position.y + this.radius; }

  get bottom() { return this.position.y - this.radius; }

  /**
   * ES5 setters for particle position.
   * @param {number} value
   * @public
   */
  set left( value ) {
    assert && assert( typeof value === 'number', `invalid value: ${value}` );
    this.setPositionXY( value + this.radius, this.position.y );
  }

  set right( value ) {
    assert && assert( typeof value === 'number', `invalid value: ${value}` );
    this.setPositionXY( value - this.radius, this.position.y );
  }

  set top( value ) {
    assert && assert( typeof value === 'number', `invalid value: ${value}` );
    this.setPositionXY( this.position.x, value - this.radius );
  }

  set bottom( value ) {
    assert && assert( typeof value === 'number', `invalid value: ${value}` );
    this.setPositionXY( this.position.x, value + this.radius );
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
   * Disposes this particle.
   * @public
   */
  dispose() {
    assert && assert( !this.isDisposed, 'attempted to dispose again' );
    this.isDisposed = true;
  }

  /**
   * Moves this particle by one time step.
   * @param {number} dt - time delta, in ps
   * @public
   */
  step( dt ) {
    assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );
    assert && assert( !this.isDisposed, 'attempted to step a disposed Particle' );

    this.setPositionXY( this.position.x + dt * this.velocity.x, this.position.y + dt * this.velocity.y );
  }

  /**
   * Sets this particle's position and remembers the previous position.
   * @param {number} x
   * @param {number} y
   * @public
   */
  setPositionXY( x, y ) {
    assert && assert( typeof x === 'number', `invalid x: ${x}` );
    assert && assert( typeof y === 'number', `invalid y: ${y}` );
    this.previousPosition.setXY( this.position.x, this.position.y );
    this.position.setXY( x, y );
  }

  /**
   * Sets this particle's velocity in Cartesian coordinates.
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
   * Sets this particle's velocity in polar coordinates.
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
   * Sets this particle's velocity magnitude (speed).
   * @param {number} magnitude - pm/ps
   * @public
   */
  setVelocityMagnitude( magnitude ) {
    assert && assert( typeof magnitude === 'number' && magnitude >= 0, `invalid magnitude: ${magnitude}` );
    this.velocity.setMagnitude( magnitude );
  }

  /**
   * Scales this particle's velocity. Used when heat/cool is applied.
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
    assert && assert( particle instanceof Particle, 'invalid particle' );
    return this.position.distance( particle.position ) <= ( this.radius + particle.radius );
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
    assert && assert( particle instanceof Particle, 'invalid particle' );
    return this.previousPosition.distance( particle.previousPosition ) <= ( this.radius + particle.radius );
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
    assert && assert( bounds instanceof Bounds2, 'invalid bounds' );

    const minX = ( this.left > bounds.minX ) ? this.left : bounds.minX;
    const minY = ( this.bottom > bounds.minY ) ? this.bottom : bounds.minY;
    const maxX = ( this.right < bounds.maxX ) ? this.right : bounds.maxX;
    const maxY = ( this.top < bounds.maxY ) ? this.top : bounds.maxY;
    return ( maxX - minX ) >= 0 && ( maxY - minY >= 0 );
  }

  /**
   * String representation of this particle. For debugging only, do not rely on format.
   * @returns {string}
   * @public
   */
  toString() {
    return `Particle[position:(${this.position.x},${this.position.y}) mass:${this.mass} radius:${this.radius}]`;
  }
}

gasProperties.register( 'Particle', Particle );