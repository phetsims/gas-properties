// Copyright 2018-2024, University of Colorado Boulder

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
      phetioFeatured: true,
      phetioDocumentation: 'Whether the Average Speed accordion box is expanded.'
    } );

    this.speedExpandedProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'speedExpandedProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Whether the Speed accordion box is expanded.'
    } );

    this.kineticEnergyExpandedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'kineticEnergyExpandedProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Whether the Kinetic Energy accordion box is expanded.'
    } );

    this.injectionTemperatureExpandedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'injectionTemperatureExpandedProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Whether the Injection Temperature accordion box is expanded.'
    } );
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