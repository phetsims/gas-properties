// Copyright 2019, University of Colorado Boulder

/**
 * Container for the 'Ideal', 'Explore', and 'Energy' screens.  It has a (re)movable lid.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BaseContainer = require( 'GAS_PROPERTIES/common/model/BaseContainer' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants

  // Speed limit for the container's left movable wall, in pm/ps. Relevant when reducing the container size.
  const WALL_SPEED_LIMIT = GasPropertiesQueryParameters.wallSpeedLimit;

  class GasPropertiesContainer extends BaseContainer {

    constructor( options ) {
      super( options );

      // @public whether the lid is on the container
      this.lidIsOnProperty = new BooleanProperty( true );

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

      // @public width of the lid, in pm
      this.lidWidthProperty = new NumberProperty( this.widthProperty.value - this.openingRightInset + this.wallThickness, {
        units: 'pm'
        // see below for validation
      } );

      // Validate lidWidth, whose range changes dynamically.
      assert && this.lidWidthProperty.link( lidWidth => {
        assert && assert( lidWidth >= this.minLidWidth && lidWidth <= this.getMaxLidWidth(), `invalid lidWidth: ${lidWidth}` );
      } );

      // @public (read-only) bicycle pump hose is connected to the bottom right side of the container, in pm
      this.hoseLocation = new Vector2( this.location.x + this.wallThickness, this.location.y + this.height / 5 );

      // @public {number} desired width of the container, in pm.
      // Set this to animate width change with a speed limit. See #90.
      this.desiredWidth = this.widthProperty.value;
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
     * Animates the container's width one step towards desiredWidth.
     * @param {number} dt - time delta, in ps
     * @public
     */
    stepWidth( dt ) {
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
    }

    /**
     * Resizes the container to the specified width.
     * Maintains a constant opening size in the top of the container, if possible.
     * @param {number} width
     * @private
     */
    setWidth( width ) {
      assert && assert( this.widthRange.contains( width ), `width is out of range: ${width}` );

      // Get opening width before changing widthProperty
      const openingWidth = this.getOpeningWidth();

      // resize the container
      this.widthProperty.value = width;

      // resize the lid, maintaining the opening width if possible
      this.lidWidthProperty.value = Math.max( this.getMaxLidWidth() - openingWidth, this.minLidWidth );
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

        // Round to the nearest pm to avoid floating-point error, see https://github.com/phetsims/gas-properties/issues/63.
        openingLeft = Util.roundSymmetric( openingLeft );
      }
      else {
        openingLeft = this.left + this.openingLeftInset;
      }
      assert && assert( openingLeft <= this.getOpeningRight(),
        `openingLeft ${openingLeft} must be <= openingRight ${this.getOpeningRight()}` );
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
     * Is the container's lid open?
     * @returns {boolean}
     */
    isLidOpen() {
      return ( this.getOpeningWidth() !== 0 );
    }
  }

  return gasProperties.register( 'GasPropertiesContainer', GasPropertiesContainer );
} );