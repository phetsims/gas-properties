// Copyright 2018, University of Colorado Boulder

/**
 * Light particle view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const gasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/gasPropertiesColorProfile' );
  const inherit = require( 'PHET_CORE/inherit' );
  const ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function LightParticleNode( options ) {

    options = _.extend( {
      diameter: 10
    }, options );

    assert && assert( !options.mainColor, 'LightParticleNode sets mainColor' );
    options.mainColor = gasPropertiesColorProfile.lightParticleColorProperty;

    ShadedSphereNode.call( this, options.diameter, options );
  }

  gasProperties.register( 'LightParticleNode', LightParticleNode );

  return inherit( ShadedSphereNode, LightParticleNode );
} );