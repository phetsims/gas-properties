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
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RichText = require( 'SCENERY/nodes/RichText' );

  /**
   * @param {String} particleTypeProperty
   * @param {Object} [options]
   * @constructor
   */
  function BicyclePumpNode( particleTypeProperty, options ) {

    var rectangle = new Rectangle( 0, 0, 120, 240, {
      lineWidth: 2
    } );

    var text = new RichText( 'bicycle pump', {
      maxWidth: 0.85 * rectangle.width,
      fill: GasPropertiesColors.FOREGROUND_COLOR,
      centerX: rectangle.centerX,
      top: rectangle.top + 5
    } );

    assert && assert( !options.children, 'BicyclePumpNode sets children' );
    options.children = [ rectangle, text ];

    Node.call( this, options );

    // Change color of the pump to match the type of particle
    particleTypeProperty.link( function( particleType ) {
      rectangle.fill = ( particleType === 'heavy' ) ? GasPropertiesColors.HEAVY_PARTICLE : GasPropertiesColors.LIGHT_PARTICLE;
    } );
  }

  gasProperties.register( 'BicyclePumpNode', BicyclePumpNode );

  return inherit( Node, BicyclePumpNode );
} );
 