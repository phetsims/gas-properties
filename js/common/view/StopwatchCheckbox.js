// Copyright 2018-2019, University of Colorado Boulder

/**
 * StopwatchCheckbox is the 'Stopwatch' check box, used to control visibility of the stopwatch.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import gasPropertiesStrings from '../../gas-properties-strings.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesCheckbox from './GasPropertiesCheckbox.js';
import GasPropertiesIconFactory from './GasPropertiesIconFactory.js';

const stopwatchString = gasPropertiesStrings.stopwatch;

class StopwatchCheckbox extends GasPropertiesCheckbox {

  /**
   * @param {BooleanProperty} stopwatchVisibleProperty
   * @param {Object} [options]
   */
  constructor( stopwatchVisibleProperty, options ) {
    assert && assert( stopwatchVisibleProperty instanceof BooleanProperty,
      `invalid stopwatchVisibleProperty: ${stopwatchVisibleProperty}` );

    if ( options ) {
      assert && assert( !options.text, 'StopwatchCheckbox sets text' );
      assert && assert( !options.icon, 'StopwatchCheckbox sets icon' );
    }

    options = merge( {

      // superclass options
      text: stopwatchString,
      icon: GasPropertiesIconFactory.createStopwatchIcon()
    }, options );

    super( stopwatchVisibleProperty, options );
  }
}

gasProperties.register( 'StopwatchCheckbox', StopwatchCheckbox );
export default StopwatchCheckbox;