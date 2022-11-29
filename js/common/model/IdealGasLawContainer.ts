// Copyright 2018-2022, University of Colorado Boulder

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
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesQueryParameters from '../GasPropertiesQueryParameters.js';
import BaseContainer, { BaseContainerOptions } from './BaseContainer.js';

// constants

// Speed limit for the container's left movable wall, in pm/ps. Relevant when reducing the container size.
const WALL_SPEED_LIMIT = GasPropertiesQueryParameters.wallSpeedLimit;

type SelfOptions = {
  leftWallDoesWork?: boolean;  // true if the left wall does work on particles, as in the Explore screen
};

type IdealGasLawContainerOptions = SelfOptions & PickRequired<BaseContainerOptions, 'tandem'>;

export default class IdealGasLawContainer extends BaseContainer {

  public readonly leftWallDoesWork: boolean;
  public readonly lidIsOnProperty: Property<boolean>; // whether the lid is on the container
  public readonly lidThickness: number; // lid thickness, in pm

  // insets of the opening in the top, from the inside edges of the container, in pm
  public readonly openingLeftInset: number;
  public readonly openingRightInset: number;

  private readonly openingRight: number; // the right coordinate of the opening in the top of the container, in pm
  private readonly minLidWidth: number; // minimum width of the lid, overlaps the left wall, in pm.
  public readonly lidWidthProperty: Property<number>; // width of the lid, in pm

  // Particles enter the container here, on the inside of the container, in pm.
  public readonly particleEntryPosition: Vector2;

  // Bicycle pump hose connects here, on the outside of the container, in pm.
  public readonly hosePosition: Vector2;

  // Desired width of the container, in pm.
  // Set this to impose an animated speed limit on decreasing width. See #90.
  public desiredWidth: number;

  // previous position of the left wall
  private previousLeft: number;

  // is the container open?
  public readonly isOpenProperty: TReadOnlyProperty<boolean>;

  public constructor( providedOptions: IdealGasLawContainerOptions ) {

    const options = optionize<IdealGasLawContainerOptions, SelfOptions, BaseContainerOptions>()( {

      // SelfOptions
      leftWallDoesWork: false
    }, providedOptions );

    super( options );

    this.leftWallDoesWork = options.leftWallDoesWork;

    this.lidIsOnProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'lidIsOnProperty' ),
      phetioReadOnly: true, // derived from state of the particle system
      phetioDocumentation: 'whether the lid is on the container, or has been blown off'
    } );

    this.lidThickness = 175;

    this.openingLeftInset = 1250;
    this.openingRightInset = 2000;
    assert && assert( this.widthRange.min > this.openingLeftInset + this.openingRightInset,
      'widthRange.min is too small to accommodate insets' );

    this.openingRight = this.position.y - this.openingRightInset;

    this.minLidWidth = this.openingLeftInset + this.wallThickness;

    const initialLidWidth = this.widthProperty.value - this.openingRightInset + this.wallThickness;

    this.lidWidthProperty = new NumberProperty( initialLidWidth, {

      // range changes dynamically with width of container
      isValidValue: value => ( value >= this.minLidWidth && value <= this.getMaxLidWidth() ),
      units: 'pm',
      tandem: options.tandem.createTandem( 'lidWidthProperty' ),
      phetioReadOnly: true // because the range is dynamic
    } );

    this.particleEntryPosition = new Vector2( this.position.x, this.position.y + this.height / 5 );

    this.hosePosition = this.particleEntryPosition.plusXY( this.wallThickness, 0 );

    this.desiredWidth = this.widthProperty.value;

    this.previousLeft = this.left;

    this.isOpenProperty = new DerivedProperty( [ this.lidIsOnProperty, this.lidWidthProperty ],
      ( lidIsOn, lidWidth ) => {
        return !lidIsOn || this.getOpeningWidth() !== 0;
      } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public override reset(): void {
    super.reset();
    this.lidIsOnProperty.reset();
    this.lidWidthProperty.reset();
    this.desiredWidth = this.widthProperty.value;
  }

  /**
   * Animates the container's width one step towards desiredWidth. Computes wall velocity if the wall does work.
   * @param dt - time delta, in ps
   */
  public step( dt: number ): void {
    assert && assert( dt > 0, `invalid dt: ${dt}` );

    const widthDifference = this.desiredWidth - this.widthProperty.value;

    if ( widthDifference !== 0 ) {

      // Default is to move the entire distance in one step.
      let newWidth = this.desiredWidth;

      // If the left wall does work (as in the Explore screen), limit the wall's speed and thus how much the
      // width changes per time step. The speed limit prevents the lid from blowing off too easily.  See #90.
      if ( this.leftWallDoesWork ) {

        const widthStep = dt * WALL_SPEED_LIMIT;

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
      const velocityX = ( this.left - this.previousLeft ) / dt;
      this.leftWallVelocity.setXY( velocityX, 0 );
      this.previousLeft = this.left;
    }
    else {
      assert && assert( this.leftWallVelocity.magnitude === 0, 'wall velocity should be zero' );
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
   * Resizes the container immediately to the specified width.
   */
  public resizeImmediately( width: number ): void {
    assert && assert( this.widthRange.contains( width ), `width is out of range: ${width}` );
    this.setWidth( width );
    this.desiredWidth = width;
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
      `openingLeft ${openingLeft} must be <= openingRight ${this.getOpeningRight()}`
    );

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
   * Blows the lid off of the container.
   */
  public blowLidOff(): void {
    this.lidIsOnProperty.value = false;
  }
}

gasProperties.register( 'IdealGasLawContainer', IdealGasLawContainer );