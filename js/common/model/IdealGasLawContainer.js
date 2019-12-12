// Copyright 2018-2019, University of Colorado Boulder

/**
 * IdealGasLawContainer is the container used in screens that are based on the Ideal Gas Law.
 * This container has a (re)movable lid.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BaseContainer = require( 'GAS_PROPERTIES/common/model/BaseContainer' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const merge = require( 'PHET_CORE/merge' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants

  // Speed limit for the container's left movable wall, in pm/ps. Relevant when reducing the container size.
  const WALL_SPEED_LIMIT = GasPropertiesQueryParameters.wallSpeedLimit;

  class IdealGasLawContainer extends BaseContainer {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = merge( {

        // true if the left wall does work on particles, as in the Explore screen
        leftWallDoesWork: false,

        // phet-io
        tandem: Tandem.REQUIRED
      }, options );

      super( options );

      // @public (read-only)
      this.leftWallDoesWork = options.leftWallDoesWork;

      // @public whether the lid is on the container
      this.lidIsOnProperty = new BooleanProperty( true, {
        tandem: options.tandem.createTandem( 'lidIsOnProperty' ),
        phetioReadOnly: true, // derived from state of the particle system
        phetioDocumentation: 'whether the lid is on the container, or has been blown off'
      } );

      // @public (read-only) lid thickness, in pm
      this.lidThickness = 175;

      // @public (read-only) insets of the opening in the top, from the inside edges of the container, in pm
      this.openingLeftInset = 1250;
      this.openingRightInset = 2000;
      assert && assert( this.widthRange.min > this.openingLeftInset + this.openingRightInset,
        'widthRange.min is too small to accommodate insets' );

      // @private the right coordinate of the opening in the top of the container, in pm
      this.openingRight = this.location.y - this.openingRightInset;

      // @private minimum width of the lid, overlaps the left wall, in pm.
      this.minLidWidth = this.openingLeftInset + this.wallThickness;

      const initialLidWidth = this.widthProperty.value - this.openingRightInset + this.wallThickness;

      // @public width of the lid, in pm
      this.lidWidthProperty = new NumberProperty( initialLidWidth, {

        // range changes dynamically with width of container
        isValidValue: value => ( value >= this.minLidWidth && value <= this.getMaxLidWidth() ),
        units: 'pm',
        tandem: options.tandem.createTandem( 'lidWidthProperty' ),
        phetioStudioControl: false // because the range is dynamic
      } );

      // @public (read-only) particles enter the container here, on the inside of the container, in pm
      this.particleEntryLocation = new Vector2( this.location.x, this.location.y + this.height / 5 );

      // @public (read-only) bicycle pump hose connects here, on outside of the container, in pm
      this.hoseLocation = this.particleEntryLocation.plusXY( this.wallThickness, 0 );

      // @public {number} desired width of the container, in pm.
      // Set this to impose an animated speed limit on decreasing width. See #90.
      this.desiredWidth = this.widthProperty.value;

      // @private {number} previous location of the left wall
      this.previousLeft = this.left;

      // @public {boolean} is the container open?
      this.isOpenProperty = new DerivedProperty( [ this.lidIsOnProperty, this.lidWidthProperty ],
        ( lidIsOn, lidWidth ) => {
            return !lidIsOn || this.getOpeningWidth() !== 0;
      } );
    }

    /**
     * Resets the container.
     * @public
     * @override
     */
    reset() {
      super.reset();
      this.lidIsOnProperty.reset();
      this.lidWidthProperty.reset();
      this.desiredWidth = this.widthProperty.value;
    }

    /**
     * Animates the container's width one step towards desiredWidth. Computes wall velocity if the wall does work.
     * @param {number} dt - time delta, in ps
     * @public
     */
    step( dt ) {
      assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );

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
     * @param {number} width
     * @private
     */
    setWidth( width ) {
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
     * @param {number} width
     * @public
     */
    resizeImmediately( width ) {
      assert && assert( this.widthRange.contains( width ), `width is out of range: ${width}` );
      this.setWidth( width );
      this.desiredWidth = width;
    }

    /**
     * Gets the minimum lid width. This is constant, independent of the container width.
     * @returns {number} in pm
     * @public
     */
    getMinLidWidth() {
      return this.minLidWidth;
    }

    /**
     * Gets the maximum lid width, when the lid is fully closed. This changes dynamically with the container width.
     * @returns {number} in pm
     * @public
     */
    getMaxLidWidth() {
      return this.widthProperty.value - this.openingRightInset + this.wallThickness;
    }

    /**
     * Gets the left coordinate of the opening in the top of the container.
     * @returns {number} in pm
     * @public
     */
    getOpeningLeft() {

      let openingLeft = null;

      if ( this.lidIsOnProperty.value ) {
        openingLeft = this.left - this.wallThickness + this.lidWidthProperty.value;

        // Round to nearest pm to avoid floating-point error, see https://github.com/phetsims/gas-properties/issues/63
        openingLeft = Util.roundSymmetric( openingLeft );
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
     * Gets the right coordinate of the opening in the top of the container.
     * @returns {number} in pm
     * @public
     */
    getOpeningRight() {
      return this.openingRight;
    }

    /**
     * Gets the width of the opening in the top of the container.
     * @returns {number} in pm
     * @public
     */
    getOpeningWidth() {
      const openingWidth = this.getOpeningRight() - this.getOpeningLeft();
      assert && assert( openingWidth >= 0, `invalid openingWidth: ${openingWidth}` );
      return openingWidth;
    }

    /**
     * Blows the lid off of the container.
     * @public
     */
    blowLidOff() {
      this.lidIsOnProperty.value = false;
    }
  }

  return gasProperties.register( 'IdealGasLawContainer', IdealGasLawContainer );
} );