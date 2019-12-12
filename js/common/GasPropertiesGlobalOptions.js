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
  const Tandem = require( 'TANDEM/Tandem' );

  // constants
  const optionsTandem = Tandem.GLOBAL.createTandem( 'options' );

  const GasPropertiesGlobalOptions = {

    // @public
    pressureNoiseProperty:
      new BooleanProperty( GasPropertiesQueryParameters.pressureNoise, {
        tandem: optionsTandem.createTandem( 'pressureNoiseProperty' ),
        phetioDocumentation: 'turns noise on and off for the pressure gauge'
      } )
  };

  return gasProperties.register( 'GasPropertiesGlobalOptions', GasPropertiesGlobalOptions );
} );