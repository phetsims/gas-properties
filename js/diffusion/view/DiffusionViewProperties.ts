// Copyright 2019-2022, University of Colorado Boulder

/**
 * DiffusionViewProperties defines Properties that are specific to the view in the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';

export default class DiffusionViewProperties {

  public readonly dataExpandedProperty: Property<boolean>;
  public readonly particleFlowRateVisibleProperty: Property<boolean>;
  public readonly centerOfMassVisibleProperty: Property<boolean>;
  public readonly scaleVisibleProperty: Property<boolean>;

  public constructor( tandem: Tandem ) {

    this.dataExpandedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'dataExpandedProperty' ),
      phetioDocumentation: 'whether the Data accordion box is expanded'
    } );

    this.particleFlowRateVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'particleFlowRateVisibleProperty' ),
      phetioDocumentation: 'whether particle flow rate vectors are visible below the container'
    } );

    this.centerOfMassVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'centerOfMassVisibleProperty' ),
      phetioDocumentation: 'whether the center-of-mass indicators are visible on the container'
    } );

    this.scaleVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'scaleVisibleProperty' ),
      phetioDocumentation: 'whether the scale is visible on the container'
    } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  public reset(): void {
    this.dataExpandedProperty.reset();
    this.particleFlowRateVisibleProperty.reset();
    this.centerOfMassVisibleProperty.reset();
    this.scaleVisibleProperty.reset();
  }
}

gasProperties.register( 'DiffusionViewProperties', DiffusionViewProperties );