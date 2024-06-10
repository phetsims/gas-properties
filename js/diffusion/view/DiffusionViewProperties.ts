// Copyright 2019-2024, University of Colorado Boulder

/**
 * DiffusionViewProperties defines Properties that are specific to the view in the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Disposable from '../../../../axon/js/Disposable.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';

export default class DiffusionViewProperties {

  public readonly dataExpandedProperty: Property<boolean>;
  public readonly particleFlowRateVisibleProperty: Property<boolean>;
  public readonly centerOfMassVisibleProperty: Property<boolean>;
  public readonly scaleVisibleProperty: Property<boolean>;

  // Provided for PhET-iO, to facilitate experiments with a single particle type.
  // See https://github.com/phetsims/gas-properties/issues/255
  public readonly numberOfParticleTypesProperty: Property<number>;

  public constructor( tandem: Tandem ) {

    this.dataExpandedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'dataExpandedProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Whether the Data accordion box is expanded.'
    } );

    this.particleFlowRateVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'particleFlowRateVisibleProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Whether particle flow rate vectors are visible below the container.'
    } );

    this.centerOfMassVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'centerOfMassVisibleProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Whether the center-of-mass indicators are visible on the container.'
    } );

    this.scaleVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'scaleVisibleProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Whether the scale is visible on the container.'
    } );

    this.numberOfParticleTypesProperty = new NumberProperty( 2, {
      numberType: 'Integer',
      validValues: [ 1, 2 ],
      tandem: tandem.createTandem( 'numberOfParticleTypesProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'The number of particle types shown in the user interface.'
    } );
  }

  public dispose(): void {
    Disposable.assertNotDisposable();
  }

  public reset(): void {
    this.dataExpandedProperty.reset();
    this.particleFlowRateVisibleProperty.reset();
    this.centerOfMassVisibleProperty.reset();
    this.scaleVisibleProperty.reset();
    // Do not reset numberOfParticleTypesProperty, because it is for PhET-iO only.
  }
}

gasProperties.register( 'DiffusionViewProperties', DiffusionViewProperties );