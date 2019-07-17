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

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      // @public
      this.sizeVisibleProperty = new BooleanProperty( false, {
        tandem: tandem.createTandem( 'sizeVisibleProperty' ),
        phetioDocumentation: 'whether dimensional arrows are visible for the width of the container'
      } );

      // @public
      this.particlesExpandedProperty = new BooleanProperty( false, {
        tandem: tandem.createTandem( 'particlesExpandedProperty' ),
        phetioDocumentation: 'whether the Particles accordion box is expanded'
      } );

      // @public
      this.particleTypeProperty = new EnumerationProperty( ParticleType, ParticleType.HEAVY, {
        tandem: tandem.createTandem( 'particleTypeProperty' ),
        phetioDocumentation: 'the particle type that will be dispensed by the bicycle pump'
      } );
    }

    // @public
    reset() {
      this.sizeVisibleProperty.reset();
      this.particlesExpandedProperty.reset();
      this.particleTypeProperty.reset();
    }
  }

  return gasProperties.register( 'IdealGasLawViewProperties', IdealGasLawViewProperties );
} );