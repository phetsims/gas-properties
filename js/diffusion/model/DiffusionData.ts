// Copyright 2019-2024, University of Colorado Boulder

/**
 * DiffusionData is responsible for information related to one half of the container.
 * This information is displayed in the 'Data' accordion box on the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Disposable from '../../../../axon/js/Disposable.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import gasProperties from '../../gasProperties.js';
import DiffusionParticleSystem from './DiffusionParticleSystem.js';

export default class DiffusionData {

  // bounds of one half of the container
  private readonly bounds: Bounds2;

  private readonly particleSystem: DiffusionParticleSystem;

  // number of DiffusionParticle1 in this half of the container
  public readonly numberOfParticles1Property: TReadOnlyProperty<number>;
  private readonly _numberOfParticles1Property: Property<number>;

  // number of DiffusionParticle2 in this half of the container
  public readonly numberOfParticles2Property: TReadOnlyProperty<number>;
  private readonly _numberOfParticles2Property: Property<number>;

  // average temperature in this half of the container, in K
  // null when there are no particles in this half of the container.
  public readonly averageTemperatureProperty: TReadOnlyProperty<number | null>;
  private readonly _averageTemperatureProperty: Property<number | null>;

  public constructor( bounds: Bounds2, particleSystem: DiffusionParticleSystem,
                      leftOrRightString: 'left' | 'right', tandem: Tandem ) {

    this.bounds = bounds;
    this.particleSystem = particleSystem;

    this._numberOfParticles1Property = new NumberProperty( 0, {
      numberType: 'Integer',
      isValidValue: value => ( value >= 0 ),
      tandem: tandem.createTandem( 'numberOfParticles1Property' ),
      phetioReadOnly: true, // derived from the state of the particle system
      phetioFeatured: true,
      phetioDocumentation: `Number of particles of type 1 that are in the ${leftOrRightString} half of the container.`
    } );
    this.numberOfParticles1Property = this._numberOfParticles1Property;

    this._numberOfParticles2Property = new NumberProperty( 0, {
      numberType: 'Integer',
      isValidValue: value => ( value >= 0 ),
      tandem: tandem.createTandem( 'numberOfParticles2Property' ),
      phetioReadOnly: true, // derived from the state of the particle system
      phetioFeatured: true,
      phetioDocumentation: `Number of particles of type 2 that are in the ${leftOrRightString} half of the container.`
    } );
    this.numberOfParticles2Property = this._numberOfParticles2Property;

    this._averageTemperatureProperty = new Property<number | null>( null, {
      units: 'K',
      isValidValue: value => ( value === null || value > 0 ),
      phetioValueType: NullableIO( NumberIO ),
      tandem: tandem.createTandem( 'averageTemperatureProperty' ),
      phetioReadOnly: true, // derived from the state of the particle system
      phetioFeatured: true,
      phetioDocumentation: `Average temperature in the ${leftOrRightString} half of the container.`
    } );
    this.averageTemperatureProperty = this._averageTemperatureProperty;

    this.update();
  }

  public dispose(): void {
    Disposable.assertNotDisposable();
  }

  /**
   * Updates Properties based on the contents of the particle arrays.
   */
  public update(): void {

    let numberOfParticles1 = 0;
    let numberOfParticles2 = 0;
    let totalKE = 0;

    // Contribution by DiffusionParticle1 species
    for ( let i = this.particleSystem.particles1.length - 1; i >= 0; i-- ) {
      const particle = this.particleSystem.particles1[ i ];
      if ( this.bounds.containsCoordinates( particle.x, particle.y ) ) {
        numberOfParticles1++;
        totalKE += particle.getKineticEnergy();
      }
    }

    // Contribution by DiffusionParticle2 species.
    // Note that there's a wee bit of code duplication here, but it gains us some iteration efficiency.
    for ( let i = this.particleSystem.particles2.length - 1; i >= 0; i-- ) {
      const particle = this.particleSystem.particles2[ i ];
      if ( this.bounds.containsCoordinates( particle.x, particle.y ) ) {
        numberOfParticles2++;
        totalKE += particle.getKineticEnergy();
      }
    }

    // Update number of particles
    this._numberOfParticles1Property.value = numberOfParticles1;
    this._numberOfParticles2Property.value = numberOfParticles2;

    // Update average temperature
    const totalNumberOfParticles = numberOfParticles1 + numberOfParticles2;
    if ( totalNumberOfParticles === 0 ) {
      this._averageTemperatureProperty.value = null;
    }
    else {
      assert && assert( totalKE !== 0, 'totalKE should not be zero when the container is not empty' );

      // T = (2/3)KE/k
      const averageKE = totalKE / totalNumberOfParticles;
      this._averageTemperatureProperty.value = ( 2 / 3 ) * averageKE / GasPropertiesConstants.BOLTZMANN; // K
    }
  }
}

gasProperties.register( 'DiffusionData', DiffusionData );