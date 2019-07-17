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

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      super( tandem );

      // @public
      this.averageSpeedExpandedProperty = new BooleanProperty( true, {
        tandem: tandem.createTandem( 'averageSpeedExpandedProperty' ),
        phetioDocumentation: 'whether the Average Speed accordion box is expanded'
      } );

      // @public
      this.speedExpandedProperty = new BooleanProperty( true, {
        tandem: tandem.createTandem( 'speedExpandedProperty' ),
        phetioDocumentation: 'whether the Speed accordion box is expanded'
      } );

      // @public
      this.kineticEnergyExpandedProperty = new BooleanProperty( false, {
        tandem: tandem.createTandem( 'kineticEnergyExpandedProperty' ),
        phetioDocumentation: 'whether the Kinetic Energy accordion box is expanded'
      } );

      // @public
      this.particleToolsExpandedProperty = new BooleanProperty( false, {
        tandem: tandem.createTandem( 'particleToolsExpandedProperty' ),
        phetioDocumentation: 'whether the Particles Tools accordion box is expanded'
      } );
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