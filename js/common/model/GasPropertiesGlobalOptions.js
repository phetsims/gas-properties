// Copyright 2018-2021, University of Colorado Boulder

/**
 * GasPropertiesGlobalOptions defines the global options for this simulation, accessed via PhET > Options.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesQueryParameters from '../GasPropertiesQueryParameters.js';

// constants
const optionsTandem = Tandem.GLOBAL_MODEL.createTandem( 'options' );

const GasPropertiesGlobalOptions = {

  // @public
  pressureNoiseProperty:
    new BooleanProperty( GasPropertiesQueryParameters.pressureNoise, {
      tandem: optionsTandem.createTandem( 'pressureNoiseProperty' ),
      phetioDocumentation: 'turns noise on and off for the pressure gauge'
    } )
};

gasProperties.register( 'GasPropertiesGlobalOptions', GasPropertiesGlobalOptions );
export default GasPropertiesGlobalOptions;