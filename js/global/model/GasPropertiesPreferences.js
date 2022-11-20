// Copyright 2018-2022, University of Colorado Boulder

/**
 * GasPropertiesPreferences is the model for sim-specific preferences, accessed via the Preferences dialog.
 * These preferences are global, and affect all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.ts';
import Tandem from '../../../../tandem/js/Tandem.ts';
import gasProperties from '../../gasProperties.ts';
import GasPropertiesQueryParameters from '../../common/GasPropertiesQueryParameters.ts';

const GasPropertiesPreferences = {

  // @public
  pressureNoiseProperty: new BooleanProperty( GasPropertiesQueryParameters.pressureNoise, {
    tandem: Tandem.PREFERENCES.createTandem( 'pressureNoiseProperty' ),
    phetioDocumentation: 'turns noise on and off for the pressure gauge'
  } )
};

gasProperties.register( 'GasPropertiesPreferences', GasPropertiesPreferences );
export default GasPropertiesPreferences;