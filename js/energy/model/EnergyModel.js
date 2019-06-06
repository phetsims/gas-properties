// Copyright 2018-2019, University of Colorado Boulder

/**
 * Model for the 'Energy' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AverageSpeedModel = require( 'GAS_PROPERTIES/energy/model/AverageSpeedModel' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesModel = require( 'GAS_PROPERTIES/common/model/GasPropertiesModel' );
  const HistogramsModel = require( 'GAS_PROPERTIES/energy/model/HistogramsModel' );
  const HoldConstant = require( 'GAS_PROPERTIES/common/model/HoldConstant' );
  const Tandem = require( 'TANDEM/Tandem' );

  // constants
  const SAMPLE_PERIOD = 1; // sample period for Average Speed and histograms, in ps

  class EnergyModel extends GasPropertiesModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {
      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      super( tandem, {
        holdConstant: HoldConstant.VOLUME,
        hasCollisionCounter: false
      } );

      // In case clients attempt to use this feature of the base class
      this.holdConstantProperty.lazyLink( holdConstant => {
        throw new Error( 'holdConstant is fixed in the Energy screen' );
      } );

      // In case clients attempt to use this feature of the base class
      this.container.widthProperty.lazyLink( width => {
        throw new Error( 'container width is fixed in the Energy screen' );
      } );

      // @public (read-only)
      this.histogramsModel = new HistogramsModel( this, SAMPLE_PERIOD );

      // @public
      this.averageSpeedModel = new AverageSpeedModel( this, SAMPLE_PERIOD );
    }

    /**
     * Resets this model.
     * @public
     * @override
     */
    reset() {
      super.reset();
      this.averageSpeedModel.reset();
      this.histogramsModel.reset();
    }

    /**
     * Steps the model using model time units.
     * @param {number} dt - time delta, in ps
     * @protected
     * @override
     */
    stepModelTime( dt ) {
      assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );

      super.stepModelTime( dt );
      this.averageSpeedModel.step( dt );
      this.histogramsModel.step( dt );
    }
  }

  return gasProperties.register( 'EnergyModel', EnergyModel );
} );