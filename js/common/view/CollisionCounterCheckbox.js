// Copyright 2018-2019, University of Colorado Boulder

/**
 * CollisionCounterCheckbox is the 'Collision Counter' check box, used to control visibility of the collision counter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesCheckbox = require( 'GAS_PROPERTIES/common/view/GasPropertiesCheckbox' );
  const GasPropertiesIconFactory = require( 'GAS_PROPERTIES/common/view/GasPropertiesIconFactory' );
  const merge = require( 'PHET_CORE/merge' );

  // strings
  const collisionCounterString = require( 'string!GAS_PROPERTIES/collisionCounter' );

  class CollisionCounterCheckbox extends GasPropertiesCheckbox {

    /**
     * @param {BooleanProperty} collisionCounterVisibleProperty
     * @param {Object} [options]
     */
    constructor( collisionCounterVisibleProperty, options ) {
      assert && assert( collisionCounterVisibleProperty instanceof BooleanProperty,
        `invalid collisionCounterVisibleProperty: ${collisionCounterVisibleProperty}` );

      if ( options ) {
        assert && assert( !options.text, 'StopwatchCheckbox sets text' );
        assert && assert( !options.icon, 'StopwatchCheckbox sets icon' );
      }

      options = merge( {

        // superclass options
        text: collisionCounterString,
        icon: GasPropertiesIconFactory.createCollisionCounterIcon()
      }, options );

      super( collisionCounterVisibleProperty, options );
    }
  }

  return gasProperties.register( 'CollisionCounterCheckbox', CollisionCounterCheckbox );
} );