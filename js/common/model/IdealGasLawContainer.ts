// Copyright 2018-2024, University of Colorado Boulder

/**
 * IdealGasLawContainer is the container used in screens that are based on the Ideal Gas Law.
 * This container has a (re)movable lid.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesQueryParameters from '../GasPropertiesQueryParameters.js';
import BaseContainer, { BaseContainerOptions } from './BaseContainer.js';

const NUMBER_OF_DX_SAMPLES = 50;

// If the opening in the top of the container is less than this width, the lid will blow off when pressure in the
// container reaches its maximum threshold. This value was set empirically.
// See https://github.com/phetsims/gas-properties/issues/271
const OPENING_WIDTH_THRESHOLD = 1500;

type SelfOptions = {
  leftWallDoesWork?: boolean;  // true if the left wall does work on particles, as in the Explore screen
};

export type IdealGasLawContainerOptions = SelfOptions & WithRequired<BaseContainerOptions, 'tandem'>;

export default class IdealGasLawContainer extends BaseContainer {

  public readonly leftWallDoesWork: boolean;

  // We will not serialize these sample arrays. It's not important that the running average is stateful, and it will
  // self-correct after NUMBER_OF_DX_SAMPLES.
  private readonly dxSamples: number[]; // changes in the left wall's x-coordinate
  private readonly dtSamples: number[]; // dt values for each sample in dxSamples

  // whether the lid is on the container
  public readonly lidIsOnProperty: TReadOnlyProperty<boolean>;
  private readonly _lidIsOnProperty: Property<boolean>;

  public readonly lidThickness: number; // lid thickness, in pm

  // insets of the opening in the top, from the inside edges of the container, in pm
  public readonly openingLeftInset: number;
  public readonly openingRightInset: number;

  private readonly openingRight: number; // the right coordinate of the opening in the top of the container, in pm
  private readonly minLidWidth: number; // minimum width of the lid, overlaps the left wall, in pm.
  public readonly lidWidthProperty: Property<number>; // width of the lid, in pm

  // Particles enter the container here, on the inside of the container, in pm.
  public readonly particleEntryPosition: Vector2;

  // Desired width of the container, in pm. This is a Property because it needs to be PhET-iO stateful.
  // Set this to impose an animated speed limit on decreasing width.
  // See https://github.com/phetsims/gas-properties/issues/90.
  private readonly desiredWidthProperty: NumberProperty;

  // Previous x position of the left wall. This is a Property because it needs to be PhET-iO stateful.
  private readonly previousLeftProperty: NumberProperty;

  // Is the lid open?
  public readonly lidIsOpenProperty: TReadOnlyProperty<boolean>;

  // Running average of the velocity x-component for the left (movable) wall.
  // See https://github.com/phetsims/gas-properties/issues/220
  public readonly leftWallAverageVelocityXProperty: TReadOnlyProperty<number>;
  public readonly _leftWallAverageVelocityXProperty: NumberProperty;

  // Elapsed time since the wall moved, in ps.
  private dtSinceWallMoved = 0;

  // Speed limit for the container's left movable wall, in pm/ps. Relevant when reducing the container size.
  public static readonly WALL_SPEED_LIMIT = GasPropertiesQueryParameters.wallSpeedLimit;

  public constructor( providedOptions: IdealGasLawContainerOptions ) {

    const options = optionize<IdealGasLawContainerOptions, SelfOptions, BaseContainerOptions>()( {

      // SelfOptions
      leftWallDoesWork: false
    }, providedOptions );

    super( options );

    this.leftWallDoesWork = options.leftWallDoesWork;
    this.dxSamples = [];
    this.dtSamples = [];

    this._lidIsOnProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'lidIsOnProperty' ),
      phetioReadOnly: true, // derived from state of the particle system
      phetioFeatured: true,
      phetioDocumentation: 'Indicates whether the lid is on the container, or has been blown off.'
    } );
    this.lidIsOnProperty = this._lidIsOnProperty;

    this.lidThickness = 175;

    this.openingLeftInset = 1250;
    this.openingRightInset = 2000;
    assert && assert( this.widthRange.min > this.openingLeftInset + this.openingRightInset,
      'widthRange.min is too small to accommodate insets' );

    this.openingRight = this.position.y - this.openingRightInset;

    this.minLidWidth = this.openingLeftInset + this.wallThickness;

    this.lidWidthProperty = new NumberProperty( this.getMaxLidWidth(), {

      // range changes dynamically with width of container
      isValidValue: value => ( value >= this.minLidWidth && value <= this.getMaxLidWidth() ),
      units: 'pm',
      tandem: options.tandem.createTandem( 'lidWidthProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true, // because the range is dynamic and the sim sets this
      phetioDocumentation: 'The width of the container\'s lid.'
    } );

    this.particleEntryPosition = new Vector2( this.position.x, this.position.y + this.height / 5 );

    this.desiredWidthProperty = new NumberProperty( this.widthProperty.value, {
      units: 'pm',
      tandem: this.isFixedWidth ? Tandem.OPT_OUT : options.tandem.createTandem( 'desiredWidthProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only.'
    } );

    this.previousLeftProperty = new NumberProperty( this.left, {
      units: 'pm',
      tandem: this.isFixedWidth ? Tandem.OPT_OUT : options.tandem.createTandem( 'previousLeftProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only.'
    } );

    this.lidIsOpenProperty = new DerivedProperty(
      [ this.lidIsOnProperty, this.lidWidthProperty ],
      ( lidIsOn, lidWidth ) => !lidIsOn || ( lidWidth < this.getMaxLidWidth() ), {
        tandem: options.tandem.createTandem( 'lidIsOpenProperty' ),
        phetioFeatured: true,
        phetioValueType: BooleanIO,
        phetioDocumentation: 'Whether the container\'s lid is open.'
      } );

    this._leftWallAverageVelocityXProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'leftWallAverageVelocityXProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only.'
    } );
    this.leftWallAverageVelocityXProperty = this._leftWallAverageVelocityXProperty;
  }

  public override reset(): void {
    super.reset();
    this._lidIsOnProperty.reset();
    this.lidWidthProperty.reset();
    this.desiredWidthProperty.reset();
    this.previousLeftProperty.reset();
    this.dxSamples.length = 0;
    this.dtSamples.length = 0;
    this._leftWallAverageVelocityXProperty.reset();
    this.dtSinceWallMoved = 0;
  }

  /**
   * Animates the container's width one step towards desiredWidthProperty. Computes wall velocity if the wall does work.
   * @param dt - time delta, in ps
   */
  public step( dt: number ): void {
    assert && assert( dt > 0, `invalid dt: ${dt}` );

    const widthDifference = this.desiredWidthProperty.value - this.widthProperty.value;

    if ( widthDifference !== 0 ) {

      // Default is to move the entire distance in one step.
      let newWidth = this.desiredWidthProperty.value;

      // If the left wall does work (as in the Explore screen), limit the wall's speed and thus how much the
      // width changes per time step. The speed limit prevents the lid from blowing off too easily.
      // See https://github.com/phetsims/gas-properties/issues/90.
      if ( this.leftWallDoesWork ) {

        const widthStep = dt * IdealGasLawContainer.WALL_SPEED_LIMIT;

        if ( widthStep < Math.abs( widthDifference ) ) {
          if ( widthDifference > 0 ) {
            newWidth = this.widthProperty.value + widthStep;
          }
          else {
            newWidth = this.widthProperty.value - widthStep;
          }
        }
      }

      this.setWidth( newWidth );
    }

    // Compute the velocity of the left (movable) wall.  If the wall does not do work on particles, the wall
    // velocity is irrelevant and should remain set to zero, so that it doesn't contribute to collision detection.
    if ( this.leftWallDoesWork ) {

      const dx = ( this.left - this.previousLeftProperty.value );
      const velocityX = dx / dt;

      this.setLeftWallVelocityX( velocityX );
      this.previousLeftProperty.value = this.left;

      if ( dx === 0 ) {
        this.dtSinceWallMoved += dt;
      }
      else {
        this.dtSinceWallMoved = 0;
      }

      // Tuned so that the vector behaves smoothly while dragging the resize handle, but disappears quickly after dragging ends.
      if ( this.dtSinceWallMoved >= 0.75 ) {

        // The wall has not moved, so immediately set the running average to zero.
        this.dxSamples.length = 0;
        this.dtSamples.length = 0;
        this._leftWallAverageVelocityXProperty.value = 0;
      }
      else {

        // Process the current sample.
        this.dxSamples.push( dx );
        this.dtSamples.push( dt );

        // Drop the oldest sample.
        if ( this.dxSamples.length > NUMBER_OF_DX_SAMPLES ) {
          this.dxSamples.shift();
          this.dtSamples.shift();
        }
        assert && assert( this.dxSamples.length === this.dtSamples.length, 'Sample arrays should have the same length.' );

        // Update the running average.
        const dxAverage = _.sum( this.dxSamples ) / this.dxSamples.length;
        const dtAverage = _.sum( this.dtSamples ) / this.dtSamples.length;
        this._leftWallAverageVelocityXProperty.value = dxAverage / dtAverage;
      }
    }
    else {
      assert && assert( this.getLeftWallVelocityX() === 0, 'wall velocity should be zero' );
    }
  }

  /**
   * Resizes the container to the specified width.
   * Maintains a constant opening size in the top of the container, if possible.
   */
  private setWidth( width: number ): void {
    if ( width !== this.widthProperty.value ) {
      assert && assert( this.widthRange.contains( width ), `width is out of range: ${width}` );

      // Get opening width before changing widthProperty
      const openingWidth = this.getOpeningWidth();

      // resize the container
      this.widthProperty.value = width;

      // resize the lid if it's on the container, maintaining the opening width if possible
      if ( this.lidIsOnProperty.value ) {
        this.lidWidthProperty.value = Math.max( this.getMaxLidWidth() - openingWidth, this.minLidWidth );
      }
    }
  }

  /**
   * Sets the desired width of the container.
   */
  public setDesiredWidth( desiredWidth: number ): void {
    this.desiredWidthProperty.value = desiredWidth;
  }

  /**
   * Resizes the container immediately to the specified width.
   */
  public resizeImmediately( width: number ): void {
    assert && assert( this.widthRange.contains( width ), `width is out of range: ${width}` );
    this.setWidth( width );
    this.desiredWidthProperty.value = width;
  }

  /**
   * Gets the minimum lid width, in pm. This is constant, independent of the container width.
   */
  public getMinLidWidth(): number {
    return this.minLidWidth;
  }

  /**
   * Gets the maximum lid width, in pm, when the lid is fully closed. This changes dynamically with the container width.
   */
  public getMaxLidWidth(): number {
    return this.widthProperty.value - this.openingRightInset + this.wallThickness;
  }

  /**
   * Gets the left coordinate of the opening in the top of the container, in pm.
   */
  public getOpeningLeft(): number {

    let openingLeft = null;

    if ( this.lidIsOnProperty.value ) {
      openingLeft = this.left - this.wallThickness + this.lidWidthProperty.value;

      // Round to nearest pm to avoid floating-point error, see https://github.com/phetsims/gas-properties/issues/63
      openingLeft = Utils.roundSymmetric( openingLeft );
    }
    else {
      openingLeft = this.left + this.openingLeftInset;
    }
    assert && assert( openingLeft <= this.getOpeningRight(),
      `openingLeft ${openingLeft} must be <= openingRight ${this.getOpeningRight()}, lidIsOn=${this.lidIsOnProperty.value}` );

    return openingLeft;
  }

  /**
   * Gets the right coordinate of the opening in the top of the container, in pm.
   */
  public getOpeningRight(): number {
    return this.openingRight;
  }

  /**
   * Gets the width of the opening in the top of the container, in pm.
   */
  public getOpeningWidth(): number {
    const openingWidth = this.getOpeningRight() - this.getOpeningLeft();
    assert && assert( openingWidth >= 0, `invalid openingWidth: ${openingWidth}` );
    return openingWidth;
  }

  /**
   * Blows the lid off of the container if the container is closed, or the opening is small enough
   * to compromise the structural integrity of the container.
   * See https://github.com/phetsims/gas-properties/issues/271.
   */
  public blowLidOff(): void {
    if ( !this.lidIsOpenProperty.value || this.getOpeningWidth() < OPENING_WIDTH_THRESHOLD ) {
      this._lidIsOnProperty.value = false;
    }
  }

  /**
   * Returns the lid to the container.
   */
  public returnLid(): void {
    this._lidIsOnProperty.value = true;
  }
}

gasProperties.register( 'IdealGasLawContainer', IdealGasLawContainer );