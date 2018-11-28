// Copyright 2018, University of Colorado Boulder

/**
 * 'Collision Counter' check box, used to control visibility of the collision counter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const CollisionCounterNode = require( 'GAS_PROPERTIES/common/view/CollisionCounterNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const collisionCounterString = require( 'string!GAS_PROPERTIES/collisionCounter' );

  class CollisionCounterCheckbox extends Checkbox {

    /**
     * @param {BooleanProperty} collisionCounterVisibleProperty
     * @param {Object} [options]
     */
    constructor( collisionCounterVisibleProperty, options ) {

      const textNode = new Text( collisionCounterString, {
          font: GasPropertiesConstants.CONTROL_FONT,
          fill: GasPropertiesColorProfile.textFillProperty
        } );

      const iconNode = CollisionCounterNode.createIcon( {
        scale: 0.2
      } );

      const content = new HBox( {
        spacing: 8,
        children: [ textNode, iconNode ]
      });

      super( content, collisionCounterVisibleProperty, options );
    }
  }

  return gasProperties.register( 'CollisionCounterCheckbox', CollisionCounterCheckbox );
} ); 