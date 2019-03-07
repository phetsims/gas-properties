// Copyright 2018-2019, University of Colorado Boulder

/**
 * 'Collision Counter' check box, used to control visibility of the collision counter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesCheckbox = require( 'GAS_PROPERTIES/common/view/GasPropertiesCheckbox' );
  const GasPropertiesIconFactory = require( 'GAS_PROPERTIES/common/view/GasPropertiesIconFactory' );

  // strings
  const collisionCounterString = require( 'string!GAS_PROPERTIES/collisionCounter' );

  class CollisionCounterCheckbox extends GasPropertiesCheckbox {

    /**
     * @param {BooleanProperty} collisionCounterVisibleProperty
     * @param {Object} [options]
     */
    constructor( collisionCounterVisibleProperty, options ) {

      assert && assert( !options || !options.hasOwnProperty( 'icon' ), 'StopwatchCheckbox sets icon' );
      options = _.extend( {
        icon: GasPropertiesIconFactory.createCollisionCounterIcon()
      }, options );

      super( collisionCounterString, collisionCounterVisibleProperty, options );
    }
  }

  return gasProperties.register( 'CollisionCounterCheckbox', CollisionCounterCheckbox );
} ); 