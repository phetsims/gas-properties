// Copyright 2018-2019, University of Colorado Boulder

/**
 * Properties that are specific to the view in the 'Explore' screen.
 * Adds no additional Properties to the base class, but provided for symmetry in the model-view type hierarchy.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesViewProperties = require( 'GAS_PROPERTIES/common/view/GasPropertiesViewProperties' );

  class ExploreViewProperties extends GasPropertiesViewProperties {

    constructor() {
      super();
    }
  }

  return gasProperties.register( 'ExploreViewProperties', ExploreViewProperties );
} );