// Copyright 2018, University of Colorado Boulder

/**
 * Control for changing for number of particles for a specific type of particle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const NumberSpinner = require( 'SUN/NumberSpinner' );
  const Property = require( 'AXON/Property' );

  class ParticleCountControl extends Node {

    /**
     * @param {string} title
     * @param {Node} icon
     * @param {NumberProperty} numberOfParticlesProperty
     * @param {Object} [options]
     */
    constructor( title, icon, numberOfParticlesProperty, options ) {

      options = options || {};

      assert && assert( numberOfParticlesProperty instanceof NumberProperty,
        'invalid numberOfParticlesProperty: ' + numberOfParticlesProperty );
      assert && assert( numberOfParticlesProperty.range,
        'numberOfParticlesProperty missing range' );

      const spinner = new NumberSpinner( numberOfParticlesProperty, new Property( numberOfParticlesProperty.range ), {
        valueAlign: 'right',
        font: GasPropertiesConstants.CONTROL_FONT
      } );

      assert && assert( !options.children, 'ParticleCountControl sets children' );
      options.children = [ spinner ];
      
      super( options );
    }
  }

  return gasProperties.register( 'ParticleCountControl', ParticleCountControl );
} );