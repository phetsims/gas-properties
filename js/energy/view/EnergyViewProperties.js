// Copyright 2018-2019, University of Colorado Boulder

/**
 * Properties that are specific to the view in the 'Energy' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const ParticleType = require( 'GAS_PROPERTIES/common/model/ParticleType' );
  const Property = require( 'AXON/Property' );

  class EnergyViewProperties {

    constructor() {

      // @public whether the Average Speed display is visible
      this.averageSpeedVisibleProperty = new BooleanProperty( true || GasPropertiesQueryParameters.checked );

      // @public whether the Speed accordion box is expanded
      this.speedExpandedProperty = new BooleanProperty( true || GasPropertiesQueryParameters.expanded );

      // @public whether the Kinetic Energy accordion box is expanded
      this.kineticEnergyExpandedProperty = new BooleanProperty( GasPropertiesQueryParameters.expanded ) ;

      // @public whether dimensional arrows are visible for the width of the container
      this.sizeVisibleProperty = new BooleanProperty( GasPropertiesQueryParameters.checked );

      // @public whether the 'Particles Counts' accordion box is expanded
      this.particleCountsExpandedProperty = new BooleanProperty( GasPropertiesQueryParameters.expanded );

      // @public whether the 'Particles Tools' accordion box is expanded
      this.particleToolsExpandedProperty = new BooleanProperty( GasPropertiesQueryParameters.expanded );

      // @public the particle type that will be dispensed by the bicycle pump
      this.particleTypeProperty = new Property( ParticleType.HEAVY, {
        isValidValue: value => ParticleType.includes( value )
      } );
    }

    reset() {
      this.averageSpeedVisibleProperty.reset();
      this.speedExpandedProperty.reset();
      this.kineticEnergyExpandedProperty.reset();
      this.sizeVisibleProperty.reset();
      this.particleCountsExpandedProperty.reset();
      this.particleToolsExpandedProperty.reset();
      this.particleTypeProperty.reset();
    }
  }

  return gasProperties.register( 'EnergyViewProperties', EnergyViewProperties );
} );