// Copyright 2019, University of Colorado Boulder

/**
 * Container in the 'Diffusion' screen.
 * 
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

  class DiffusionContainerNode extends Node {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = _.extend( {
        //TODO
      }, options );
      
      //TODO placeholder
      const rectangle = new Rectangle( 0, 0, 600, 300, {
        stroke: GasPropertiesColorProfile.containerBoundsStrokeProperty,
        lineWidth: 3
      } );
      
      assert && assert( !options.children, 'DiffusionContainerNodeNode sets children' );
      options = _.extend( {
        children: [ rectangle ]
      }, options );
      
      super( options );
    }
  }

  return gasProperties.register( 'DiffusionContainerNode', DiffusionContainerNode );
} );