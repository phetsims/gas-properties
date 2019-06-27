// Copyright 2018-2019, University of Colorado Boulder

/**
 * GasPropertiesGlobalOptions defines the global options for this simulation, accessed via PhET > Options.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );

  const GasPropertiesGlobalOptions = {

    // Projector Mode is a color profile that is suitable for displaying on a classroom projector
    projectorModeEnabledProperty:
      new BooleanProperty( phet.chipper.queryParameters.colorProfile === 'projector' ),

    // Projector Mode is a color profile that is suitable for displaying on a classroom projector
    pressureNoiseProperty:
      new BooleanProperty( GasPropertiesQueryParameters.pressureNoise )
  };

  return gasProperties.register( 'GasPropertiesGlobalOptions', GasPropertiesGlobalOptions );
} );