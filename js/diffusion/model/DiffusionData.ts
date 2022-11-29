// Copyright 2019-2022, University of Colorado Boulder

/**
 * DiffusionData is responsible for information related to one side of the container.
 * This information is displayed in the 'Data' accordion box on the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty, { NumberPropertyOptions } from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import gasProperties from '../../gasProperties.js';
import DiffusionParticle1 from './DiffusionParticle1.js';
import DiffusionParticle2 from './DiffusionParticle2.js';

// constants
const NUMBER_OF_PARTICLES_PROPERTY_OPTIONS: NumberPropertyOptions = {
  numberType: 'Integer',
  isValidValue: value => ( value >= 0 ),
  phetioReadOnly: true // derived from the state of the particle system
};

export default class DiffusionData {

  // bounds of one side of the container
  private readonly bounds: Bounds2;

  // number of DiffusionParticle1 in this side of the container
  public readonly numberOfParticles1Property: Property<number>;

  // number of DiffusionParticle2 in this side of the container
  public readonly numberOfParticles2Property: Property<number>;

  // average temperature in this side of the container, in K
  // null when there are no particles in this side of the container.
  public readonly averageTemperatureProperty: Property<number | null>;

  public constructor( bounds: Bounds2, particles1: DiffusionParticle1[], particles2: DiffusionParticle2[], tandem: Tandem ) {

    this.bounds = bounds;

    this.numberOfParticles1Property = new NumberProperty( 0,
      combineOptions<NumberPropertyOptions>( {}, NUMBER_OF_PARTICLES_PROPERTY_OPTIONS, {
        tandem: tandem.createTandem( 'numberOfParticles1Property' ),
        phetioDocumentation: 'the number of particle of type 1 that are in this side of the container'
      } ) );

    this.numberOfParticles2Property = new NumberProperty( 0,
      combineOptions<NumberPropertyOptions>( {}, NUMBER_OF_PARTICLES_PROPERTY_OPTIONS, {
        tandem: tandem.createTandem( 'numberOfParticles2Property' ),
        phetioDocumentation: 'the number of particle of type 2 that are in this side of the container'
      } ) );

    this.averageTemperatureProperty = new Property<number | null>( null, {
      units: 'K',
      isValidValue: value => ( value === null || value > 0 ),
      phetioValueType: NullableIO( NumberIO ),
      phetioReadOnly: true, // derived from the state of the particle system
      tandem: tandem.createTandem( 'averageTemperatureProperty' ),
      phetioDocumentation: 'average temperature in this side of the container'
    } );

    this.update( particles1, particles2 );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  /**
   * Updates Properties based on the contents of the particle arrays.
   */
  public update( particles1: DiffusionParticle1[], particles2: DiffusionParticle2[] ): void {

    let numberOfParticles1 = 0;
    let numberOfParticles2 = 0;
    let totalKE = 0;

    // Contribution by DiffusionParticle1 species
    for ( let i = particles1.length - 1; i >= 0; i-- ) {
      const particle = particles1[ i ];
      if ( this.bounds.containsPoint( particle.position ) ) {
        numberOfParticles1++;
        totalKE += particle.getKineticEnergy();
      }
    }

    // Contribution by DiffusionParticle2 species.
    // Note that there's a wee bit of code duplication here, but it gains us some iteration efficiency.
    for ( let i = particles2.length - 1; i >= 0; i-- ) {
      const particle = particles2[ i ];
      if ( this.bounds.containsPoint( particle.position ) ) {
        numberOfParticles2++;
        totalKE += particle.getKineticEnergy();
      }
    }

    // Update number of particles
    this.numberOfParticles1Property.value = numberOfParticles1;
    this.numberOfParticles2Property.value = numberOfParticles2;

    // Update average temperature
    const totalNumberOfParticles = numberOfParticles1 + numberOfParticles2;
    if ( totalNumberOfParticles === 0 ) {
      this.averageTemperatureProperty.value = null;
    }
    else {
      assert && assert( totalKE !== 0, 'totalKE should not be zero when the container is not empty' );

      // T = (2/3)KE/k
      const averageKE = totalKE / totalNumberOfParticles;
      this.averageTemperatureProperty.value = ( 2 / 3 ) * averageKE / GasPropertiesConstants.BOLTZMANN; // K
    }
  }
}

gasProperties.register( 'DiffusionData', DiffusionData );