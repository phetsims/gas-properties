// Copyright 2018-2026, University of Colorado Boulder

/**
 * GasPropertiesPreferences is the model for sim-specific preferences, accessed via the Preferences dialog.
 * These preferences are global, and affect all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GasPropertiesQueryParameters from '../GasPropertiesQueryParameters.js';

const GasPropertiesPreferences = {

  pressureNoiseProperty: new BooleanProperty( GasPropertiesQueryParameters.pressureNoise, {
    tandem: Tandem.PREFERENCES.createTandem( 'pressureNoiseProperty' ),
    phetioFeatured: true,
    phetioDocumentation: 'Turns noise on and off for the pressure gauge.'
  } )
};

export default GasPropertiesPreferences;
