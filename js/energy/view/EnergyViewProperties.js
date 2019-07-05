// Copyright 2018-2019, University of Colorado Boulder

/**
 * EnergyViewProperties defines Properties that are specific to the view in the 'Energy' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const IdealGasLawViewProperties = require( 'GAS_PROPERTIES/common/view/IdealGasLawViewProperties' );

  class EnergyViewProperties extends IdealGasLawViewProperties {

    constructor() {
      super();

      // @public whether the Average Speed accordion box is expanded
      this.averageSpeedExpandedProperty = new BooleanProperty( true );

      // @public whether the Speed accordion box is expanded
      this.speedExpandedProperty = new BooleanProperty( true );

      // @public whether the Kinetic Energy accordion box is expanded
      this.kineticEnergyExpandedProperty = new BooleanProperty( false );

      // @public whether the 'Particles Tools' accordion box is expanded
      this.particleToolsExpandedProperty = new BooleanProperty( false );
    }

    /**
     * @public
     * @override
     */
    reset() {
      super.reset();
      this.averageSpeedExpandedProperty.reset();
      this.speedExpandedProperty.reset();
      this.kineticEnergyExpandedProperty.reset();
      this.particleToolsExpandedProperty.reset();
    }
  }

  return gasProperties.register( 'EnergyViewProperties', EnergyViewProperties );
} );