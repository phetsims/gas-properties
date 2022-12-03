// Copyright 2019-2022, University of Colorado Boulder

/**
 * GasPropertiesSpinner is a specialization of NumberSpinner for this sim, with options and color profiling.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import NumberSpinner, { NumberSpinnerOptions } from '../../../../sun/js/NumberSpinner.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import gasProperties from '../../gasProperties.js';

type SelfOptions = EmptySelfOptions;

export type GasPropertiesSpinnerOptions = SelfOptions & NumberSpinnerOptions & PickRequired<NumberSpinnerOptions, 'tandem'>;

export default class GasPropertiesSpinner extends NumberSpinner {

  public constructor( numberProperty: NumberProperty, providedOptions: GasPropertiesSpinnerOptions ) {

    const options = optionize<GasPropertiesSpinnerOptions, SelfOptions, NumberSpinnerOptions>()( {

      // NumberSpinnerOptions
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
    }, providedOptions );

    super( numberProperty, new Property( numberProperty.range ), options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

gasProperties.register( 'GasPropertiesSpinner', GasPropertiesSpinner );