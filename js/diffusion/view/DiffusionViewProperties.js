// Copyright 2019, University of Colorado Boulder

/**
 * Properties that are specific to the view in the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );

  class DiffusionViewProperties {

    constructor() {

      // @public whether the Data accordion box is expanded
      this.dataExpandedProperty = new BooleanProperty( GasPropertiesQueryParameters.checked );

      // @public whether particle flow rate vectors are visible below the container
      this.particleFlowRateVisibleProperty = new BooleanProperty( GasPropertiesQueryParameters.checked );

      // @public whether the center-of-mass indicators are visible on the container
      this.centerOfMassVisibleProperty = new BooleanProperty( GasPropertiesQueryParameters.checked );
    }

    // @public @override
    reset() {
      this.dataExpandedProperty.reset();
      this.particleFlowRateVisibleProperty.reset();
      this.centerOfMassVisibleProperty.reset();
    }
  }

  return gasProperties.register( 'DiffusionViewProperties', DiffusionViewProperties );
} );