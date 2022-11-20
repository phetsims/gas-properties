// Copyright 2019-2022, University of Colorado Boulder

/**
 * DiffusionViewProperties defines Properties that are specific to the view in the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import gasProperties from '../../gasProperties.js';

export default class DiffusionViewProperties {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    // @public
    this.dataExpandedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'dataExpandedProperty' ),
      phetioDocumentation: 'whether the Data accordion box is expanded'
    } );

    // @public
    this.particleFlowRateVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'particleFlowRateVisibleProperty' ),
      phetioDocumentation: 'whether particle flow rate vectors are visible below the container'
    } );

    // @public
    this.centerOfMassVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'centerOfMassVisibleProperty' ),
      phetioDocumentation: 'whether the center-of-mass indicators are visible on the container'
    } );

    // @public
    this.scaleVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'scaleVisibleProperty' ),
      phetioDocumentation: 'whether the scale is visible on the container'
    } );
  }

  // @public
  reset() {
    this.dataExpandedProperty.reset();
    this.particleFlowRateVisibleProperty.reset();
    this.centerOfMassVisibleProperty.reset();
    this.scaleVisibleProperty.reset();
  }
}

gasProperties.register( 'DiffusionViewProperties', DiffusionViewProperties );