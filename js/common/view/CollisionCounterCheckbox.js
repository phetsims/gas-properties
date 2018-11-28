// Copyright 2018, University of Colorado Boulder

/**
 * 'Collision Counter' check box, used to control visibility of the collision counter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const CollisionCounterNode = require( 'GAS_PROPERTIES/common/view/CollisionCounterNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesCheckbox = require( 'GAS_PROPERTIES/common/view/GasPropertiesCheckbox' );

  // strings
  const collisionCounterString = require( 'string!GAS_PROPERTIES/collisionCounter' );

  class CollisionCounterCheckbox extends GasPropertiesCheckbox {

    /**
     * @param {BooleanProperty} collisionCounterVisibleProperty
     * @param {Object} [options]
     */
    constructor( collisionCounterVisibleProperty, options ) {

      options = options || {};

      assert && assert( !options.icon, 'StopwatchCheckbox sets icon' );
      options.icon = CollisionCounterNode.createIcon( { scale: 0.2 } );

      super( collisionCounterString, collisionCounterVisibleProperty, options );
    }
  }

  return gasProperties.register( 'CollisionCounterCheckbox', CollisionCounterCheckbox );
} ); 