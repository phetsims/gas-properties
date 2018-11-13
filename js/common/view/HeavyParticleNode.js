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
  const inherit = require( 'PHET_CORE/inherit' );
  const ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function HeavyParticleNode( options ) {

    options = _.extend( {
      diameter: 15
    }, options );

    assert && assert( !options.mainColor, 'HeavyParticleNode sets mainColor' );
    options.mainColor = gasPropertiesColorProfile.heavyParticleColorProperty;

    ShadedSphereNode.call( this, options.diameter, options );
  }

  gasProperties.register( 'HeavyParticleNode', HeavyParticleNode );

  return inherit( ShadedSphereNode, HeavyParticleNode );
} );