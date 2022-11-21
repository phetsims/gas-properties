// Copyright 2019-2022, University of Colorado Boulder

// @ts-nocheck
/**
 * GasPropertiesSpinner is a specialization of NumberSpinner for this sim, with options and color profiling.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import gasProperties from '../../gasProperties.js';

export default class GasPropertiesSpinner extends NumberSpinner {

  /**
   * @param {NumberProperty} numberProperty
   * @param {Object} [options]
   */
  constructor( numberProperty, options ) {
    assert && assert( numberProperty instanceof NumberProperty, `invalid numberProperty: ${numberProperty}` );
    assert && assert( numberProperty.range, 'numberProperty is missing range' );

    options = merge( {

      // superclass options
      numberDisplayOptions: {
        decimalPlaces: 0,
        xMargin: 8,
        yMargin: 6,
        textOptions: {
          font: GasPropertiesConstants.CONTROL_FONT
        }
      },
      touchAreaXDilation: 15,
      touchAreaYDilation: 15
    }, options );

    super( numberProperty, new Property( numberProperty.range ), options );
  }
}

gasProperties.register( 'GasPropertiesSpinner', GasPropertiesSpinner );