// Copyright 2019, University of Colorado Boulder

/**
 * A fixed-width panel.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );

  class FixedWidthPanel extends Panel {

    /**
     * @param {Node} content
     * @param {Object} [options]
     */
    constructor( content, options ) {

      options = _.extend( {
        fixedWidth: 100,
        xMargin: 0
      }, options );

      assert && assert( !options.hasOwnProperty( 'maxWidth' ), 'FixedWidthPanel sets maxWidth' );
      options = _.extend( {
        maxWidth: options.fixedWidth
      }, options );

      const contentWrapper = new Node();
      contentWrapper.addChild( new HStrut( options.fixedWidth - 2 * options.xMargin, { pickable: false } ) );
      contentWrapper.addChild( content );

      super( contentWrapper, options );
    }
  }

  return gasProperties.register( 'FixedWidthPanel', FixedWidthPanel );
} );