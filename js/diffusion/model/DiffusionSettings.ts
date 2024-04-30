// Copyright 2019-2024, University of Colorado Boulder

/**
 * DiffusionSettings defines the settings that initialize one side of the container in the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Disposable from '../../../../axon/js/Disposable.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import gasProperties from '../../gasProperties.js';

export default class DiffusionSettings {

  public readonly numberOfParticlesProperty: NumberProperty;
  public readonly massProperty: NumberProperty; // mass, in AMU
  public readonly radiusProperty: NumberProperty; // radius, in pm
  public readonly initialTemperatureProperty: NumberProperty; // initial temperature, in K, used to compute initial velocity

  // Property values must be a multiple of these deltas
  public static readonly DELTAS = {
    numberOfParticles: 10,
    mass: 1, // AMU
    radius: 5, // pm
    initialTemperature: 50 // K
  };

  public constructor( tandem: Tandem ) {

    this.numberOfParticlesProperty =
      new NumberProperty( GasPropertiesConstants.DIFFUSION_NUMBER_OF_PARTICLES_RANGE.defaultValue, {
        numberType: 'Integer',
        range: GasPropertiesConstants.DIFFUSION_NUMBER_OF_PARTICLES_RANGE,
        hasListenerOrderDependencies: true, // TODO: https://github.com/phetsims/gas-properties/issues/186
        isValidValue: value => ( value % DiffusionSettings.DELTAS.numberOfParticles === 0 ),
        tandem: tandem.createTandem( 'numberOfParticlesProperty' )
      } );

    this.massProperty = new NumberProperty( GasPropertiesConstants.DIFFUSION_MASS_RANGE.defaultValue, {
      numberType: 'Integer',
      range: GasPropertiesConstants.DIFFUSION_MASS_RANGE,
      units: 'AMU',
      isValidValue: value => ( value % DiffusionSettings.DELTAS.mass === 0 ),
      tandem: tandem.createTandem( 'massProperty' )
    } );

    this.radiusProperty = new NumberProperty( GasPropertiesConstants.DIFFUSION_RADIUS_RANGE.defaultValue, {
      numberType: 'Integer',
      range: GasPropertiesConstants.DIFFUSION_RADIUS_RANGE,
      units: 'pm',
      isValidValue: value => ( value % DiffusionSettings.DELTAS.radius === 0 ),
      tandem: tandem.createTandem( 'radiusProperty' )
    } );

    this.initialTemperatureProperty =
      new NumberProperty( GasPropertiesConstants.DIFFUSION_INITIAL_TEMPERATURE_RANGE.defaultValue, {
        numberType: 'Integer',
        range: GasPropertiesConstants.DIFFUSION_INITIAL_TEMPERATURE_RANGE,
        units: 'K',
        isValidValue: value => ( value % DiffusionSettings.DELTAS.initialTemperature === 0 ),
        tandem: tandem.createTandem( 'initialTemperatureProperty' ),
        phetioDocumentation: 'Temperature used to determine initial speed of particles.'
      } );
  }

  public dispose(): void {
    Disposable.assertNotDisposable();
  }

  public reset(): void {
    this.numberOfParticlesProperty.reset();
    this.massProperty.reset();
    this.radiusProperty.reset();
    this.initialTemperatureProperty.reset();
  }

  /**
   * Restarts an experiment with the same settings.
   * This forces the current set of particles to be deleted, and a new set of particles to be created.
   */
  public restart(): void {
    const numberOfParticles = this.numberOfParticlesProperty.value;
    this.numberOfParticlesProperty.value = 0;
    this.numberOfParticlesProperty.value = numberOfParticles;
  }
}

gasProperties.register( 'DiffusionSettings', DiffusionSettings );