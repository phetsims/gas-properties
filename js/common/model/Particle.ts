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
import optionize from '../../../../phet-core/js/optionize.js';
import { ProfileColorProperty } from '../../../../scenery/js/imports.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';

type SelfOptions = {
  mass?: number; // AMU
  radius?: number; // pm
  colorProperty: ProfileColorProperty;
  highlightColorProperty: ProfileColorProperty; // color for specular highlight
};

export type ParticleOptions = SelfOptions;

export default class Particle {

  // these are mutated in the Diffusion screen
  public mass: number; // AMU
  public radius: number; // pm

  public readonly colorProperty: ProfileColorProperty;
  public readonly highlightColorProperty: ProfileColorProperty;

  public readonly position: Vector2; // center of the particle, pm, MUTATED!
  public readonly previousPosition: Vector2; // position on previous time step, MUTATED!
  public readonly velocity: Vector2; // pm/ps, initially at rest, MUTATED!

  private _isDisposed: boolean;

  public constructor( providedOptions?: ParticleOptions ) {

    const options = optionize<ParticleOptions, SelfOptions>()( {

      // SelfOptions
      mass: GasPropertiesConstants.MASS_RANGE.defaultValue,
      radius: GasPropertiesConstants.RADIUS_RANGE.defaultValue
    }, providedOptions );

    this.mass = options.mass;
    this.radius = options.radius;
    this.colorProperty = options.colorProperty || new Property( 'white' );
    this.highlightColorProperty = options.highlightColorProperty || new Property( 'white' );

    this.position = new Vector2( 0, 0 );
    this.previousPosition = this.position.copy();
    this.velocity = new Vector2( 0, 0 );

    this._isDisposed = false;
  }

  public dispose(): void {
    assert && assert( !this._isDisposed, 'attempted to dispose again' );
    this._isDisposed = true;
  }

  public get isDisposed(): boolean {
    return this._isDisposed;
  }

  /**
   * ES5 getters and setters for particle position.
   */
  public get left(): number { return this.position.x - this.radius; }

  public set left( value: number ) {
    this.setPositionXY( value + this.radius, this.position.y );
  }

  public get right(): number { return this.position.x + this.radius; }

  public set right( value: number ) {
    this.setPositionXY( value - this.radius, this.position.y );
  }

  public get top(): number { return this.position.y + this.radius; }

  public set top( value: number ) {
    this.setPositionXY( this.position.x, value - this.radius );
  }

  public get bottom(): number { return this.position.y - this.radius; }

  public set bottom( value: number ) {
    this.setPositionXY( this.position.x, value + this.radius );
  }

  /**
   * Gets the kinetic energy of this particle.
   * @returns AMU * pm^2 / ps^2
   */
  public getKineticEnergy(): number {
    return 0.5 * this.mass * this.velocity.magnitudeSquared; // KE = (1/2) * m * |v|^2
  }

  /**
   * Moves this particle by one time step.
   * @param dt - time delta, in ps
   */
  public step( dt: number ): void {
    assert && assert( dt > 0, `invalid dt: ${dt}` );
    assert && assert( !this._isDisposed, 'attempted to step a disposed Particle' );

    this.setPositionXY( this.position.x + dt * this.velocity.x, this.position.y + dt * this.velocity.y );
  }

  /**
   * Sets this particle's position and remembers the previous position.
   */
  public setPositionXY( x: number, y: number ): void {
    this.previousPosition.setXY( this.position.x, this.position.y );
    this.position.setXY( x, y );
  }

  /**
   * Sets this particle's velocity in Cartesian coordinates.
   */
  public setVelocityXY( x: number, y: number ): void {
    this.velocity.setXY( x, y );
  }

  /**
   * Sets this particle's velocity in polar coordinates.
   * @param magnitude - pm / ps
   * @param angle - in radians
   */
  public setVelocityPolar( magnitude: number, angle: number ): void {
    assert && assert( magnitude >= 0, `invalid magnitude: ${magnitude}` );
    this.setVelocityXY( magnitude * Math.cos( angle ), magnitude * Math.sin( angle ) );
  }

  /**
   * Sets this particle's velocity magnitude (speed).
   * @param magnitude - pm/ps
   */
  public setVelocityMagnitude( magnitude: number ): void {
    assert && assert( magnitude >= 0, `invalid magnitude: ${magnitude}` );
    this.velocity.setMagnitude( magnitude );
  }

  /**
   * Scales this particle's velocity. Used when heat/cool is applied.
   */
  public scaleVelocity( scale: number ): void {
    assert && assert( scale > 0, `invalid scale: ${scale}` );
    this.velocity.multiply( scale );
  }

  /**
   * Does this particle contact another particle now?
   */
  public contactsParticle( particle: Particle ): boolean {
    return this.position.distance( particle.position ) <= ( this.radius + particle.radius );
  }

  /**
   * Did this particle contact another particle on the previous time step? Prevents collections of particles
   * that are emitted from the pump from colliding until they spread out.  This was borrowed from the Java
   * implementation, and makes the collision behavior more natural looking.
   */
  public contactedParticle( particle: Particle ): boolean {
    return this.previousPosition.distance( particle.previousPosition ) <= ( this.radius + particle.radius );
  }

  /**
   * Does this particle intersect the specified bounds, including edges? This implementation was adapted
   * from Bounds2.intersectsBounds, removed Math.max and Math.min calls because this will be called thousands
   * of times per step.
   */
  public intersectsBounds( bounds: Bounds2 ): boolean {
    const minX = ( this.left > bounds.minX ) ? this.left : bounds.minX;
    const minY = ( this.bottom > bounds.minY ) ? this.bottom : bounds.minY;
    const maxX = ( this.right < bounds.maxX ) ? this.right : bounds.maxX;
    const maxY = ( this.top < bounds.maxY ) ? this.top : bounds.maxY;
    return ( maxX - minX ) >= 0 && ( maxY - minY >= 0 );
  }

  /**
   * String representation of this particle. For debugging only, do not rely on format.
   */
  public toString(): string {
    return `Particle[position:(${this.position.x},${this.position.y}) mass:${this.mass} radius:${this.radius}]`;
  }
}

gasProperties.register( 'Particle', Particle );