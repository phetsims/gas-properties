// Copyright 2018-2022, University of Colorado Boulder

/**
 * CollisionCounterCheckbox is the 'Collision Counter' check box, used to control visibility of the collision counter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import GasPropertiesCheckbox from './GasPropertiesCheckbox.js';
import GasPropertiesIconFactory from './GasPropertiesIconFactory.js';

export default class CollisionCounterCheckbox extends GasPropertiesCheckbox {

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
      text: GasPropertiesStrings.collisionCounterStringProperty,
      icon: GasPropertiesIconFactory.createCollisionCounterIcon()
    }, options );

    super( collisionCounterVisibleProperty, options );
  }
}

gasProperties.register( 'CollisionCounterCheckbox', CollisionCounterCheckbox );