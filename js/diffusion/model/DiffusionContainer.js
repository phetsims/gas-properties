// Copyright 2019, University of Colorado Boulder

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
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const Vector2 = require( 'DOT/Vector2' );

  class DiffusionContainer {

    constructor( options ) {

      options = _.extend( {
        location: Vector2.ZERO
      }, options );

      // @public (read-only)
      this.location = options.location;

      // @public (read-only) fixed dimensions, in nm
      this.width = 15;
      this.height = 8.75;
      this.depth = 1;
      this.volume = this.width * this.height * this.depth;

      // @public (read-only) wall thickness, in nm
      this.wallThickness = 0.05;

      // @public (read-only) divider thickness, in nm
      this.dividerThickness = 0.1;

      // @public (read-only) locations of the container's inside bounds in nm.
      this.left = this.location.x - this.width;
      this.right = this.location.x;
      this.top = this.location.y + this.height;
      this.bottom = this.location.y;

      // @public (read-only) the divider is in the middle
      this.dividerX = this.left + ( this.width / 2 );

      // @public whether the divider is in place
      this.hasDividerProperty = new BooleanProperty( true );
    }

    // @public
    reset() {
      this.hasDividerProperty.reset();
    }
  }

  return gasProperties.register( 'DiffusionContainer', DiffusionContainer );
} );