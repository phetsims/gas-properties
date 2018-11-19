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
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );

  class LightParticleNode extends ShadedSphereNode {
    /**
     * @param {Object} [options]
     * @constructor
     */
    constructor( options ) {

      options = _.extend( {
        diameter: 10
      }, options );

      assert && assert( !options.mainColor, 'LightParticleNode sets mainColor' );
      options.mainColor = GasPropertiesColorProfile.lightParticleColorProperty;

      super( options.diameter, options );
    }
  }

  return gasProperties.register( 'LightParticleNode', LightParticleNode );
} );