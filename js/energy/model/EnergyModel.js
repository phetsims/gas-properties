// Copyright 2018-2020, University of Colorado Boulder

/**
 * EnergyModel is the top-level model for the 'Energy' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import HoldConstant from '../../common/model/HoldConstant.js';
import IdealGasLawModel from '../../common/model/IdealGasLawModel.js';
import gasProperties from '../../gasProperties.js';
import AverageSpeedModel from './AverageSpeedModel.js';
import HistogramsModel from './HistogramsModel.js';

// constants
const SAMPLE_PERIOD = 1; // sample period for Average Speed and histograms, in ps

export default class EnergyModel extends IdealGasLawModel {

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
    this.histogramsModel = new HistogramsModel( this.particleSystem, this.isPlayingProperty, SAMPLE_PERIOD, {
      tandem: tandem.createTandem( 'histogramsModel' )
    } );

    // @public
    this.averageSpeedModel = new AverageSpeedModel( this.particleSystem, this.isPlayingProperty, SAMPLE_PERIOD, {
      tandem: tandem.createTandem( 'averageSpeedModel' )
    } );
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

gasProperties.register( 'EnergyModel', EnergyModel );