// Copyright 2018-2022, University of Colorado Boulder

/**
 * EnergyViewProperties defines Properties that are specific to the view in the 'Energy' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IdealGasLawViewProperties from '../../common/view/IdealGasLawViewProperties.js';
import gasProperties from '../../gasProperties.js';

export default class EnergyViewProperties extends IdealGasLawViewProperties {

  public readonly averageSpeedExpandedProperty: Property<boolean>;
  public readonly speedExpandedProperty: Property<boolean>;
  public readonly kineticEnergyExpandedProperty: Property<boolean>;
  public readonly injectionTemperatureExpandedProperty: Property<boolean>;

  public constructor( tandem: Tandem ) {

    super( tandem );

    this.averageSpeedExpandedProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'averageSpeedExpandedProperty' ),
      phetioDocumentation: 'whether the Average Speed accordion box is expanded'
    } );

    this.speedExpandedProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'speedExpandedProperty' ),
      phetioDocumentation: 'whether the Speed accordion box is expanded'
    } );

    this.kineticEnergyExpandedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'kineticEnergyExpandedProperty' ),
      phetioDocumentation: 'whether the Kinetic Energy accordion box is expanded'
    } );

    this.injectionTemperatureExpandedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'injectionTemperatureExpandedProperty' ),
      phetioDocumentation: 'whether the Injection Temperature accordion box is expanded'
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public override reset(): void {
    super.reset();
    this.averageSpeedExpandedProperty.reset();
    this.speedExpandedProperty.reset();
    this.kineticEnergyExpandedProperty.reset();
    this.injectionTemperatureExpandedProperty.reset();
  }
}

gasProperties.register( 'EnergyViewProperties', EnergyViewProperties );