// Copyright 2018, University of Colorado Boulder

/**
 * Container for particles.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );

  // constants
  var CONTAINER_WIDTH_RANGE = new RangeWithValue( 100, 500, 300 );
  var CONTAINER_HEIGHT = 400;

  /**
   * @constructor
   */
  function Container() {
    
    // @public width of the container, in nm
    this.widthProperty = new NumberProperty( CONTAINER_WIDTH_RANGE.defaultValue, {
      numberType: 'FloatingPoint',
      range: CONTAINER_WIDTH_RANGE,
      units: 'nanometers'
    } );

    // @public (read-only) height of the container, in nm
    this.height = CONTAINER_HEIGHT;
  }

  gasProperties.register( 'Container', Container );

  return inherit( Object, Container );
} );