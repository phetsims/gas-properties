// Copyright 2018-2022, University of Colorado Boulder

/**
 * IdealGasLawViewProperties is the base class for view-specific Properties that are common to the
 * screens that are based on the Ideal Gas Law.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import { ParticleType, ParticleTypeValues } from '../model/ParticleType.js';

export default class IdealGasLawViewProperties {

  public readonly widthVisibleProperty: Property<boolean>;
  public readonly particlesExpandedProperty: Property<boolean>;
  public readonly particleTypeProperty: StringUnionProperty<ParticleType>;

  public constructor( tandem: Tandem ) {

    this.widthVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'widthVisibleProperty' ),
      phetioDocumentation: 'whether dimensional arrows are visible for the width of the container'
    } );

    this.particlesExpandedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'particlesExpandedProperty' ),
      phetioDocumentation: 'whether the Particles accordion box is expanded'
    } );

    this.particleTypeProperty = new StringUnionProperty<ParticleType>( 'heavy', {
      validValues: ParticleTypeValues,
      tandem: tandem.createTandem( 'particleTypeProperty' ),
      phetioDocumentation: 'the particle type that will be dispensed by the bicycle pump'
    } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  public reset(): void {
    this.widthVisibleProperty.reset();
    this.particlesExpandedProperty.reset();
    this.particleTypeProperty.reset();
  }
}

gasProperties.register( 'IdealGasLawViewProperties', IdealGasLawViewProperties );