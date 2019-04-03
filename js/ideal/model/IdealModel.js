// Copyright 2019, University of Colorado Boulder

/**
 * Model for the 'Ideal' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const CollisionCounter = require( 'GAS_PROPERTIES/common/model/CollisionCounter' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesModel = require( 'GAS_PROPERTIES/common/model/GasPropertiesModel' );
  const Vector2 = require( 'DOT/Vector2' );

  class IdealModel extends GasPropertiesModel {

    constructor() {
      super();

      // @public (read-only)
      this.collisionCounter = new CollisionCounter( this.collisionDetector, {
        location: new Vector2( 40, 15 ) // view coordinates! determined empirically
      } );
    }

    reset() {
      this.collisionCounter.reset();
      super.reset();
    }

    step( dt ) {
      super.step( dt );

      // Do this after super.step, so that the number of collisions detected has been recorded.
      this.collisionCounter.step( dt );
    }
  }

  return gasProperties.register( 'IdealModel', IdealModel );
} );