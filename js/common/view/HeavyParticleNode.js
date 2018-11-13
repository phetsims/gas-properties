// Copyright 2018, University of Colorado Boulder

/**
 * Heavy particle view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const gasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/gasPropertiesColorProfile' );
  const ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );

  class HeavyParticleNode extends ShadedSphereNode {

    /**
     * @param {Object} [options]
     * @constructor
     */
    constructor( options ) {

      options = _.extend( {
        diameter: 15
      }, options );

      assert && assert( !options.mainColor, 'HeavyParticleNode sets mainColor' );
      options.mainColor = gasPropertiesColorProfile.heavyParticleColorProperty;

      super( options.diameter, options );
    }
  }

  return gasProperties.register( 'HeavyParticleNode', HeavyParticleNode );
} );