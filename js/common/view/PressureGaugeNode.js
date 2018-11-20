// Copyright 2018, University of Colorado Boulder

/**
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Circle = require( 'SCENERY/nodes/Circle' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const Node = require( 'SCENERY/nodes/Node' );

  class PressureGaugeNode extends Node {

    /**
     * @param {PressureGauge} pressureGauge
     * @param {Node} comboBoxListParent - parent for the combo box popup list
     * @param {Object} [options]
     */
    constructor( pressureGauge, comboBoxListParent, options ) {

      options = options || {};

      //TODO placeholder
      var circle = new Circle( 50, {
        fill: 'white',
        stroke: 'black'
      });

      assert && assert( !options.children, 'PressureGaugeNode sets children' );
      options.children = [ circle ];

      super( options );
    }
  }

  return gasProperties.register( 'PressureGaugeNode', PressureGaugeNode );
} );