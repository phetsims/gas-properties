// Copyright 2018-2019, University of Colorado Boulder

/**
 * Global options for this simulation, accessed via the Options menu item in the PhET menu.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );

  class GasPropertiesGlobalOptions {

    constructor() {

      // Projector Mode is a color profile that is suitable for displaying on a classroom projector
      this.projectorModeEnabledProperty = new BooleanProperty( phet.chipper.queryParameters.colorProfile === 'projector' );
    }
  }

  return gasProperties.register( 'GasPropertiesGlobalOptions', GasPropertiesGlobalOptions );
} );