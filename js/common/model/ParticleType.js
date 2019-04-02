// Copyright 2018-2019, University of Colorado Boulder

/**
 * Enumeration for which particle type.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );

  const ParticleType = new Enumeration( [ 'HEAVY', 'LIGHT' ] );

  return gasProperties.register( 'ParticleType', ParticleType );
} );