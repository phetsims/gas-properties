// Copyright 2018, University of Colorado Boulder

/**
 * Heavy particle view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
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
  function HeavyParticleNode( options ) {

    options = _.extend( {
      diameter: 25
    }, options );

    assert && assert( !options.mainColor, 'HeavyParticleNode sets mainColor' );
    options.mainColor = GasPropertiesColors.HEAVY_PARTICLE;

    ShadedSphereNode.call( this, options.diameter, options );
  }

  gasProperties.register( 'HeavyParticleNode', HeavyParticleNode );

  return inherit( ShadedSphereNode, HeavyParticleNode );
} );