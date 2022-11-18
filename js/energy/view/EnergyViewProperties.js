// Copyright 2018-2020, University of Colorado Boulder

// @ts-nocheck
/**
 * EnergyViewProperties defines Properties that are specific to the view in the 'Energy' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import IdealGasLawViewProperties from '../../common/view/IdealGasLawViewProperties.js';
import gasProperties from '../../gasProperties.js';

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
    this.injectionTemperatureExpandedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'injectionTemperatureExpandedProperty' ),
      phetioDocumentation: 'whether the Injection Temperature accordion box is expanded'
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
    this.injectionTemperatureExpandedProperty.reset();
  }
}

gasProperties.register( 'EnergyViewProperties', EnergyViewProperties );
export default EnergyViewProperties;