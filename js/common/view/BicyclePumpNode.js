// Copyright 2018, University of Colorado Boulder

//TODO placeholder, see https://github.com/phetsims/states-of-matter/issues/217
/**
 * Bicycle pump, used to add particles to the container.
 * 
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const gasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/gasPropertiesColorProfile' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RichText = require( 'SCENERY/nodes/RichText' );

  /**
   * @param {String} particleTypeProperty
   * @param {Object} [options]
   * @constructor
   */
  function BicyclePumpNode( particleTypeProperty, options ) {

    const rectangle = new Rectangle( 0, 0, 120, 240, {
      lineWidth: 2
    } );

    const text = new RichText( 'bicycle pump', {
      maxWidth: 0.85 * rectangle.width,
      fill: 'white',
      centerX: rectangle.centerX,
      top: rectangle.top + 5
    } );

    assert && assert( !options.children, 'BicyclePumpNode sets children' );
    options.children = [ rectangle, text ];

    Node.call( this, options );

    // Change color of the pump to match the type of particle
    particleTypeProperty.link( function( particleType ) {
      rectangle.fill = ( particleType === 'heavy' ) ?
                       gasPropertiesColorProfile.heavyParticleColorProperty :
                       gasPropertiesColorProfile.lightParticleColorProperty;
    } );
  }

  gasProperties.register( 'BicyclePumpNode', BicyclePumpNode );

  return inherit( Node, BicyclePumpNode );
} );
 