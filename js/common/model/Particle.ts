// Copyright 2019-2024, University of Colorado Boulder

//TODO https://github.com/phetsims/gas-properties/issues/77 PhET-iO instrumentation?
/**
 * Particle is the model for all types of particles. A particle is a perfect rigid sphere.
 *
 * Since there can be a large number of particles, properties of particles are not implemented as observable
 * Properties.  Instead, the entire particle system is inspected to derive the current state of the system.
 * To optimize performance, all Vector2 fields herein are mutated.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import { ProfileColorProperty } from '../../../../scenery/js/imports.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesUtils from '../GasPropertiesUtils.js';

type SelfOptions = {
  mass: number; // AMU
  radius: number; // pm
  colorProperty: ProfileColorProperty;
  highlightColorProperty: ProfileColorProperty; // color for specular highlight
};

export type ParticleOptions = SelfOptions;

export default class Particle {

  // these are mutated in the Diffusion screen
  public mass: number; // AMU
  public radius: number; // pm

  //TODO https://github.com/phetsims/gas-properties/issues/218 Can these be moved elsewhere?
  public readonly colorProperty: ProfileColorProperty;
  public readonly highlightColorProperty: ProfileColorProperty;

  // (x,y) position of the particle, at the center of the particle
  private _x: number;
  private _y: number;

  // Position on the previous time step
  private _previousX: number;
  private _previousY: number;

  // Velocity vector components, pm/ps, initially at rest
  private _vx;
  private _vy;

  private _isDisposed: boolean;

  protected constructor( providedOptions: ParticleOptions ) {

    this.mass = providedOptions.mass;
    this.radius = providedOptions.radius;

    this.colorProperty = providedOptions.colorProperty;
    this.highlightColorProperty = providedOptions.highlightColorProperty;

    this._x = 0;
    this._y = 0;

    this._previousX = 0;
    this._previousY = 0;

    this._vx = 0;
    this._vy = 0;

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

  public get x(): number { return this._x; }

  public get y(): number { return this._y; }

  public get previousX(): number { return this._previousX; }

  public get previousY(): number { return this._previousY; }

  public get left(): number { return this._x - this.radius; }

  public set left( value: number ) {
    this.setXY( value + this.radius, this._y );
  }

  public get right(): number { return this._x + this.radius; }

  public set right( value: number ) {
    this.setXY( value - this.radius, this._y );
  }

  public get top(): number { return this._y + this.radius; }

  public set top( value: number ) {
    this.setXY( this._x, value - this.radius );
  }

  public get bottom(): number { return this._y - this.radius; }

  public set bottom( value: number ) {
    this.setXY( this._x, value + this.radius );
  }

  /**
   * ES5 getters for particle velocity.
   */

  public get vx(): number { return this._vx; }

  public get vy(): number { return this._vy; }

  /**
   * Gets the particle's speed, the velocity magnitude, in pm/ps.
   */
  public get speed(): number {
    return Math.sqrt( this._vx * this._vx + this._vy * this._vy );
  }

  /**
   * Gets the kinetic energy of this particle, in AMU * pm^2 / ps^2.
   */
  public getKineticEnergy(): number {
    return 0.5 * this.mass * this.speed * this.speed; // KE = (1/2) * m * |v|^2
  }

  /**
   * Moves this particle by one time step.
   * @param dt - time delta, in ps
   */
  public step( dt: number ): void {
    assert && assert( dt > 0, `invalid dt: ${dt}` );
    assert && assert( !this._isDisposed, 'attempted to step a disposed Particle' );

    this.setXY( this._x + dt * this._vx, this._y + dt * this._vy );
  }

  /**
   * Sets this particle's xy position and remembers the previous xy position.
   */
  public setXY( x: number, y: number ): void {
    this._previousX = this._x;
    this._previousY = this._y;
    this._x = x;
    this._y = y;
  }

  /**
   * Sets this particle's x position and remembers the previous x position.
   */
  public setX( x: number ): void {
    this.setXY( x, this._y );
  }

  /**
   * Sets this particle's velocity in Cartesian coordinates.
   */
  public setVelocityXY( vx: number, vy: number ): void {
    this._vx = vx;
    this._vy = vy;
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
   * Sets this particle's speed (velocity magnitude).
   */
  public setSpeed( speed: number ): void {
    assert && assert( speed >= 0, `invalid magnitude: ${speed}` );
    this.scaleVelocity( speed / this.speed );
  }

  /**
   * Scales this particle's velocity. Used when heat/cool is applied.
   */
  public scaleVelocity( scale: number ): void {
    assert && assert( scale > 0, `invalid scale: ${scale}` );
    this._vx *= scale;
    this._vy *= scale;
  }

  /**
   * Does this particle contact another particle now?
   */
  public contactsParticle( particle: Particle ): boolean {
    return this.distance( particle ) <= ( this.radius + particle.radius );
  }

  /**
   * Did this particle contact another particle on the previous time step? Prevents collections of particles
   * that are emitted from the pump from colliding until they spread out.  This was borrowed from the Java
   * implementation, and makes the collision behavior more natural looking.
   */
  public contactedParticle( particle: Particle ): boolean {
    return this.previousDistance( particle ) <= ( this.radius + particle.radius );
  }

  /**
   * Distance to some other particle, in pm.
   */
  public distance( particle: Particle ): number {
    return GasPropertiesUtils.distanceXY( this._x, this._y, particle.x, particle.y );
  }

  /**
   * Previous distance to some other particle, in pm.
   */
  private previousDistance( particle: Particle ): number {
    return GasPropertiesUtils.distanceXY( this._previousX, this._previousY, particle.previousX, particle.previousY );
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
    return `Particle[position:(${this._x},${this._y}) mass:${this.mass} radius:${this.radius}]`;
  }
}

gasProperties.register( 'Particle', Particle );