// Copyright 2018-2019, University of Colorado Boulder

/**
 * IdealGasLawViewProperties is the base class for view-specific Properties that are common to the
 * screens that are based on the Ideal Gas Law.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const ParticleType = require( 'GAS_PROPERTIES/common/model/ParticleType' );

  class IdealGasLawViewProperties {

    constructor() {

      // @public whether dimensional arrows are visible for the width of the container
      this.sizeVisibleProperty = new BooleanProperty( false );

      // @public whether the 'Particles Counts' accordion box is expanded
      this.particleCountsExpandedProperty = new BooleanProperty( false );

      // @public the particle type that will be dispensed by the bicycle pump
      this.particleTypeProperty = new EnumerationProperty( ParticleType, ParticleType.HEAVY );
    }

    // @public
    reset() {
      this.particleTypeProperty.reset();
      this.sizeVisibleProperty.reset();
      this.particleCountsExpandedProperty.reset();
    }
  }

  return gasProperties.register( 'IdealGasLawViewProperties', IdealGasLawViewProperties );
} );