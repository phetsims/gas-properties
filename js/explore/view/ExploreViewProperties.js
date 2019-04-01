// Copyright 2018-2019, University of Colorado Boulder

/**
 * Properties that are specific to the view in the 'Explore' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const ParticleTypeEnum = require( 'GAS_PROPERTIES/common/model/ParticleTypeEnum' );
  const Property = require( 'AXON/Property' );

  class ExploreViewProperties {

    constructor() {

      // @public the particle type that will be dispensed by the bicycle pump
      this.particleTypeProperty = new Property( ParticleTypeEnum.HEAVY, {
        isValidValue: value => ParticleTypeEnum.includes( value )
      } );

      // @public whether dimensional arrows are visible for the width of the container
      this.sizeVisibleProperty = new BooleanProperty( false );

      // @public whether the 'Particles Counts' accordion box is expanded
      this.particleCountsExpandedProperty = new BooleanProperty( false );
    }

    reset() {
      this.particleTypeProperty.reset();
      this.sizeVisibleProperty.reset();
      this.particleCountsExpandedProperty.reset();
    }
  }

  return gasProperties.register( 'ExploreViewProperties', ExploreViewProperties );
} );