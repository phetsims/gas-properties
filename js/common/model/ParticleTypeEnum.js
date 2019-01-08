// Copyright 2018, University of Colorado Boulder

//TODO should this Enumeration be a static field of some class?
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

  const ParticleTypeEnum = new Enumeration( [ 'HEAVY', 'LIGHT' ] );

  return gasProperties.register( 'ParticleTypeEnum', ParticleTypeEnum );
} );