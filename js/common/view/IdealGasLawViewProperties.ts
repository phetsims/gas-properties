// Copyright 2018-2022, University of Colorado Boulder

// @ts-nocheck
/**
 * IdealGasLawViewProperties is the base class for view-specific Properties that are common to the
 * screens that are based on the Ideal Gas Law.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationDeprecatedProperty from '../../../../axon/js/EnumerationDeprecatedProperty.js';
import gasProperties from '../../gasProperties.js';
import ParticleType from '../model/ParticleType.js';

class IdealGasLawViewProperties {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    // @public
    this.widthVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'widthVisibleProperty' ),
      phetioDocumentation: 'whether dimensional arrows are visible for the width of the container'
    } );

    // @public
    this.particlesExpandedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'particlesExpandedProperty' ),
      phetioDocumentation: 'whether the Particles accordion box is expanded'
    } );

    // @public
    this.particleTypeProperty = new EnumerationDeprecatedProperty( ParticleType, ParticleType.HEAVY, {
      tandem: tandem.createTandem( 'particleTypeProperty' ),
      phetioDocumentation: 'the particle type that will be dispensed by the bicycle pump'
    } );
  }

  // @public
  reset() {
    this.widthVisibleProperty.reset();
    this.particlesExpandedProperty.reset();
    this.particleTypeProperty.reset();
  }
}

gasProperties.register( 'IdealGasLawViewProperties', IdealGasLawViewProperties );
export default IdealGasLawViewProperties;