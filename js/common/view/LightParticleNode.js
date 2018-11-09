// Copyright 2018, University of Colorado Boulder

/**
 * Light particle view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  var gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  var GasPropertiesColors = require( 'GAS_PROPERTIES/common/GasPropertiesColors' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function LightParticleNode( options ) {

    options = _.extend( {
      diameter: 10
    }, options );

    assert && assert( !options.mainColor, 'LightParticleNode sets mainColor' );
    options.mainColor = GasPropertiesColors.LIGHT_PARTICLE;

    ShadedSphereNode.call( this, options.diameter, options );
  }

  gasProperties.register( 'LightParticleNode', LightParticleNode );

  return inherit( ShadedSphereNode, LightParticleNode );
} );