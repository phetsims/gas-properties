// Copyright 2018, University of Colorado Boulder

//TODO placeholder, see https://github.com/phetsims/states-of-matter/issues/217
/**
 * Bicycle pump, used to add particles to the container.
 * 
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  var GasPropertiesColors = require( 'GAS_PROPERTIES/common/GasPropertiesColors' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {String} particleTypeProperty
   * @param {Object} [options]
   * @constructor
   */
  function BicyclePumpNode( particleTypeProperty, options ) {

    options = _.extend( {
      lineWidth: 2
    }, options );

    var self = this;

    Rectangle.call( this, 0, 0, 120, 240, options );

    // Change color of the pump to match the type of particle
    particleTypeProperty.link( function( particleType ) {
      self.stroke = ( particleType === 'heavy' ) ? GasPropertiesColors.HEAVY_PARTICLE : GasPropertiesColors.LIGHT_PARTICLE;
    } );
  }

  gasProperties.register( 'BicyclePumpNode', BicyclePumpNode );

  return inherit( Rectangle, BicyclePumpNode );
} );
 