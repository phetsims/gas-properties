// Copyright 2018-2019, University of Colorado Boulder

/**
 * Properties that are specific to the view in the 'Ideal' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const ParticleTypeEnum = require( 'GAS_PROPERTIES/common/model/ParticleTypeEnum' );
  const Property = require( 'AXON/Property' );

  class IdealViewProperties {

    constructor() {

      // @public whether dimensional arrows are visible for the width of the container
      this.sizeVisibleProperty = new BooleanProperty( GasPropertiesQueryParameters.checked );

      // @public whether the 'Particles Counts' accordion box is expanded
      this.particleCountsExpandedProperty = new BooleanProperty( GasPropertiesQueryParameters.expanded );

      // @public the particle type that will be dispensed by the bicycle pump
      this.particleTypeProperty = new Property( ParticleTypeEnum.HEAVY, {
        isValidValue: value => ParticleTypeEnum.includes( value )
      } );
    }

    reset() {
      this.particleTypeProperty.reset();
      this.sizeVisibleProperty.reset();
      this.particleCountsExpandedProperty.reset();
    }
  }

  return gasProperties.register( 'IdealViewProperties', IdealViewProperties );
} );