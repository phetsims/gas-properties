// Copyright 2018, University of Colorado Boulder

/**
 * Model for the collision counter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const NumberProperty = require( 'AXON/NumberProperty' );

  class CollisionCounter {

    constructor() {

      // @public the number of collisions between the particles and the container walls
      this.numberOfCollisionsProperty = new NumberProperty( 0, {
        isValidValue: value => ( value >= 0 )
      } );

      // @public whether the collision counter is running
      this.isRunningProperty = new BooleanProperty( false );

      // When the collision counter stops running, reset the number of collisions.
      this.isRunningProperty.link( isRunning => {
        if ( !isRunning ) {
          this.numberOfCollisionsProperty.value = 0;
        }
      } );

      // @public (read-only) valid values for averagingTimeProperty, in ps
      this.averagingTimes = [ 10, 25, 50, 100 ];

      // @public collision averaging time, in ps
      this.averagingTimeProperty = new NumberProperty( 10, {
        validValues: this.averagingTimes
      } );
    }

    reset() {
      this.numberOfCollisionsProperty.reset();
      this.isRunningProperty.reset();
      this.averagingTimeProperty.reset();
    }
  }

  return gasProperties.register( 'CollisionCounter', CollisionCounter );
} );