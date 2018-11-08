// Copyright 2018, University of Colorado Boulder

/**
 * Properties that are specific to the view in the 'Ideal' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const StringProperty = require( 'AXON/StringProperty' );

  class IdealViewProperties {

    constructor() {

      this.particleTypeProperty = new StringProperty( 'heavy', {
        validValues: [ 'heavy', 'light' ]
      } );

      this.sizeVisibleProperty = new BooleanProperty( false );

      this.stopwatchVisibleProperty = new BooleanProperty( false );

      this.collisionCounterVisibleProperty = new BooleanProperty( false );

      this.particleCountsExpandedProperty = new BooleanProperty( true );
    }

    reset() {
      this.particleTypeProperty.reset();
      this.sizeVisibleProperty.reset();
      this.particleCountsExpandedProperty.reset();
    }
  }

  return gasProperties.register( 'IdealViewProperties', IdealViewProperties );
} );