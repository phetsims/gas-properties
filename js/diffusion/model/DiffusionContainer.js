// Copyright 2019, University of Colorado Boulder

/**
 * The container in the 'Diffusion' screen. It has a fixed width, no lid, and a removable vertical divider.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BaseContainer = require( 'GAS_PROPERTIES/common/model/BaseContainer' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const RangeWithValue = require( 'DOT/RangeWithValue' );

  // constants
  const CONTAINER_WIDTH = 15000; // pm

  class DiffusionContainer extends BaseContainer {

    constructor() {

      super( {
        widthRange: new RangeWithValue( CONTAINER_WIDTH, CONTAINER_WIDTH, CONTAINER_WIDTH ) // effectively fixed width
      } );

      // In case clients attempt to exercise this feature of the base class
      this.widthProperty.lazyLink( width => {
        throw new Error( 'width is fixed in the Diffusion screen' );
      } );

      // @public (read-only) divider thickness, in pm
      this.dividerThickness = 100;

      // @public (read-only) divider is horizontally centered, but no code assumes that
      this.dividerX = this.left + ( this.width / 2 );
      assert && assert(
      ( this.dividerX + this.dividerThickness / 2 > this.left ) &&
      ( this.dividerX - this.dividerThickness / 2 < this.right ),
        `dividerX is not in the container: ${this.dividerX}` );

      // @public (read-only) inside bounds for left and right sides of the container
      this.leftBounds = new Bounds2( this.left, this.bottom, this.dividerX, this.top );
      this.rightBounds = new Bounds2( this.dividerX, this.bottom, this.right, this.top );

      // @public whether the divider is in place
      this.hasDividerProperty = new BooleanProperty( true );

      // Adjust the bounds of the left and right sides of the container to account for divider thickness
      this.hasDividerProperty.link( hasDivider => {
        const dividerOffset = hasDivider ? ( this.dividerThickness / 2 ) : 0;
        this.leftBounds.setMaxX( this.dividerX - dividerOffset );
        this.rightBounds.setMinX( this.dividerX + dividerOffset );
      } );
    }

    // @public @override
    reset() {
      super.reset();
      this.hasDividerProperty.reset();
    }
  }

  return gasProperties.register( 'DiffusionContainer', DiffusionContainer );
} );