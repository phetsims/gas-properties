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
  const GasPropertiesViewProperties = require( 'GAS_PROPERTIES/common/view/GasPropertiesViewProperties' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );

  class EnergyViewProperties extends GasPropertiesViewProperties {

    constructor() {
      super();

      // @public whether the Average Speed accordion box is expanded
      this.averageSpeedExpandedProperty = new BooleanProperty( true || GasPropertiesQueryParameters.checked );

      // @public whether the Speed accordion box is expanded
      this.speedExpandedProperty = new BooleanProperty( true || GasPropertiesQueryParameters.expanded );

      // @public whether the Kinetic Energy accordion box is expanded
      this.kineticEnergyExpandedProperty = new BooleanProperty( GasPropertiesQueryParameters.expanded ) ;

      // @public whether the 'Particles Tools' accordion box is expanded
      this.particleToolsExpandedProperty = new BooleanProperty( GasPropertiesQueryParameters.expanded );
    }

    // @public @override
    reset() {
      this.averageSpeedExpandedProperty.reset();
      this.speedExpandedProperty.reset();
      this.kineticEnergyExpandedProperty.reset();
      this.particleToolsExpandedProperty.reset();
      super.reset();
    }
  }

  return gasProperties.register( 'EnergyViewProperties', EnergyViewProperties );
} );