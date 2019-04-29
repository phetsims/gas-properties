// Copyright 2019, University of Colorado Boulder

//TODO lots of duplication with Container
/**
 * The container in the 'Diffusion' screen.  It differs dramatically from the container in the other screens.
 * It has a fixed width, no lid, and a removable vertical divider.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const Range = require( 'DOT/Range' );
  const Vector2 = require( 'DOT/Vector2' );

  class DiffusionContainer {

    constructor( options ) {

      options = _.extend( {
        location: Vector2.ZERO
      }, options );

      // @public (read-only) lower-right corner, in nm, for consistency with other screens
      this.location = options.location;

      // @public (read-only) inside dimensions, in nm
      this.width = 15;
      this.height = 8.75;
      this.depth = GasPropertiesQueryParameters.containerDepth;
      this.volume = this.width * this.height * this.depth;

      // @public (read-only) wall thickness, in nm
      this.wallThickness = 0.05;

      // @public (read-only) divider thickness, in nm
      this.dividerThickness = 0.1;

      // @public (read-only) inside bounds in nm.
      this.bounds = new Bounds2(
        this.location.x - this.width, this.location.y,
        this.location.x, this.location.y + this.height
        );

      // @public (read-only) divider is horizontally centered, but no code assumes that
      this.dividerX = this.left + ( this.width / 2 );
      assert && assert( ( this.dividerX + this.dividerThickness / 2 > this.left ) && ( this.dividerX - this.dividerThickness / 2 < this.right ),
        `dividerX is not in the container: ${this.dividerX}` );

      // @public (read-only) inside bounds for left and right sides of the container
      this.leftBounds = new Bounds2( this.left, this.bottom, this.dividerX, this.top );
      this.rightBounds = new Bounds2( this.centerX, this.bottom, this.right, this.top );

      // @public whether the divider is in place
      this.hasDividerProperty = new BooleanProperty( true );

      // Adjust the bounds of the left and right sides of the container to account for divider thickness
      this.hasDividerProperty.link( hasDivider => {
        const dividerOffset = hasDivider ? ( this.dividerThickness / 2 ) : 0;
        this.leftBounds.setMaxX( this.dividerX - dividerOffset );
        this.rightBounds.setMinX( this.dividerX + dividerOffset );
      } );

      //TODO this is here to make it work with CollisionDetector, make it go away
      this.widthRange = new Range( 1, this.width );
    }

    // @public
    reset() {
      this.hasDividerProperty.reset();
    }

    //TODO copied from Container
    /**
     * Convenience getters for inner bounds of the container, in model coordinate frame.
     * Bounds2 has similar getters, but use view coordinate frame, where 'top' is minY and 'bottom' is maxY.
     * @returns {number} in nm
     * @public
     */
    get left() { return this.bounds.minX; }

    get right() { return this.bounds.maxX; }

    get bottom() { return this.bounds.minY; }

    get top() { return this.bounds.maxY; }
  }

  return gasProperties.register( 'DiffusionContainer', DiffusionContainer );
} );